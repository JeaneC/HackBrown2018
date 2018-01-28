import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image,
	StatusBar,
	Animated,
	Easing,
	Text,
	TouchableOpacity
} from 'react-native';

import { Cubes, refresh, MiniThumbUp, MiniThumbDown } from '../assets';
import { Constants, Location, Permissions } from 'expo';
import { database, firebase } from '../firebase/firebase';
import HateButton from '../components/HateButton';
import GestureRecognizer, {
	swipeDirections
} from 'react-native-swipe-gestures';

import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';

import { APP_GRADIENT, WHITE, DARK_FONT, MAIN_BLUE } from '../common/constants';
import { LinearGradient } from 'expo';

const sampleList = [
	{ sum: 50, name: 'Music', time: 0 },
	{ sum: -30, name: 'Travel', time: 0 },
	{ sum: 20, name: 'Bews', time: 0 }
];
class EndScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			location: null,
			errorMessage: null,
			latitude: 0,
			longitude: 0,
			altitude: 0,
			summaryList: sampleList,
			userList: [this.props.name],
			synced: false
		};
	}
	buttonPress = () => {
		this._getLocationAsync();
		console.log('hi');
	};

	onSwipeUp(gestureState) {
		this.setState({ myText: 'You swiped up!' });
	}

	onSwipeDown(gestureState) {
		this.setState({ myText: 'You swiped down!' });
	}

	onSwipeLeft(gestureState) {
		this.setState({ myText: 'You swiped left!' });
		console.log('SWIPED LEFT');
	}

	onSwipeRight(gestureState) {
		this.setState({ myText: 'You swiped right!' });
		console.log('SWIPED RIGHT');
	}

	onSwipe(gestureName, gestureState) {
		const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
		this.setState({ gestureName: gestureName });
		switch (gestureName) {
			case SWIPE_UP:
				this.setState({ backgroundColor: 'red' });
				break;
			case SWIPE_DOWN:
				this.setState({ backgroundColor: 'green' });
				break;
			case SWIPE_LEFT:
				this.setState({ backgroundColor: 'blue' });
				break;
			case SWIPE_RIGHT:
				this.setState({ backgroundColor: 'yellow' });
				break;
		}
	}

	//Navigate to previous screen
	onPress = () => {
		this.leave();
		// let userList = [...this.state.userList];
		// userList.push('Lily M');
		// this.setState({ userList });
	};

	leave = () => {
		this.refs.container.zoomOut(300).then(() => {
			this.props.navigation.navigate('loading');
		});
	};

	async componentDidMount() {
		let objectList = await database
			.ref(`Session/${this.props.id}/cardStack`)
			.once('value')
			.then(snapshot => snapshot.val());

		let meep = objectList.map(({ feedback, name }) => {
			let sum = 0;
			let keys = Object.keys(feedback);
			keys.map(key => {
				sum += feedback[key];
			});
			console.log('name \n', sum);
			let listObject = {
				sum,
				name
			};
			return listObject;
		});

		this.setState({ summaryList: meep });
		console.log('meep \n', meep);
	}

	render() {
		const config = {
			velocityThreshold: 0.3,
			directionalOffsetThreshold: 80
		};

		return (
			<GestureRecognizer
				onSwipe={(direction, state) => this.onSwipe(direction, state)}
				onSwipeUp={state => this.onSwipeUp(state)}
				onSwipeDown={state => this.onSwipeDown(state)}
				onSwipeLeft={state => this.onSwipeLeft(state)}
				onSwipeRight={state => this.onSwipeRight(state)}
				config={config}
				style={{
					flex: 1,
					backgroundColor: this.state.backgroundColor
				}}
			>
				<View style={styles.mainFrame}>
					<StatusBar barStyle="light-content" />
					<LinearGradient colors={APP_GRADIENT} style={styles.container} />
					<Animatable.View style={{ flex: 1 }} ref="container">
						<Animatable.View
							style={[styles.transparent, styles.header]}
							animation="fadeIn"
							delay={500}
						>
							<Animatable.Image
								source={Cubes}
								delay={500}
								ref="image"
								animation="pulse"
								easing="ease-out"
								iterationCount="infinite"
								style={{ resizeMode: 'contain', width: 250, height: 125 }}
							/>
						</Animatable.View>
						<Animatable.View
							style={[styles.transparent, styles.body]}
							animation="fadeInUp"
							delay={700}
							duration={500}
						>
							{this.state.summaryList.map((summary, index) => {
								let image = summary.sum > 0 ? MiniThumbUp : MiniThumbDown;
								return (
									<Animatable.View style={styles.rowEle} key={index}>
										<View
											style={{
												width: 200,
												height: 100,
												justifyContent: 'center',
												alignItems: 'center'
											}}
										>
											<Animatable.Text
												key={index}
												style={styles.userStyle}
												animation="fadeInUp"
												duration={500}
											>
												{summary.name}
											</Animatable.Text>
										</View>
										<View
											style={{
												width: 50,
												height: 100,
												justifyContent: 'center',
												alignItems: 'center'
											}}
										>
											<Image source={image} />
										</View>
									</Animatable.View>
								);
							})}
						</Animatable.View>

						<Animatable.View
							style={[styles.transparent, styles.footer]}
							delay={1000}
							animation="fadeInUp"
							duration={500}
						>
							<Animatable.View
								style={[styles.button, { marginTop: 30 }]}
								animation="fadeInUp"
								duration={500}
							>
								<TouchableOpacity
									style={{
										flex: 1,
										alignItems: 'center',
										justifyContent: 'center'
									}}
									onPress={this.onPress}
								>
									<Text
										style={styles.buttonText}
										animation="fadeInUp"
										duration={500}
									>
										Again!
									</Text>
								</TouchableOpacity>
							</Animatable.View>
						</Animatable.View>
					</Animatable.View>
				</View>
			</GestureRecognizer>
		);
	}
}

const styles = StyleSheet.create({
	mainFrame: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	transparent: {
		backgroundColor: 'transparent'
	},
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	},
	rowEle: {
		height: 100,
		width: 300,
		flexDirection: 'row',

		justifyContent: 'center',
		alignItems: 'center'
	},
	fade: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: 20,
		backgroundColor: 'white',
		opacity: 0.3
	},
	header: {
		flex: 3,
		paddingTop: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	body: {
		flex: 4.5,
		paddingTop: 70,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 30,
		width: 300
	},
	headerText: {
		fontSize: 48,
		fontWeight: '900',
		color: WHITE
	},
	userStyle: {
		fontSize: 22,
		color: WHITE,
		fontWeight: '900'
	},
	footer: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 20
	},
	button: {
		width: 245,
		height: 60,
		backgroundColor: WHITE,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText: {
		fontSize: 20,
		fontWeight: '900',
		color: DARK_FONT
	}
});

const mapStateToProps = ({ session }) => {
	return {
		name: session.name,
		id: session.sessionId
	};
};

export default connect(mapStateToProps)(EndScreen);

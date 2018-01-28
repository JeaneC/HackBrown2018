import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image,
	StatusBar,
	Animated,
	Easing,
	Text,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView
} from 'react-native';

import LoveButton from '../components/LoveButton';
import * as Animatable from 'react-native-animatable';

import { connect } from 'react-redux';
import { setLoveList } from '../actions';

import { APP_GRADIENT, WHITE, DARK_FONT } from '../common/constants';
import { Cubes } from '../assets';
import { LinearGradient } from 'expo';
import GestureRecognizer, {
	swipeDirections
} from 'react-native-swipe-gestures';

class LoveScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loveCount: 0,
			loveList: ['', '', ''],
			iteration: 10
		};
	}
	componentDidMount() {}

	onPress = () => {
		console.log('hi');
	};

	addButton = () => {
		this.setState({ loveCount: this.state.loveCount + 1 });

		if (this.state.loveCount == 2) {
			this.setState({ iteration: 1 });
			this.refs.addText.fadeOut(500);
		}
	};

	onSwipeLeft(gestureState) {
		this.setState({ myText: 'You swiped left!' });
		this.refs.container.zoomOut(300).then(() => {
			console.log('current List', this.state.loveList);
			this.props.setLoveList(this.state.loveList);
			this.props.navigation.navigate('hate');
		});
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

	changeText = (index, text) => {
		let loveList = [...this.state.loveList];

		loveList[index] = text;
		this.setState({ loveList });
	};

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
				<KeyboardAvoidingView style={styles.mainFrame} behavior="padding">
					<StatusBar barStyle="light-content" />
					<LinearGradient colors={APP_GRADIENT} style={styles.container} />
					<Animatable.View style={{ flex: 1 }} ref="container">
						<TouchableOpacity
							style={[styles.transparent, styles.header]}
							onPress={this.onPress}
						>
							<Animatable.Text
								animation="fadeIn"
								duration={500}
								style={styles.headerText}
								ref="text"
							>
								Love
							</Animatable.Text>
						</TouchableOpacity>
						<Animatable.View
							style={[styles.transparent, styles.body]}
							animation="fadeIn"
							delay={500}
							duration={200}
						>
							{this.state.loveList.map((text, index) => {
								if (index < this.state.loveCount) {
									return (
										<LoveButton
											key={index}
											num={index}
											text={text}
											changeText={this.changeText}
										/>
									);
								}
							})}
							<TouchableOpacity onPress={this.addButton}>
								<Animatable.Text
									ref="addText"
									style={styles.moreText}
									animation="pulse"
									easing="ease-out"
									delay={500}
									iterationCount={this.state.iteration}
								>
									Add A Like!
								</Animatable.Text>
							</TouchableOpacity>
						</Animatable.View>
						<View style={[styles.transparent, styles.footer]} />
					</Animatable.View>
				</KeyboardAvoidingView>
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
	header: {
		flex: 4,
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	body: {
		flex: 3.5,
		alignItems: 'center'
	},
	headerText: {
		fontSize: 48,
		fontWeight: '900',
		color: WHITE,
		opacity: 1
	},
	moreText: {
		color: WHITE,
		fontWeight: '900',
		fontSize: 20,
		marginTop: 10
	},
	footer: {
		flex: 1.5,
		paddingTop: 20
	}
});

const mapDispatchToProps = dispatch => ({
	setLoveList: list => {
		dispatch(setLoveList(list));
	}
});

export default connect(null, mapDispatchToProps)(LoveScreen);

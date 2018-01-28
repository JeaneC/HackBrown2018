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

import { connect } from 'react-redux';
import { APP_GRADIENT } from '../common/constants';
import { Cubes, ThumbUp, ThumbDown } from '../assets';
import { LinearGradient } from 'expo';
import GestureRecognizer, {
	swipeDirections
} from 'react-native-swipe-gestures';

const KEY = '-L3vcuzqhoHvYpATJWfp';

import { database } from '../firebase/firebase';

import * as Animatable from 'react-native-animatable';

class CardScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			counter: -1,
			name: '',
			time: '',
			cardStack: []
		};
	}

	async componentDidMount() {
		// console.log(this.props.sessionId);
		console.log('mounting', this.props.mainUser);
		if (this.props.mainUser) {
			let cardStack = await database
				.ref(`Session/${this.props.sessionId}`)
				.once('value')
				.then(snapshot => {
					let data = snapshot.val();
					let { cardStack } = data;
					return cardStack;
				});

			let { name } = cardStack[0];
			this.setState({
				counter: 0,
				time: 20,
				cardStack,
				name
			});
			this.timer = setInterval(this.updateMain, 1000);
		} else {
			console.log('NOT THE MAIN USER');
			database.ref(`Session/${this.props.sessionId}`).on('value', snapshot => {
				let settings = snapshot.val();
				console.log('settings on non-main', settings);
				this.updateSettings(settings);
			});
		}
	}
	leave = () => {
		this.refs.container.zoomOut(300).then(() => {
			this.props.navigation.navigate('end');
		});
	};

	updateMain = async () => {
		let { counter } = this.state;
		let settings = await database
			.ref(`Session/${this.props.sessionId}`)
			.once('value')
			.then(snapshot => {
				let data = snapshot.val();
				return data;
			});

		// console.log('settings data', settings);

		let currentCard = settings['cardStack'][counter];

		// console.log('current card', currentCard);
		let { feedback, time } = currentCard;
		if (counter >= settings['cardStack'].length - 1 && time <= 0) {
			console.log('got here');
			clearInterval(this.timer);
			this.leave();
			return;
		}

		if (time <= 0) {
			console.log('no time');
			let newCounter = this.state.counter + 1;
			console.log(newCounter);
			database.ref(`Session/${this.props.sessionId}/counter`).set(newCounter);
			let newName = this.state.cardStack[newCounter].name;
			this.setState({
				time: 20,
				counter: newCounter,
				name: newName
			});
		} else {
			let newTime = this.state.time - 1;
			console.log('new time needed', newTime);

			database
				.ref(`Session/${this.props.sessionId}/cardStack/${counter}/time`)
				.set(newTime);
			this.setState({ time: newTime });
		}
		console.log(currentCard);
	};

	updateSettings = settings => {
		let { counter, cardStack } = settings;

		let { time, feedback, name } = cardStack[counter];
		this.setState({ time, name });

		if (counter >= cardStack.length - 1 && time <= 0) {
			console.log('got here');
			clearInterval(this.timer);
			this.leave();
			return;
		}

		//We need to essentially update the app
		if (counter != this.state.counter) {
			this.setState({ counter });
		} else {
		}
	};

	onThumbUp = () => {
		var newPostRef = database
			.ref(
				`Session/${this.props.sessionId}/cardStack/${
					this.state.counter
				}/feedback`
			)
			.push();
		newPostRef.set(5);
	};

	onThumbDown = () => {
		var newPostRef = database
			.ref(
				`Session/${this.props.sessionId}/cardStack/${
					this.state.counter
				}/feedback`
			)
			.push();
		newPostRef.set(-5);
	};

	render() {
		return (
			<View style={styles.mainFrame}>
				<StatusBar barStyle="light-content" />
				<LinearGradient colors={APP_GRADIENT} style={styles.container} />
				<Animatable.View
					delay={500}
					ref="container"
					animation="fadeIn"
					duration={500}
					style={[
						{ flex: 1, justifyContent: 'center', alignItems: 'center' },
						styles.transparent
					]}
				>
					<View style={{ flex: 2.5 }} />
					<View
						style={{
							flex: 4,
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Text style={styles.header}>{this.state.name}</Text>
						<Animatable.Text
							style={styles.timer}
							delay={500}
							ref="image"
							animation="pulse"
							easing="ease-out"
							iterationCount="infinite"
						>
							{this.state.time}
						</Animatable.Text>
						<View
							style={{
								height: 100,
								width: 300,
								flexDirection: 'row',
								justifyContent: 'space-around'
							}}
						>
							<TouchableOpacity
								style={[styles.button, { marginRight: 20, paddingTop: 10 }]}
								onPress={this.onThumbDown}
							>
								<View style={[styles.fade]} />

								<Image source={ThumbDown} />
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.button]}
								onPress={this.onThumbUp}
							>
								<View style={[styles.fade]} />

								<Image source={ThumbUp} />
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ flex: 2.5 }} />
				</Animatable.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mainFrame: {
		flex: 1,
		backgroundColor: 'red',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	},
	transparent: {
		backgroundColor: 'transparent'
	},
	header: {
		fontSize: 32,
		color: 'white',
		fontWeight: 'bold'
	},
	timer: {
		fontSize: 50,
		color: 'white',
		fontWeight: '900'
	},
	button: {
		flex: 1,
		width: 140,
		height: 100,
		borderRadius: 20,
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
		opacity: 0.2
	}
});
const mapStateToProps = ({ session }) => {
	let { mainUser, sessionId } = session;
	return { mainUser, sessionId };
};
export default connect(mapStateToProps)(CardScreen);

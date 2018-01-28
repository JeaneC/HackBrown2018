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

import { database } from '../firebase/firebase';

import { connect } from 'react-redux';
import { setFacebookName, setFacebookData } from '../actions';
import { APP_GRADIENT, WHITE } from '../common/constants';
import { Cubes, FacebookIcon } from '../assets';
import { LinearGradient } from 'expo';
import GestureRecognizer, {
	swipeDirections
} from 'react-native-swipe-gestures';

import * as Animatable from 'react-native-animatable';

const APP_SECRET = '7dc5a4dfe2de55aa9306a40418a13320';
let TOKEN1 =
	'EAACEdEose0cBAIRZB0kWCLlFhmEI4LU6mkNbZCfSiha9BCwuZBrGXiqhFHLEvtf2ZAGKvkznJGbZC2keJNDInwolqPiAyz3onhzD8mKaH7uSNbZChSKEqXIrhbdfOezETw4PmbPVcptfjfqEcrOsN9zv8681ou9LojebJe1MUzG3GonnWIVinxo6e4ywY4w8tKhdYKZBuCNmAZDZD';

let TOKEN2 =
	'EAACppv8LaToBAEQn6ppKF4UI7sU3x9astuXsIBrc6FHSXY2do5WeZAFtz1Q2KkdLN5Vh8ZAzBZBkc9dTZACJncMmNHMu0EdFyfFpcLd5HnAetR6ZC1FRvblXicrOsvl5MbMcD0EKsaaa0GybssUKI0BkFQIxkfCrc4yQuIyPi6Wh9EHlXiq03fr4ZB65VQKoOoKVWUwsJ7wwZDZD';
class FacebookScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			token1: TOKEN1,
			token2: TOKEN2
		};
	}

	componentDidMount() {
		database.ref('Tokens').once('value', snapshot => {
			val = snapshot.val();
			this.setState({ token1: val[0], token2: val[1] });
		});
		// this.spin();
	}

	onSwipeUp(gestureState) {
		this.setState({ myText: 'You swiped up!' });
	}

	onSwipeDown(gestureState) {
		this.setState({ myText: 'You swiped down!' });
	}

	onSwipeLeft(gestureState) {
		this.setState({ myText: 'You swiped left!' });
		this.leave();

		console.log('SWIPED LEFT');
	}

	leave = () => {
		this.refs.container.zoomOut(300).then(() => {
			this.props.navigation.navigate('love');
		});
	};

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
	logIn = async () => {
		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
			'186534708603194',
			{
				permissions: ['public_profile']
			}
		);
		if (type === 'success') {
			// Get the user's name using Facebook's Graph API
			const response = await fetch(
				`https://graph.facebook.com/v2.11/me?fields=id,name,picture&access_token=${token}`
			);
			const data = JSON.parse(response._bodyInit);
			const { id, name, picture } = data;
			console.log(data);

			this.props.setFacebookName(name);
			let token2 = TOKEN1;

			console.log('name', name);
			if (name == 'John Carlos') {
				console.log('this is john');
				token2 = this.state.token1;
				this.leave();
				return;
			} else if ((name = 'Jiayi Lily Ma')) {
				token2 = this.state.token2;
				this.leave();
				return;
			} else {
				// WE NEED TO JUST
				this.leave();
				return;
			}

			console.log();
			const response2 = await fetch(
				`https://graph.facebook.com/v2.11/me?fields=likes&access_token=${token2}`
			);

			let data2 = JSON.parse(response2._bodyInit);
			let listData = data2.likes.data;

			let newListData = listData.map(({ name }) => name);
			this.props.setFacebookData(newListData);
			this.leave();
			//Send this token to the lgobal
			//Make a request to get the users likes
		}
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
					flex: 1
				}}
			>
				<View style={styles.mainFrame}>
					<StatusBar barStyle="light-content" />
					<LinearGradient colors={APP_GRADIENT} style={styles.container} />
					<Animatable.View
						delay={500}
						ref="container"
						animation="fadeIn"
						duration={1000}
						style={[
							{ flex: 1, justifyContent: 'center', alignItems: 'center' }
						]}
					>
						<View style={styles.top}>
							<Image source={FacebookIcon} />
						</View>

						<View style={[styles.bottom, styles.transparent]}>
							<Text style={styles.bottomText}>Connect with Facebook!</Text>
							<TouchableOpacity style={styles.button} onPress={this.logIn}>
								<Text style={styles.bottomText2}>Log In</Text>
							</TouchableOpacity>
						</View>
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
	top: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		height: 60,
		width: 250,
		borderRadius: 30,
		backgroundColor: '#3B5998',
		justifyContent: 'center',
		alignItems: 'center'
	},
	bottom: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	bottomText: {
		color: '#FFF',
		fontSize: 20,
		marginBottom: 20
	},
	bottomText2: {
		color: '#FFF',
		fontSize: 20,
		fontWeight: '900'
	}
});

const mapDispatchToProps = dispatch => {
	return {
		setFacebookName: name => {
			dispatch(setFacebookName(name));
		},
		setFacebookData: data => {
			dispatch(setFacebookData(data));
		}
	};
};

export default connect(null, mapDispatchToProps)(FacebookScreen);

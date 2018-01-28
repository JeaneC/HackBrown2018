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

import { Cubes, refresh } from '../assets';
import { Constants, Location, Permissions } from 'expo';
import { database, firebase } from '../firebase/firebase';
import HateButton from '../components/HateButton';
import GestureRecognizer, {
	swipeDirections
} from 'react-native-swipe-gestures';

import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';

import { setSessionId, setMainUser } from '../actions';
import { APP_GRADIENT, WHITE, DARK_FONT, MAIN_BLUE } from '../common/constants';
import { LinearGradient } from 'expo';

const extraList = 'Clothes News Sports Music Movies Food Books Travel';

const sampleList = ['John C'];
class LobbyScreen extends Component {
	constructor(props) {
		super(props);

		this.spinValue = new Animated.Value(0);
		let megaList = this.props.likeList.concat(
			this.props.loveList.concat(this.props.hateList)
		);
		this.state = {
			location: null,
			errorMessage: null,
			latitude: 0,
			longitude: 0,
			altitude: 0,
			userList: [this.props.name],
			synced: false,
			megaList,
			key: null
		};

		setTimeout(() => {
			this.spin();
		}, 500);
	}
	buttonPress = () => {
		this._getLocationAsync();
		console.log('hi');
	};

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			console.log('not granted');
			this.setState({
				errorMessage: 'Permission to access location was denied'
			});
		}

		let location = await Location.getCurrentPositionAsync({
			enableHighAccuracy: true
		});
		let { altitude, latitude, longitude } = location.coords;
		// console.log(`Compared to Prev`);
		// console.log(`LatitudeDelta: ${this.state.latitude - latitude}`);
		// console.log(`LongitudeDelta: ${this.state.longitude - longitude}`);
		// console.log(`AltitudeDelta: ${this.state.altitude - altitude}`);

		this.setState({ location, altitude, latitude, longitude });
	};

	onSwipeUp(gestureState) {
		this.setState({ myText: 'You swiped up!' });
	}

	onSwipeDown(gestureState) {
		this.setState({ myText: 'You swiped down!' });
	}

	onSwipeLeft(gestureState) {
		this.setState({ myText: 'You swiped left!' });
	}

	onSwipeRight(gestureState) {
		this.setState({ myText: 'You swiped right!' });
		console.log('SWIPED RIGHT');
	}

	spin() {
		this.spinValue.setValue(0);
		Animated.timing(this.spinValue, {
			toValue: 1,
			duration: 4000,
			easing: Easing.linear
		}).start(() => this.spin());
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

	//This is where we do the IBM Watson stuff
	onPress = async () => {
		this.props.setMainUser();
		console.log('leaving key', this.state.key);
		let cardStack = [
			{
				feedback: [0, 1],
				name: 'Music',
				time: 20
			},
			{
				feedback: [0, 1],
				name: 'Travel',
				time: 20
			},
			{
				feedback: [0, 1],
				name: 'News',
				time: 20
			}
		];

		let megaList = [...this.state.megaList];
		let dataFeed = megaList.join(' ').concat(extraList);
		console.log(dataFeed);

		const response = await fetch(
			`https://watson-api-explorer.mybluemix.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text="${dataFeed}"&features=categories`
		);
		// let result = JSON.parse(response);
		console.log(response._bodyInit);
		let result = JSON.parse(response._bodyInit);
		let { categories } = result;

		let lilyList = [];

		categories.map(({ label }) => {
			lilyList.push(label);
		});

		let final = this.returnCategories(lilyList);

		if (final) {
			cardStack = [
				{
					feedback: [0, 1],
					name: final[0],
					time: 20
				},
				{
					feedback: [0, 1],
					name: final[1],
					time: 20
				},
				{
					feedback: [0, 1],
					name: final[2],
					time: 20
				}
			];
		}

		await database.ref(`Session/${this.state.key}/cardStack`).set(cardStack);
		await database.ref(`Session/${this.state.key}/started`).set(true);

		this.leave();
	};

	afar = (lat1, lon1, lat2, lon2) => {
		var p = 0.017453292519943295; // Math.PI / 180
		var c = Math.cos;
		var a =
			0.5 -
			c((lat2 - lat1) * p) / 2 +
			c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;

		return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
	};

	onRotate = async () => {
		this.setState({ synced: true });
		await this._getLocationAsync();
		let { latitude, longitude, altitude } = this.state;

		let index1 = -2;

		await database
			.ref('Session')
			.once('value')
			.then(snapshot => {
				sessionObjects = snapshot.val();
				let sessionKeys = Object.keys(sessionObjects);
				if (sessionKeys) {
					sessionKeys.map((key, i) => {
						let session = sessionObjects[key];
						const { lat, lon, alt } = session.location;
						let distance = this.afar(lat, lon, latitude, longitude);
						if (distance < 1 && index1 == -2) {
							index1 = key;
							return;
						} else {
						}
					});
				}
			});

		//We need to create our own session
		if (index1 == -2) {
			var newPostRef = database.ref(`Session`).push();
			newPostRef.set({
				location: {
					lat: latitude,
					lon: longitude,
					alt: altitude
				},
				users: [this.props.name],
				data: [this.state.megaList],
				counter: 0,
				started: false,
				ended: false
			});
			index1 = newPostRef.key;
			this.props.setSessionId(index1);
			this.setState({ key: index1 });

			console.log('proper key?', index1);
		} else {
			let { users, data } = await database
				.ref(`Session/${index1}`)
				.once('value')
				.then(snapshot => {
					let { users, data } = snapshot.val();
					return { users, data };
				});

			users.map(user => {
				if (user != '') {
					let userList = [...this.state.userList];
					userList.push(user);
					this.setState({ userList });
				}
			});

			console.log('got data', data);

			let { userList } = this.state;

			let megaList = [...this.state.megaList];
			let dataList = [...data];
			dataList.push(megaList);

			data.map(listItem => {
				megaList = megaList.concat(listItem);
			});

			this.setState({ megaList });

			this.props.setSessionId(index1);
			this.setState({ key: index1 });

			console.log('SUM LIST IS ', megaList);

			await database.ref(`Session/${index1}/users`).set(userList);
			await database.ref(`Session/${index1}/data`).set(dataList);
		}
		database.ref(`Session/${index1}/started`).on('value', snapshot => {
			let val = snapshot.val();
			if (val) {
				this.leave();
			}

			// let settings = snapshot.val();
			// this.updateSettings(settings);
		});
	};

	leave = () => {
		this.refs.container.zoomOut(300).then(() => {
			this.props.navigation.navigate('card');
		});
	};

	returnCategories = inputArray => {
		const topics = [
			'Clothes',
			'News',
			'Sports',
			'Music',
			'Movies',
			'Food',
			'Books',
			'Travel'
		];

		var categoryArray = [];

		for (i = 0; i < inputArray.length; i++) {
			var tmp = inputArray[i].split('/');
			for (j = 0; j < tmp.length; j++) {
				var categoryName = tmp[j];
				if (categoryName.length !== 0 && categoryName.length <= 10) {
					categoryArray.push(
						categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
					);
				}
			}
		}

		var threeCategories = new Set();
		var categoryCount = categoryArray.length;
		var c = 0;

		while (threeCategories.size < 3 && categoryCount > 0) {
			if (!threeCategories.has(categoryArray[c])) {
				threeCategories.add(categoryArray[c]);
			}
			c++;
			categoryCount--;
		}

		if (threeCategories.size < 3) {
			var toAdd = 3 - threeCategories.size;

			for (l = 0; l < toAdd; l++) {
				var n = this.randomGenerate(topics);
				if (threeCategories.has(topics[n])) threeCategories.add('Art');
				else threeCategories.add(topics[n]);
			}
		}

		return Array.from(threeCategories);
	};

	randomGenerate = topicsArray => {
		var ranNum = Math.floor(Math.random() * topicsArray.length);
		return ranNum;
	};

	render() {
		const config = {
			velocityThreshold: 0.3,
			directionalOffsetThreshold: 80
		};

		const spin = this.spinValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		});

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
						<Animatable.View style={[styles.transparent, styles.header]}>
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
							delay={500}
							duration={500}
						>
							{this.state.userList.map((user, index) => {
								return (
									<Animatable.Text
										key={index}
										style={styles.userStyle}
										animation="fadeInUp"
										duration={500}
									>
										{user}
									</Animatable.Text>
								);
							})}
						</Animatable.View>

						<Animatable.View
							style={[styles.transparent, styles.footer]}
							delay={1000}
							animation="fadeInUp"
							duration={500}
						>
							{!this.state.synced && (
								<TouchableOpacity onPress={this.onRotate}>
									<Animated.Image
										source={refresh}
										animation=""
										delay={500}
										style={{ transform: [{ rotate: spin }] }}
									/>
								</TouchableOpacity>
							)}
							{this.state.synced && (
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
											Start
										</Text>
									</TouchableOpacity>
								</Animatable.View>
							)}
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
		flex: 4,
		paddingTop: 30,
		paddingBottom: 30,
		justifyContent: 'space-around',
		alignItems: 'center',
		width: 300
	},
	headerText: {
		fontSize: 48,
		fontWeight: '900',
		color: WHITE
	},
	userStyle: {
		fontSize: 28,
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
		loveList: session.loveList,
		hateList: session.hateList,
		likeList: session.likeList
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setSessionId: data => dispatch(setSessionId(data)),
		setMainUser: () => dispatch(setMainUser())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyScreen);

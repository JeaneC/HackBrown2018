import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image,
	StatusBar,
	Animated,
	Easing
} from 'react-native';

import { APP_GRADIENT } from '../common/constants';
import { Cubes } from '../assets';
import { LinearGradient } from 'expo';
import GestureRecognizer, {
	swipeDirections
} from 'react-native-swipe-gestures';

import * as Animatable from 'react-native-animatable';

class LoadingScreen extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
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
		this.refs.container.zoomOut(300).then(() => {
			this.props.navigation.navigate('facebook');
		});

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
						duration={500}
						style={[
							{ flex: 1, justifyContent: 'center', alignItems: 'center' }
						]}
					>
						<Animatable.Image
							source={Cubes}
							delay={500}
							ref="image"
							animation="pulse"
							easing="ease-out"
							iterationCount="infinite"
						/>
					</Animatable.View>
				</View>
			</GestureRecognizer>
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
	}
});

export default LoadingScreen;

import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	Keyboard,
	ScrollView,
	Platform,
	Image,
	Easing,
	Animated,
	Dimensions
} from 'react-native';
import { LinearGradient } from 'expo';
import { connect } from 'react-redux';
import { signIn, chooseTheme } from '../actions';
import LoginLogo from '../components/LoginLogo';
import { firebase, database } from '../firebase/firebase';
import { StackNavigator } from 'react-navigation';

import { Screen } from '../assets';
import {
	BLUEPURPLE,
	PINKORANGE,
	GREENBLUE,
	WHITE,
	FADE,
	LARGE,
	MEDIUM,
	SMALL,
	BLACK,
	BUTTON_BORDER_RADIUS
} from '../common/constants';

const OS = Platform.OS;
const GRADIENT_COLOR = BLUEPURPLE;
const BORDER_WIDTH = 1.5;

const dimensions = Dimensions.get('window');
const SCREEN_WIDTH = dimensions.width;
const SCREEN_HEIGHT = dimensions.height;

class ThemeScreen extends Component {
	constructor(props) {
		super(props);
		this.spinValue = new Animated.Value(0);
		this.state = {
			yOffset: 0
		};
	}

	componentDidMount() {
		this.spin();
	}

	measure = () => {
		this.myComponent.measure((fx, fy, width, height, px, py) => {
			console.log('Component width is: ' + width);
			console.log('Component height is: ' + height);
			console.log('X offset to frame: ' + fx);
			console.log('Y offset to frame: ' + fy);
			console.log('X offset to page: ' + px);
			console.log('Y offset to page: ' + py);
		});
	};

	spin() {
		this.spinValue.setValue(0);
		Animated.timing(this.spinValue, {
			toValue: 1,
			duration: 4000,
			easing: Easing.linear
		}).start(() => this.spin());
	}

	render() {
		const { transparent, container, header, body, footer, Wrapper } = styles;
		const { subtitle, title, row, bar, filling } = styles;
		const { footerBody, footerTitle, actionButton, actionButtonText } = styles;

		const spin = this.spinValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		});
		return (
			<ScrollView
				style={styles.Wrapper2}
				scrollEventThrottle={16}
				onScroll={event => {
					yOffset = event.nativeEvent.contentOffset.y;
					this.setState({ yOffset });
				}}
			>
				<StatusBar barStyle="light-content" />

				<View
					style={{ height: 400, backgroundColor: 'blue' }}
					ref={view => {
						this.myComponent = view;
					}}
					onLayout={this.measure}
				>
					<Text
						style={{
							position: 'absolute',
							top: 30,
							color: 'red',
							fontSize: 24
						}}
					>
						0 - {this.state.yOffset} - 0
					</Text>
					<View style={styles.trapezoid} />
				</View>
				<View style={{ height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
					<View style={{ height: 20, width: 40, backgroundColor: 'purple' }} />
					<Animated.View
						style={[transparent, header, { transform: [{ rotate: spin }] }]}
					>
						<LoginLogo image={Screen} />
					</Animated.View>
				</View>
				<View style={{ height: 500, backgroundColor: 'yellow' }} />
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	Wrapper: {
		flex: 1,
		paddingTop: OS == 'android' ? 15 : 0,
		backgroundColor: BLACK,
		justifyContent: 'center',
		alignItems: 'center'
	},
	Wrapper2: {
		flex: 1,
		paddingTop: OS == 'android' ? 15 : 0,
		backgroundColor: BLACK
	},
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		borderRadius: 10
	},

	header: {
		flex: 0.7,
		justifyContent: 'center',
		alignItems: 'center'
	},
	trapezoid: {
		width: SCREEN_WIDTH,
		height: 100,
		backgroundColor: 'purple',
		borderBottomWidth: 30,
		borderBottomColor: 'red',
		borderTopWidth: 100,
		borderTopColor: 'red',
		borderLeftWidth: 50,
		borderLeftColor: 'transparent',
		borderRightWidth: 50,
		borderRightColor: 'transparent',
		borderStyle: 'solid'
	},
	body: {
		flex: 1
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	}
});

const mapDispatchToProps = dispatch => ({
	signIn: (token, code, name) => {
		dispatch(signIn(token, code, name));
	},
	chooseTheme: val => {
		dispatch(chooseTheme(val));
	}
});

export default connect(null, mapDispatchToProps)(ThemeScreen);

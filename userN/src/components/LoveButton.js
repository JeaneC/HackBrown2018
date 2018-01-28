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

import * as Animatable from 'react-native-animatable';

import { APP_GRADIENT, WHITE, DARK_FONT } from '../common/constants';
import { Cubes } from '../assets';
import { LinearGradient } from 'expo';

class LoveButton extends Component {
	state = {
		text: ''
	};

	changeText = {};
	render() {
		return (
			<Animatable.View
				style={[styles.container]}
				animation="zoomIn"
				duration={500}
				ref="button"
			>
				<TextInput
					style={styles.buttonFont}
					value={this.props.text}
					onChangeText={text => {
						this.props.changeText(this.props.num, text);
					}}
					placeholder="What do you like?"
					placeholderTextColor={DARK_FONT}
				/>
			</Animatable.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 60,
		width: 275,
		backgroundColor: WHITE,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		marginBottom: 20
	},
	transparent: {
		backgroundColor: 'transparent'
	},
	buttonFont: {
		fontSize: 16,
		paddingLeft: 5,
		height: 50,
		width: 250,
		color: DARK_FONT
	}
});

export default LoveButton;

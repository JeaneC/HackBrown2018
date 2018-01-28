import React from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoadingScreen from './src/screens/LoadingScreen';
import CardScreen from './src/screens/CardScreen';
import FacebookScreen from './src/screens/FacebookScreen';
import LoveScreen from './src/screens/LoveScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import HateScreen from './src/screens/HateScreen';
import EndScreen from './src/screens/EndScreen';

import { Provider } from 'react-redux';
import store from './src/store/configureStore';

const MainNavigator = StackNavigator(
	{
		loading: {
			screen: LoadingScreen,
			navigationOptions: { header: null }
		},
		card: {
			screen: CardScreen,
			navigationOptions: { header: null }
		},

		end: {
			screen: EndScreen,
			navigationOptions: { header: null }
		},

		lobby: {
			screen: LobbyScreen,
			navigationOptions: { header: null }
		},

		facebook: {
			screen: FacebookScreen,
			navigationOptions: { header: null }
		},
		love: {
			screen: LoveScreen,
			navigationOptions: { header: null }
		},
		hate: {
			screen: HateScreen,
			navigationOptions: { header: null }
		}
	},
	{
		transitionConfig: () => ({
			transitionSpec: {
				duration: 0,
				timing: Animated.timing,
				easing: Easing.step0
			}
		}),
		lazy: true
	}
);

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<MainNavigator />
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});

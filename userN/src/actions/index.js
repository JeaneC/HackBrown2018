import {
	LOGIN_APP,
	SET_LOVE_LIST,
	SET_HATE_LIST,
	SET_FACEBOOK_NAME,
	SET_FACEBOOK_DATA,
	SET_SESSION_ID,
	SET_MAIN_USER
} from './types';

export const signIn = (token, code, name, room) => {
	return {
		type: LOGIN_APP,
		payload: { token, code, name, room }
	};
};

export const setLoveList = list => {
	return {
		type: SET_LOVE_LIST,
		payload: list
	};
};

export const setHateList = list => {
	return {
		type: SET_HATE_LIST,
		payload: list
	};
};

export const setFacebookName = name => {
	return {
		type: SET_FACEBOOK_NAME,
		payload: name
	};
};

export const setFacebookData = data => {
	return {
		type: SET_FACEBOOK_DATA,
		payload: data
	};
};

export const setSessionId = data => {
	return {
		type: SET_SESSION_ID,
		payload: data
	};
};

export const setMainUser = () => {
	return {
		type: SET_MAIN_USER
	};
};

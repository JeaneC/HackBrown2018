const apiKey = 'ytEtvRpH9_92it2PoN35';
import {
	SET_LOVE_LIST,
	SET_HATE_LIST,
	SET_FACEBOOK_NAME,
	SET_FACEBOOK_DATA,
	SET_SESSION_ID,
	SET_MAIN_USER
} from '../actions/types';

const SessionDefaultState = {
	token: null,
	code: null,
	name: 'The Meaning Of Life',
	loveList: ['Disney', 'Fantasy', 'Romance'],
	hateList: [],
	likeList: [],
	sessionId: '',
	mainUser: false
};

export default (state = SessionDefaultState, action) => {
	switch (action.type) {
		case SET_LOVE_LIST:
			return {
				...state,
				loveList: action.payload
			};

		case SET_MAIN_USER:
			return {
				...state,
				mainUser: true
			};
		case SET_SESSION_ID:
			return {
				...state,
				sessionId: action.payload
			};
		case SET_HATE_LIST:
			return {
				...state,
				hateList: action.payload
			};
		case SET_FACEBOOK_NAME:
			return {
				...state,
				name: action.payload
			};
		case SET_FACEBOOK_DATA:
			return {
				...state,
				likeList: action.payload
			};
		default:
			return state;
	}
};

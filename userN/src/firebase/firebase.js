import * as firebase from 'firebase';
import moment from 'moment';

const startMoment = moment();

var config = {
	apiKey: 'AIzaSyBO2v87Q2YFdoNNNIThniThoHZQhM0Cq50',
	authDomain: 'icebreaker-1988c.firebaseapp.com',
	databaseURL: 'https://icebreaker-1988c.firebaseio.com',
	projectId: 'icebreaker-1988c',
	storageBucket: 'icebreaker-1988c.appspot.com',
	messagingSenderId: '559628320356'
};
firebase.initializeApp(config);
const database = firebase.database();
// const mainRef = database.ref('Lines');
// const userRef = database.ref('Users');

// export const getClassData = async classCode => {
// 	return await database
// 		.ref(`Classes/${classCode}`)
// 		.once('value')
// 		.then(snapshot => {
// 			return snapshot.val();
// 		});
// };

export { firebase, database };

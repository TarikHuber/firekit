import firebase from 'firebase';
import config from '../config';
// eslint-disable-next-line
import firestore from 'firebase/firestore'

export const firebaseApp = firebase.initializeApp(config.firebase_config);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

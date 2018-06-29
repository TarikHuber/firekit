import firebase from 'firebase/app';
import config from '../config';
// eslint-disable-next-line
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/messaging'

export const firebaseApp = firebase.initializeApp(config.firebase_config);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

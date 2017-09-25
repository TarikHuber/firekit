import firebase from 'firebase';

const config= {
  firebase_config: {
    apiKey: "AIzaSyDRLP6_tADLbshJ7HVmdWXgJDobhBtknfg",
    authDomain: "firekit-ad5a4.firebaseapp.com",
    databaseURL: "https://firekit-ad5a4.firebaseio.com",
    projectId: "firekit-ad5a4",
    storageBucket: "",
    messagingSenderId: "90352019016"
  },
  firebase_providers: [
    firebase.auth.GoogleAuthProvider,
    firebase.auth.EmailAuthProvider,
  ],
  initial_state: {
    theme: 'dark',
    locale: 'en'
  },
  drawer_width: 256
}

export default config;

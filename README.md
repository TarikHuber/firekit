# Firekit

This project was bootstrapped with [nwb](https://github.com/insin/nwb)

Firekit was created to help working with Firebase in React Projects that use Redux as state storage. 

You can find a full functional **DEMO** project (React Most Wanted) with source code [here](https://www.react-most-wanted.com/).

**WARNING:** This project is still in early development so API changes will very likely happen.

## Table of Contents

- [Features](#features)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Connection](#connection)
  - [List](#list)
  - [Path](#path)
- [TO DO](#to-do)
- [License](#license)

## Features

Firekit allows you to watch firebase data and sync it to your redux store with a minimum of code to write. It uses a `Provider` to server the `firebaseApp` to all Components that need it.

Some features that are unque to this firebase toolkit are:
* **persistant watchers** - the watchers are persistant and are not linked to components. You deside when to watch a value in your firebase database and when to unwatch (turn off listeners) it. 

* **your create firebaseApp** - you initialise the firebaseApp how you want and add it as prop to the firekit `FirebaseProvider` and all your components have access to the firebaseApp

* **easy persistance** - firekit saves in your store only simple json data so that persistance is no nightmare any more!

* **normalised redux store** - the firekit reducers are structured with normalisation in mind

* **native firebase** - you can use firebases native sdk for the web. Firekit is just listening on changes. Every change on the data you can make as it is described in the official firebase documentation

Features like populating values in the database are omited with purpose. The firebase `cloud functions` are the place where you should populate data that must be saved in multiple places.

There are more features coming soon :smile:

## Configuration

We will use code snipets from the demo project to explan how to configure firekit. There are two main steps for the configuration:
* prepare the `FirebaseProvider`
* add the firekit reducers to your redux reducer

To initialize the `FirebaseReducer` we need to initialize our firebase app as it is described in the official firebase documentation.
When we have the `firebaseApp` we just add it as paramater to our Provider.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { FirebaseProvider } from 'firekit'; // Import the FirebaseProvider from firekit
import configureStore from './store';
import { Root } from './containers/Root';
import { addLocalizationData } from './locales';
import injectTapEventPlugin from 'react-tap-event-plugin';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase';

const store = configureStore();
addLocalizationData();

//Get the configs of your firerbase project
const firebaseConf={
    apiKey: "AIzaSyBQAmNJ2DbRyw8PqdmNWlePYtMP0hUcjpY",
    authDomain: "react-most-wanted-3b1b2.firebaseapp.com",
    databaseURL: "https://react-most-wanted-3b1b2.firebaseio.com",
    projectId: "react-most-wanted-3b1b2",
    storageBucket: "react-most-wanted-3b1b2.appspot.com",
    messagingSenderId: "258373383650"
}

//Initialise your firebase app
const firebaseApp = firebase.initializeApp(firebaseConf);

//The part above can be done in a seperate file so it can be acessed from everiwhere in your application
//It is moved here in this snipped for simplicity purpose

//Now in your root part of your application add the FirebaseProvider as you have done with the redux Provoder
//Take care that the FirebaseProvider comes after the redux Provider to have access to the redux store
ReactDOM.render(
  <Provider store={store}>
    <FirebaseProvider firebaseApp={firebaseApp}>
      <Root />
    </FirebaseProvider>
  </Provider>
  , document.getElementById('root')
);

registerServiceWorker();

```

Take care that adding the `FirebaseProvider` happens in a root part of your application and after the redux Provider.
Taht would be the first part. In the second one we just add the firekit reducers to our redux reduxer.

```js
import { responsiveStateReducer } from 'redux-responsive';
import { combineReducers } from 'redux';
import { responsiveDrawer } from 'material-ui-responsive-drawer';
import { reducer as formReducer } from 'redux-form'
import auth from './auth/reducer';
import dialogs from './dialogs/reducer';
import messaging from './messaging/reducer';
import locale from './locale/reducer';
import theme from './theme/reducer';
import {
  connectionReducer,
  listsReducer,
  pathsReducer,
  initializationReducer
} from 'firekit'; //Import the reducers

const reducers = combineReducers({
  browser: responsiveStateReducer,
  responsiveDrawer,
  form: formReducer,
  auth,
  initialization: initializationReducer,  //Add the initialisation reducer
  connection: connectionReducer, //Add the connection reducer
  lists: listsReducer, //Add the lists reducer
  paths: pathsReducer, //Add the paths reducer
  dialogs,
  messaging,
  locale,
  theme,
})

export default reducers;

```
In future versions the reducers will be combined in a single object that will be reducable. 

**WARNING:** if you are using persistance take care that the reducer `initialization` is not persisted! He saves the watchers. If he would be persisted the watcher would not initialize again after a page reload. If you are using `redux-persist` just add him to the black list.

```js
  persistStore(store, {blacklist:['auth', 'form', 'connection', 'initialization'] }, ()=>{}); //Add initialization to persistance blacklist if you use persistance
```

**INFO:** the reducers are not customasable so they have to use the names as they are here in the snipped. In future we could add customatisation for this so they could have any name you want. 

## Usage




## TO DO

- [ ] compine all reducer to one import
- [ ] integrate selectors
- [ ] integrate firebase messaging
- [ ] integrate firebase auth watcher
- [ ] integrate firebase queries watcher

## License

MIT

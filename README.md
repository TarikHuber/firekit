# Firekit

This project was bootstrapped with [nwb](https://github.com/insin/nwb)

Firekit was created to help working with Firebase in React Projects that use Redux as state storage.

You can find a full functional **DEMO** project (React Most Wanted) with source code [here](https://www.react-most-wanted.com/).
You can also find more about the concepts used in this library [here](https://codeburst.io/firekit-concepts-to-sync-firebase-and-redux-606a1e3e50d6)

**WARNING:** This project is still in early development so API changes will very likely happen.

## Table of Contents

- [Features](#features)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Accessing firebaseApp](#accessing-firebaseapp)
  - [Connection](#connection)
  - [Lists and Queries](#lists-and-queires)
  - [Paths](#paths)
  - [FireForm](#fireform)
  - [Messaging](#messaging)
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

* **realtime forms** - firekit has a special Warapper for `redux-forms` witch allows to sync them with the realtime database very simple and plus it is automaticaly synced on field changes in real time if they ocure while your are in the Form

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
import firekitReducers from 'firekit'; //Import the firekitReducers


console.log(firekitReducers);

const reducers = combineReducers({
  browser: responsiveStateReducer,
  responsiveDrawer,
  form: formReducer,
  auth,
  dialogs,
  messaging,
  locale,
  theme,
  ...firekitReducers //Spread the firekit reducers
})

export default reducers;

```
To add all firekti reducers to your redux store just spread the firekitReducers object into your `comineReducers` object.

**WARNING:** if you are using persistance take care that the reducer `initialization` is not persisted! He saves the watchers. If he would be persisted the watcher would not initialize again after a page reload. If you are using `redux-persist` just add him to the black list.

```js
  persistStore(store, {blacklist:['auth', 'form', 'connection', 'initialization'] }, ()=>{}); //Add initialization to persistance blacklist if you use persistance
```

**INFO:** the reducers are not customasable. In future we could add customatisation for this so they could have any name you want.

## Usage

Let us now do something with our firekit :smile:
To use `firekit` in a component we need to tell the component to get all `firekit` props from the context.
We use for that a simple call `withFirebase`. It is very similar to the `react-router` call `withRouter`. The usage is exactly the same.

Let us take a look on a simple component.

```js

import React, { Component }  from 'react';
import {injectIntl, intlShape} from 'react-intl';
import { Activity } from '../../containers/Activity';
import { withFirebase } from 'firekit';

class MyComponent extends Component {

  componentDidMount(){
    const { watchList }= this.props;
    watchList('companies'); //Here we started watching a list
  }

  render() {
    const { intl }= this.props;

    return (
      <Activity
        title={intl.formatMessage({id: 'my_component'})}>
      </Activity>
    );
  }

}

MyComponent.propTypes = {
  intl: intlShape.isRequired,
};


export default injectIntl(withFirebase(MyComponent)); //Here using 'withFirebase()' we added all we need to our component

```
As you can see calling `withFirebase(Component)` adds to our Component all props we need to work with firekit. `watchList` is one of more API calls we can make. More about every one is writen below in the [API](#api) section.

Now that we know how to add the `firekit` props to our Compont lets take a look what we can do with it.

### Accessing firebaseApp

The `FirebaseProvider` provides the `firebaseApp` trought the rect context and `withFirebase` allows us to get it easely as Component property. We can then do with the `firebaseApp` whatever we want: create, update, delete data in the realtime databae, work with the auth or with the storage. You have all your freedom with firebase cause `firebaseApp` is the same one you initialised and put into the `FirebaseProvider`.


```js

import React, { Component }  from 'react';
import {injectIntl, intlShape} from 'react-intl';
import { Activity } from '../../containers/Activity';
import { withFirebase } from 'firekit';

class MyComponent extends Component {

  componentDidMount(){
    const { firebaseApp }= this.props;
    firebaseApp.database().ref('some_value').update(55); //Here we just changed a value in our database
  }

  render() {
    const { intl }= this.props;

    return (
      <Activity
        title={intl.formatMessage({id: 'my_component'})}>
      </Activity>
    );
  }

}

MyComponent.propTypes = {
  intl: intlShape.isRequired,
};


export default injectIntl(withFirebase(MyComponent)); //Here using 'withFirebase()' we added all we need to our component

```

### Connection

Firebase has integrated a listener to observe the connection state to your firebase app.


```js
import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'firekit';

class MyComponent extends Component {

  componentDidMount(){
    const { initConnection }= this.props;
    initConnection(); //Here we started watching the connection state
  }

  componentWillUnmount() {
    const { unsubscribeConnection, }= this.props;
    unsubscribeConnection(); // Here we unsunscribe the listening to the connection state
  }

  render() {
    const { isConnected }= this.props;

    return (
      <div>Connection state:{isConnected}</div>
    );
  }

}

const mapStateToProps = (state) => {
  const { connection} = state;

  return {
    isConnected: connection?connection.isConnected:false, // Here we get the connection state from the redux store
  };
};

export default connect(
  mapStateToProps
)(withFirebase(MyComponent));
```

### Lists and Queries

We can easely observe lists in the realtime database using the `watchList` and `unwatchList` API calls. The same calls are used to observe Firebase queries. `watchList` and `unwatchList` can recieve as parameter a string to a database path or a Firebase reference to that path. If you have a simple reference to a path using just the string of the path is the right choice. But if you have a Firebase query reference you can send that reference with all its query calls as parameter.

**IMPORTAND:**: the list will be a Array contained of objects witch have the props `key` and `val` where the `key` is the child key in the list and `val` the value of the child. This is similar to the snapshot you get from a Firebase list `on` event.

```js
import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'firekit';
import _ from 'lodash';

class MyComponent extends Component {

  componentDidMount(){
    const { watchList, firebaseApp }= this.props;

    watchList('users'); //Here we started watching the users list

    //Her we watch a simple firebase query
    let tasksRef= firebaseApp.database().ref('tasks').limitToFirst(10);
    watchList(tasksRef);

  }

  componentWillUnmount() {
    const { unwatchList, }= this.props;
    unwatchList('users'); // We can unwatch the list on unmounting the Component
    unwatchList('tasks'); // To unwatch a query qe can use just the ref path string
  }

  rednerList = () => {
    const {users} =this.props;

    if(users===undefined){
      return <div></div>
    }

    return _.map(users, (user, i) => {
      return <div key={i}>
        {user.val.displayName}
      </div>
    });
  }  

  render() {
    const { isConnected }= this.props;

    return (
      <div>
      {this.rednerList()}
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  const { lists } = state;
  return {
    users: lists.users,
  };
};

export default connect(
  mapStateToProps
)(withFirebase(MyComponent));
```

Here we unwatched the list on `componentWillUnmount`. We could also leave this away and the list will change in realtime in the background and it will not load all data on revisiting the Component again.

If you are using persistand watcher you would have to unwatch them in some point of your application or on application exit.
Because of that there are special calls that allow us to unwatch all persistand watcher in a single call. That could be calles in the root component of your application like this:

```js

//... other code of your root Component

  componentWillUnmount() {
    const { unsubscribeConnection, unwatchAllLists, unwatchAllPaths }= this.props;
    unsubscribeConnection();
    unwatchAllLists();
    unwatchAllPaths();
  }

//... other code of your root Component

```

**INFO:** You can call the `watchList` and `watchPath` as often you want. The library caches initialized lists and paths to the `initialization` state so it knows if you are trying to initialize a list or path that is already initialized and is already observed and in that case the library just doesn't do anything. So if you call `watchList('users')` in multiple places in your application you don't have to care about if it is already initialized or not and can be shure that if it is you just have your data in the redux store ready to use.

As you noticed we here unwatch not only the lists but also the connection and the paths watcher.

### Paths

The paths watcher exactly like the lists watcher with `watchPath` and `unwatchPath`.

```js
//...
  componentDidMount(){
    const { watchPath }= this.props;
    watchPath('users_count'); //Here we started watching the path
  }

  componentWillUnmount() {
    const { unwatchPath, }= this.props;
    unwatchPath('users'); // We can unwatch the path on unmounting the Component
  }

//...
```

Here we also unwatch the path on `componentWillUnmount` but we could also leave the watcher persistand and unwatch it on application closing. This is useful if you need to load user data or user permissions from the database and you want that the permission changes take effect in realtime to the user.

### FireForm

`FirForm` is a special component created for usage with `redux-form`. It takes a `path` and an `uid` paramater to know where to get its data. The `name` propertie is the name of the `redux-form` Form name. All other properties are optional and wil be described in further documentation. It is importand to know that `FireForm` can only be used in Components that have the `withFirebase` called to access the `firebaseApp`.

Inside the `FireForm` we put as child our Form with the fields we want and the macig hapens :smile:

All fields will be filled with the data from the `path` and `uid` and if no `uid` is provided the form will be a Form that creates a new entry in your `path`.

And comes the cool thing. If you are in the Form working on fields and someone else changes some data. Every field that you haven't changed will be in realtime updated! Isn't that cool :smile:

```js

//...

    <FireForm
      name={'companie'}
      path={`${path}`}
      onSubmitSuccess={(values)=>{history.push('/companies');}}
      onDelete={(values)=>{history.push('/companies');}}
      handleCreateValues={this.handleCreateValues}
      uid={match.params.uid}>
      <Form /> // Here is your simple form
    </FireForm>

//...

```

### Messaging

Firebase offers a simple API for managing push notification messages. Firekit provides a simple API call `initMessaging` that manages all messaging events for you and syncs them to your redux store. The API call can recieve a function paramater you can use to hanlde new messages. That parameter is optional. Firekit stores the messaging token, permission and new messages to your store automaticaly. In future there will be added APIs to clear single and all messages.

```js
//...
  componentDidMount(){
    const { initMessaging }= this.props;
    initMessaging((payload)=>{console.log(payload)}); //Here we initialise the Firbease messaging and log new messages to the console
  }

//...
```


## TO DO

- [X] compine all reducer to one import
- [ ] integrate selectors
- [ ] integrate firebase messaging
- [ ] integrate firebase auth watcher
- [X] integrate firebase queries watcher

## License

MIT

# Firekit

[![Build Status][travis-image]][travis-url]

[![Dependency Status][daviddm-image]][daviddm-url]

[![License][license-image]][license-url]

[![Code Coverage][coverage-image]][coverage-url]

[![Code Style][code-style-image]][code-style-url]

This project was bootstrapped with [nwb](https://github.com/insin/nwb)

`Firekit` helps syncing the Firebase `RealtimeDatabase` or `Firestore` database with the `redux` state.

You can find a full functional **DEMO** project (React Most Wanted) with source code [here](https://www.react-most-wanted.com/).

You can also find more about the concepts used in this library [here](https://codeburst.io/firekit-concepts-to-sync-firebase-and-redux-606a1e3e50d6)

## Table of Contents

- [Features](#features)
- [Configuration](#configuration)
- [Install](#install)
- [Usage](#usage)
  - [Accessing firebaseApp](#accessing-firebaseapp)
  - [Connection](#connection)
  - [Lists and Queries](#lists-and-queires)
  - [Paths](#paths)
  - [Docs](#docs)
  - [Collections](#collections)
  - [FireForm](#fireform)
  - [Messaging](#messaging)
- [TO DO](#to-do)
- [License](#license)

## Features

Firekit allows you to watch firebase data and sync it to your redux store with minimum of code to write. It uses a `Provider` to serve the `firebaseApp` to all Components that need it.

Some features that are unique to this Firebase toolkit are:

- **persistant watchers** - the watchers are persistant and are not linked to components. You decide when to watch a value in your Firebase database and when to unwatch it (i.e. turn off listeners).

- **create your firebaseApp** - you initialise the `firebaseApp` however you want, add it as prop to the firekit `FirebaseProvider`, and all of your components have access to the `firebaseApp`.

- **easy persistance** - firekit saves in your store in a simple json format so that persistance is no longer a nightmare!

- **normalized redux store** - the firekit reducers are structured with normalization in mind

- **native Firebase** - you can use Firebase's native sdk for the web. Firekit just listens for data changes. You can make any and every change to the data as described in the official Firebase documentation.

- **realtime forms** - firekit has a special wrapper for `redux-forms` that allows it to sync with Firebase's Realtime Database (RTDB) very easily and it is automatically synchronizes field changes in real-time if they occur while your are in the form

Features such as populating values in the database are omitted with good reason. [Firebase Cloud Functions](https://firebase.google.com/docs/functions/) are meant for tasks such as populating data in multiple places.

## Install

If only using the `redux` features

```
npm i -S firekit
```

In a `React` project where you want to have also the `Provider`

```
npm i -S firekit firekit-provider
```

## Configuration

We will use code snippets from the demo project to explan how to configure firekit. These are the main steps for the configuration:

1. prepare the `FirebaseProvider`
1. add the firekit reducers to your redux reducer

To initialize the `FirebaseReducer` we need to initialize our Firebase app as described in the official Firebase documentation.

When we have the `firebaseApp` we add it as paramater to our Provider.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import FirebaseProvider from 'firekit-provider' // Import the FirebaseProvider from firekit
import configureStore from './store'
import { Root } from './containers/Root'
import { addLocalizationData } from './locales'
import injectTapEventPlugin from 'react-tap-event-plugin'
import registerServiceWorker from './registerServiceWorker'
import firebase from 'firebase'

const store = configureStore()
addLocalizationData()

// Get the configs of your firerbase project
const firebaseConf = {
  apiKey: 'AIzaSyBQAmNJ2DbRyw8PqdmNWlePYtMP0hUcjpY',
  authDomain: 'react-most-wanted-3b1b2.firebaseapp.com',
  databaseURL: 'https://react-most-wanted-3b1b2.firebaseio.com',
  projectId: 'react-most-wanted-3b1b2',
  storageBucket: 'react-most-wanted-3b1b2.appspot.com',
  messagingSenderId: '258373383650'
}

// Initialise your firebase app
const firebaseApp = firebase.initializeApp(firebaseConf)

// The part above can be done in a seperate file so it can be accessed from anywhere in your application.
// It is moved here in this snippet for simplicity.

// In the root of your application, add the FirebaseProvider as you have done with the Redux Provider.
// Take care that the FirebaseProvider comes after the Redux Provider to have access to the Redux store.
ReactDOM.render(
  <Provider store={store}>
    <FirebaseProvider firebaseApp={firebaseApp}>
      <Root />
    </FirebaseProvider>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
```

Take care that adding the `FirebaseProvider` happens in the root of your application, and after the Redux Provider.
Secondly, we add the firekit reducers to our redux reduxer.

```js
import { responsiveStateReducer } from 'redux-responsive'
import { combineReducers } from 'redux'
import { responsiveDrawer } from 'material-ui-responsive-drawer'
import { reducer as formReducer } from 'redux-form'
import auth from './auth/reducer'
import dialogs from './dialogs/reducer'
import messaging from './messaging/reducer'
import locale from './locale/reducer'
import theme from './theme/reducer'
import firekitReducers from 'firekit' //Import the firekitReducers

console.log(firekitReducers)

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

export default reducers
```

To add all firekit reducers to your redux store, spread the firekitReducers object into your `combineReducers` object.

**WARNING:** if you are using persistance take care that the reducer `initialization` is not persisted! It saves the watchers. If persisted, the watcher would not initialize again after a page reload. If you are using `redux-persist` just add it to the black list.

```js
// Add initialization to persistance blacklist if you use persistance
persistStore(store, { blacklist: ['auth', 'form', 'connection', 'initialization'] }, () => {})
```

**INFO:** the reducers are not customizable. In the future, we could add customatization for this so they could have any name you want.

## Usage

Let us now do something with our firekit :smile:

To use `firekit` in a component we need to tell the component to get all `firekit` props from the context.
We use for that a simple call `withFirebase`. It is very similar to the `react-router` call `withRouter`. The usage is exactly the same.

Let us take a look on a simple component.

```js
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Activity } from '../../containers/Activity'
import { withFirebase } from 'firekit-provider'

class MyComponent extends Component {
  componentDidMount() {
    const { watchList } = this.props
    watchList('companies') //Here we started watching a list
  }

  render() {
    const { intl } = this.props

    return <Activity title={intl.formatMessage({ id: 'my_component' })} />
  }
}

MyComponent.propTypes = {
  intl: intlShape.isRequired
}

// Use 'withFirebase()' to add what we need for our component
export default injectIntl(withFirebase(MyComponent))
```

As you can see calling `withFirebase(Component)` adds to our Component the props we need to work with firekit. `watchList` is another API call we can make. More about each one is written below in the [API](#api) section.

Now that we know how to add the `firekit` props to our Component, let us take a look what we can do with it.

### Accessing firebaseApp

The `FirebaseProvider` provides the `firebaseApp` through the React context and `withFirebase` allows us to get it easily as a Component property. We can then do with `firebaseApp` whatever we want: create, get, update, or delete data in the realtime database, work with the auth or with the storage. You have all your freedom with Firebase because `firebaseApp` is the same one you initialized and put into the `FirebaseProvider`.

```js
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Activity } from '../../containers/Activity'
import { withFirebase } from 'firekit-provider'

class MyComponent extends Component {
  componentDidMount() {
    const { firebaseApp } = this.props
    firebaseApp
      .database()
      .ref('some_value')
      .update(55) // change a value in our database
  }

  render() {
    const { intl } = this.props

    return <Activity title={intl.formatMessage({ id: 'my_component' })} />
  }
}

MyComponent.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(withFirebase(MyComponent)) // add what we need to our component
```

### Connection

Firebase has integrated a listener to observe the connection state to your firebase app.

```js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from 'firekit-provider'

class MyComponent extends Component {
  componentDidMount() {
    const { initConnection } = this.props
    initConnection() //Here we started watching the connection state
  }

  componentWillUnmount() {
    const { unsubscribeConnection } = this.props
    unsubscribeConnection() // Unsunscribe the listener of the connection state
  }

  render() {
    const { isConnected } = this.props

    return <div>Connection state:{isConnected}</div>
  }
}

const mapStateToProps = state => {
  const { connection } = state

  return {
    isConnected: connection ? connection.isConnected : false // Get the connection state from the redux store
  }
}

export default connect(mapStateToProps)(withFirebase(MyComponent))
```

### Lists and Queries

We can easily observe lists in the realtime database using the `watchList` and `unwatchList` API calls. The same calls are used to observe Firebase queries. `watchList` and `unwatchList` can receive, as parameters, a string to a database path or a Firebase reference to that path. If you have a simple string reference to a path, that is an optimal choice. But if you have a Firebase query reference you can send that reference with all its query calls as parameter.

**IMPORTANT:**: the list will be an Array containing objects that have props {`key` and `val`} where the `key` is the child key in the list and `val` the value of that child. This is similar to the snapshot you get from a Firebase list `on` event.

```js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from 'firekit-provider'
import _ from 'lodash'

class MyComponent extends Component {
  componentDidMount() {
    const { watchList, firebaseApp } = this.props

    watchList('users') // start watching the 'users' list

    // Watch a simple firebase query for 'tasks'
    let tasksRef = firebaseApp
      .database()
      .ref('tasks')
      .limitToFirst(10)
    watchList(tasksRef)

    // Watch the 'public_task' list and save its data in the location 'tasks' in our redux store
    watchList('public_tasks', 'tasks')
  }

  componentWillUnmount() {
    const { unwatchList } = this.props
    unwatchList('users') // Unwatch the 'users' list
    unwatchList('tasks') // To unwatch a query we can use just the ref path string
    unwatchList('public_tasks') // Unwatch a watcher that is stored in a specific location/path
  }

  renderList = () => {
    const { users } = this.props

    if (users === undefined) {
      return <div />
    }

    return _.map(users, (user, i) => {
      return <div key={i}>{user.val.displayName}</div>
    })
  }

  render() {
    const { isConnected } = this.props

    return <div>{this.renderList()}</div>
  }
}

const mapStateToProps = state => {
  const { lists } = state
  return {
    users: lists.users,
    tasks: lists.tasks // data from 'public_tasks' path
  }
}

export default connect(mapStateToProps)(withFirebase(MyComponent))
```

Here we unwatched the list on `componentWillUnmount`. We could also leave this away and the list will change in realtime in the background and it will not load all data on revisiting the Component again.

If you are using a persistant watcher you would have to unwatch them in some point of your application, or on application exit.  There are special calls to unwatch all persistant watchers in a single call. That could be called in the root component of your application like this:

```js

//... other code of your root Component

  componentWillUnmount() {
    const { unsubscribeConnection, unwatchAllLists, unwatchAllPaths } = this.props;
    unsubscribeConnection();
    unwatchAllLists();
    unwatchAllPaths();
  }

//... other code of your root Component

```

**INFO:** You can call the `watchList` and `watchPath` as often you want. The library caches initialized lists and paths to the `initialization` state so it knows if you are trying to initialize an already-initialized (and observed) list or path.  In that case the library does nothing. If you call `watchList('users')` in multiple places in your application you don't have to worry about it.  Your data is in the redux store ready to use.

As you noticed we here unwatch disconnects not only the lists but also the connection and the paths watchers.

### Paths

The paths watcher are configured similarly to the lists watcher with `watchPath` and `unwatchPath`.

```js
//...
  componentDidMount(){
    const { watchPath }= this.props;
    watchPath('users_count'); // Start watching the path
  }

  componentWillUnmount() {
    const { unwatchPath, destroyPath }= this.props;
    unwatchPath('users'); // Unwatch the path on unmounting the Component
    destroyPath('users'); // Destory the path. This will remove the path data from redux.

    //INFO: calling destroy will automaticaly unwatch the path or list
  }

//...
```

Here we also unwatch the path on `componentWillUnmount` but we could also leave the watcher persistant and unwatch it on application closing. This is useful if you need to load user data or user permissions from the database and you want that permission changes take effect in realtime to the user.

### Docs

`firekit` also supports `Firestore`, enabling you to watch changes on documents and collections.
The docs watcher works similarly to the paths watcher with `watchDoc` and `unwatchDoc`.

```js
//...
  componentDidMount(){
    const { watchDoc } = this.props;
    watchDoc('samples/sandwichData');
  }

  componentWillUnmount() {
    const { unwatchDoc, destroyDoc } = this.props;
    unwatchDoc('samples/sandwichData');
    destroyDoc('samples/sandwichData');

  }

//...
```

**IMPORTANT:**: Firebase RealtimDatabase (RTDB) enables us to have global unsubscription of watchers. This is not possible with Firestore! You must take care to unwatch each listener when leaving a component or instance where the watcher was initialised.

### Collections

The collections watcher is similar to the docs watcher with `watchCol` and `unwatchCol`.

```js
//...
  componentDidMount(){
    const { watchCol } = this.props;
    watchCol('posts');
  }

  componentWillUnmount() {
    const { unwatchCol, destroyCol } = this.props;
    unwatchCol('posts');

  }

//...
```

**IMPORTANT:**: Here we have the same restrictions as with Docs for the global unwatch feature.

### FireForm

`FireForm` is a special component created for usage with `redux-form`. It takes a `path` and an `uid` paramater to know where to get its data. The `name` property is the name of the `redux-form` Form name. All other properties are optional and are described later in this documentat. It is important to know that `FireForm` can only be used in Components that have the `withFirebase` called to access the `firebaseApp`.

Inside the `FireForm` we put as child our Form with the fields we want and the magic happens :smile:

All fields will be filled with the data from the `path` and `uid`. If no `uid` is provided, the form will create a new entry in your `path`.

And now comes the cool thing! If you are in the Form working on fields and someone else changes some data. Every field that you haven't modified will be updated in realtime! Isn't that cool ??!!?? :smile:

```js
//...

<FireForm
  firebaseApp = {firebaseApp}
  name = {'company'}
  path = {`${path}`}
  onSubmitSuccess = {values => {
    history.push('/companies')
  }}
  onDelete = {values => {
    history.push('/companies')
  }}
  handleCreateValues = {this.handleCreateValues}
  uid = {match.params.uid}
>
  <Form /> // Here is your simple form
</FireForm>

//...
```

### Messaging

Firebase offers a simple API for managing push notification messages. Firekit provides a simple API call `initMessaging` that manages all messaging events for you and syncs them to your redux store. The API receives a function paramater you can use to handle new messages. That parameter is optional. Firekit stores the messaging token, permission and new messages to your store automatically. In future there will be additional APIs to clear single and all messages.

```js
//...
  componentDidMount(){
    const { initMessaging } = this.props;
    initMessaging((payload) => {console.log(payload)}); // Initialise Firebase messaging and log messages to the console
  }

//...
```

## TO DO

- [x] combine all reducers into one import
- [x] integrate firebase messaging
- [x] integrate firebase auth watcher
- [x] integrate firebase queries watcher
- [x] implement alias names (custom destination locations) for path and list watchers
- [x] separate firekit-provider and fireform in seperate projects
- [x] integrate `firestore` documents watcher
- [x] integrate `firestore` collections watcher
- [x] integrate `firestore` queries watcher
- [x] integrate selectors for lists
- [x] integrate error handling
- [x] integrate loading indicators in redux state

## License

MIT @TarikHuber

[travis-image]: https://travis-ci.org/TarikHuber/firekit.svg?branch=master
[travis-url]: https://travis-ci.org/TarikHuber/firekit
[daviddm-image]: https://img.shields.io/david/TarikHuber/firekit.svg?style=flat-square
[daviddm-url]: https://david-dm.org/TarikHuber/firekit
[coverage-image]: https://img.shields.io/codecov/c/github/TarikHuber/firekit.svg?style=flat-square
[coverage-url]: https://codecov.io/gh/TarikHuber/firekit
[license-image]: https://img.shields.io/npm/l/express.svg
[license-url]: https://github.com/TarikHuber/firekit/master/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[code-style-url]: http://standardjs.com/

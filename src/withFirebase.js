import React from 'react'
import PropTypes from 'prop-types'
import { clearInitialization } from './store/initialization/actions'
import { initConnection, unsubscribeConnection } from './store/connection/actions'
import { watchAuth, authStateChanged, authError} from './store/auth/actions'
import { watchList, unwatchList, destroyList, unwatchAllLists } from './store/lists/actions'
import { watchPath, unwatchPath, destroyPath, unwatchAllPaths } from './store/paths/actions'
import { initMessaging, clearMessage } from './store/messaging/actions'

const withFirebase = (Component) => {
  const ChildComponent = (props, context) => {
    const {firebaseApp, store} = context
    const {dispatch} = store

    return <Component
      dispatch={dispatch}
      firebaseApp={firebaseApp}

      watchAuth={(onAuthStateChanged, onAuthError) => {
        dispatch(watchAuth(firebaseApp, onAuthStateChanged, onAuthError))
      }}

      clearInitialization={() => { dispatch(clearInitialization()) }}

      authStateChanged={(user) => { dispatch(authStateChanged(user)) }}
      authError={(error) => { dispatch(authError(error)) }}

      watchConnection={() => { dispatch(initConnection(firebaseApp)) }}
      unwatchConnection={() => { dispatch(unsubscribeConnection(firebaseApp)) }}

      watchList={(path, alias, append) => { dispatch(watchList(firebaseApp, path, alias, append)) }}
      unwatchList={(path, alias) => { dispatch(unwatchList(firebaseApp, path, alias)) }}
      destroyList={(path, alias) => { dispatch(destroyList(firebaseApp, path, alias)) }}
      unwatchAllLists={() => { dispatch(unwatchAllLists(firebaseApp)) }}

      watchPath={(path, alias) => { dispatch(watchPath(firebaseApp, path, alias)) }}
      unwatchPath={(path, alias) => { dispatch(unwatchPath(firebaseApp, path, alias)) }}
      destroyPath={(path, alias) => { dispatch(destroyPath(firebaseApp, path, alias)) }}
      unwatchAllPaths={() => { dispatch(unwatchAllPaths(firebaseApp)) }}

      clearApp={() => {
        dispatch(unwatchAllLists(firebaseApp))
        dispatch(unwatchAllPaths(firebaseApp))
        dispatch(unsubscribeConnection(firebaseApp))
      }}

      initMessaging={(handleTokenChange, onMessageReceieved) => { dispatch(initMessaging(firebaseApp, handleTokenChange, onMessageReceieved)) }}
      clearMessage={() => { dispatch(clearMessage()) }}

      {...props}
    />
  }

  ChildComponent.contextTypes = {
    firebaseApp: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  return ChildComponent
}

export default withFirebase

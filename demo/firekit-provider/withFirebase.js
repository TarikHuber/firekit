import PropTypes from 'prop-types'
import React from 'react'
import { clearInitialization } from '../../src/store/initialization/actions'
import { initConnection, unsubscribeConnection } from '../../src/store/connection/actions'
import { initMessaging, clearMessage } from '../../src/store/messaging/actions'
import { watchAuth, authStateChanged, authError } from '../../src/store/auth/actions'
import { watchCol, unwatchCol, destroyCol, unwatchAllCols } from '../../src/store/collections/actions'
import { watchDoc, unwatchDoc, destroyDoc, unwatchAllDocs } from '../../src/store/docs/actions'
import { watchList, unwatchList, destroyList, unwatchAllLists } from '../../src/store/lists/actions'
import { watchPath, unwatchPath, destroyPath, unwatchAllPaths } from '../../src/store/paths/actions'

const withFirebase = (Component) => {
  const ChildComponent = (props, context) => {
    const { firebaseApp, store } = context
    const { dispatch } = store

    return <Component
      dispatch={dispatch}
      firebaseApp={firebaseApp}

      watchAuth={(onAuthStateChanged, onAuthError) => {
        dispatch(watchAuth(firebaseApp, onAuthStateChanged, onAuthError))
      }}

      clearInitialization={() => { dispatch(clearInitialization()) }}

      authStateChanged={(user) => { dispatch(authStateChanged(user)) }}
      authError={(error) => { dispatch(authError(error)) }}

      watchConnection={(onChange) => { dispatch(initConnection(firebaseApp, onChange)) }}
      unwatchConnection={() => { dispatch(unsubscribeConnection(firebaseApp)) }}

      watchList={(path, alias, append) => { dispatch(watchList(firebaseApp, path, alias, append)) }}
      unwatchList={(path, alias) => { dispatch(unwatchList(firebaseApp, path, alias)) }}
      destroyList={(path, alias) => { dispatch(destroyList(firebaseApp, path, alias)) }}
      unwatchAllLists={() => { dispatch(unwatchAllLists(firebaseApp)) }}

      watchCol={(path, alias, append) => { dispatch(watchCol(firebaseApp, path, alias, append)) }}
      unwatchCol={(path, alias) => { dispatch(unwatchCol(firebaseApp, path, alias)) }}
      destroyCol={(path, alias) => { dispatch(destroyCol(firebaseApp, path, alias)) }}
      unwatchAllCols={() => { dispatch(unwatchAllCols(firebaseApp)) }}

      watchPath={(path, alias) => { dispatch(watchPath(firebaseApp, path, alias)) }}
      unwatchPath={(path, alias) => { dispatch(unwatchPath(firebaseApp, path, alias)) }}
      destroyPath={(path, alias) => { dispatch(destroyPath(firebaseApp, path, alias)) }}
      unwatchAllPaths={() => { dispatch(unwatchAllPaths(firebaseApp)) }}

      watchDoc={(path, alias) => { dispatch(watchDoc(firebaseApp, path, alias)) }}
      unwatchDoc={(path, alias) => { dispatch(unwatchDoc(firebaseApp, path, alias)) }}
      destroyDoc={(path, alias) => { dispatch(destroyDoc(firebaseApp, path, alias)) }}
      unwatchAllDocs={() => { dispatch(unwatchAllDocs(firebaseApp)) }}

      clearApp={() => {
        dispatch(unwatchAllLists(firebaseApp))
        dispatch(unwatchAllPaths(firebaseApp))
        dispatch(unwatchAllDocs(firebaseApp))
        dispatch(unwatchAllCols(firebaseApp))
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

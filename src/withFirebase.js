import React from 'react';
import PropTypes from 'prop-types';
import { clearInitialization } from './store/initialization/actions';
import { initConnection, unsubscribeConnection } from './store/connection/actions';
import { watchAuth, authStateChanged, authError} from './store/auth/actions';
import { watchList, unwatchList, unwatchAllLists } from './store/lists/actions';
import { watchPath, unwatchPath, unwatchAllPaths } from './store/paths/actions';
import { initMessaging } from './store/messaging/actions';

const withFirebase = (Component) => {
  const ChildComponent = (props, context) => {
    const {firebaseApp, store} = context;
    const {dispatch} =store;

    return <Component
      dispatch={dispatch}
      firebaseApp={firebaseApp}

      watchAuth={(onAuthStateChanged, onAuthError)=>{
        dispatch(watchAuth(firebaseApp, onAuthStateChanged, onAuthError))
      }}

      clearInitialization={()=>{dispatch(clearInitialization())}}

      authStateChanged={(user)=>{dispatch(authStateChanged(user))}}
      authError={(error)=>{dispatch(authError(error))}}

      watchConnection={()=>{dispatch(initConnection(firebaseApp))}}
      unwatchConnection={()=>{dispatch(unsubscribeConnection(firebaseApp))}}

      watchList={(path)=>{dispatch(watchList(firebaseApp, path))}}
      unwatchList={(path)=>{dispatch(unwatchList(firebaseApp, path))}}
      unwatchAllLists={()=>{dispatch(unwatchAllLists(firebaseApp))}}

      watchPath={(path)=>{dispatch(watchPath(firebaseApp, path))}}
      unwatchPath={(path)=>{dispatch(unwatchPath(firebaseApp, path))}}
      unwatchAllPaths={()=>{dispatch(unwatchAllPaths(firebaseApp))}}

      clearApp={()=>{
        dispatch(unwatchAllLists(firebaseApp))
        dispatch(unwatchAllPaths(firebaseApp))
        dispatch(unsubscribeConnection(firebaseApp))
      }}

      initMessaging={(handleTokenChange,onMessageReceieved)=>{dispatch(initMessaging(firebaseApp, handleTokenChange, onMessageReceieved))}}

      {...props}
    />;
  };

  ChildComponent.contextTypes = {
    firebaseApp: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };


  return ChildComponent;

}

export default withFirebase;

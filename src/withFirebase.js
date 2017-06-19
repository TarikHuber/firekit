import React from 'react';
import PropTypes from 'prop-types';
import { initConnection, unsubscribeConnection } from './store/connection/actions';
import { watchList, unwatchList, unwatchAllLists } from './store/lists/actions';
import { watchPath, unwatchPath, unwatchAllPaths } from './store/paths/actions';
import { initMessaging } from './store/messaging/actions';

const withFirebase = (Component) => {
    const ChildComponent = (props, context) => {
      const {firebaseApp, store} = context;
      const {dispatch} =store;

      return <Component
        firebaseApp={firebaseApp}

        initConnection={()=>{dispatch(initConnection(firebaseApp))}}
        unsubscribeConnection={()=>{dispatch(unsubscribeConnection(firebaseApp))}}

        watchList={(path)=>{dispatch(watchList(firebaseApp, path))}}
        unwatchList={(path)=>{dispatch(unwatchList(firebaseApp, path))}}
        unwatchAllLists={()=>{dispatch(unwatchAllLists(firebaseApp))}}

        watchPath={(path)=>{dispatch(watchPath(firebaseApp, path))}}
        unwatchPath={(path)=>{dispatch(unwatchPath(firebaseApp, path))}}
        unwatchAllPaths={()=>{dispatch(unwatchAllPaths(firebaseApp))}}

        initMessaging={(onMessageReceieved)=>{dispatch(initMessaging(firebaseApp, onMessageReceieved))}}

        dispatch={dispatch}


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

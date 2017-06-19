import * as types from './types';
import * as selectors from './selectors';
import * as initSelectors from '../initialization/selectors';

const initialize = (list, path) => {
  return {
    type: types.INIIALIZE,
    payload: list,
    path
  };
}

const childAdded = (child, path) => {
  return {
    type: types.CHILD_ADDED,
    payload: child,
    path
  };
}

const childChanged = (child, path) => {
  return {
    type: types.CHILD_CHANGED,
    payload: child,
    path
  };
}

const childRemoved = (child, path) => {
  return {
    type: types.CHILD_REMOVED,
    payload: child,
    path
  };
}

const destroy = (path) => {
  return {
    type: types.DESTROY,
    path
  };
}
const unWatch = (path) => {
  return {
    type: types.UNWATCH,
    path
  };
}

const getPayload = (snapshot) => {
  return {key: snapshot.key, val: snapshot.val() };
}


const getPath = (firebaseApp, ref) => {
  return ref.toString().substring(firebaseApp.database().ref().root.toString().length);
}

const getRef = (firebaseApp, path) => {

  if (typeof path === 'string' || path instanceof String){
    return firebaseApp.database().ref(path);
  }else{
    return path;
  }

}

const getLocation = (firebaseApp, path) => {

  if (typeof path === 'string' || path instanceof String){
    return path;
  }else{
    return getPath(firebaseApp, path);
  }

}

export function watchList(firebaseApp, path) {

  let ref =getRef(firebaseApp, path);
  let location=getLocation(firebaseApp, path);

  return (dispatch, getState) => {
    let initialized = false;
    const isInitialized=initSelectors.isInitialised(getState(), location);

    if(!isInitialized){

      ref.once("value", snapshot => {
        initialized = true;

        let list = [];

        snapshot.forEach(function(childSnapshot) {
          let childKey = childSnapshot.key;
          let childData = childSnapshot.val();

          list.push({key: childKey, val: childData});
        });

        dispatch(initialize(list, location));
      });

      ref.on('child_added', snapshot => {
        if (initialized) {
          dispatch(childAdded(getPayload(snapshot), location));
        }
      });

      ref.on('child_changed', snapshot => {
        dispatch(childChanged(getPayload(snapshot), location));
      });

      ref.on('child_removed', snapshot => {
        dispatch(childRemoved(getPayload(snapshot), location));
      });

    }

  }

}


export function unwatchList(firebaseApp, path) {
  return dispatch => {

    let ref =getRef(firebaseApp, path);
    let location=getLocation(firebaseApp, path);

    ref.off();
    dispatch(unWatch(location));
  }

}

export function destroyList(firebaseApp, path) {
  return dispatch => {
    let ref =getRef(firebaseApp, path);
    let location=getLocation(firebaseApp, path);

    ref.off();
    dispatch(unWatch(location));
    dispatch(destroy(location));
  }
}

export function unwatchAllLists(firebaseApp, path) {
  return (dispatch, getState) => {

    const allLists=selectors.getAllLists(getState())

    Object.keys(allLists).forEach(function(key,index) {
      firebaseApp.database().ref(key).off();
      dispatch(unWatch(key));
    });


  }

}

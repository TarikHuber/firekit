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
  return {data: snapshot.val(), key: snapshot.key };
}


export function watchList(firebaseApp, path) {

  return (dispatch, getState) => {
    let initialized = false;
    const isInitialized=initSelectors.isInitialised(getState(), path);

    if(!isInitialized){
      const ref=firebaseApp.database().ref(path);

      ref.once("value", snapshot => {
        initialized = true;

        let list = {};

        snapshot.forEach(function(childSnapshot) {
          let childKey = childSnapshot.key;
          let childData = childSnapshot.val();

          list[childKey]=childData;
        });

        dispatch(initialize(list, path));
      });

      ref.on('child_added', snapshot => {
        if (initialized) {
          dispatch(childAdded(getPayload(snapshot), path));
        }
      });

      ref.on('child_changed', snapshot => {
        dispatch(childChanged(getPayload(snapshot), path));
      });

      ref.on('child_removed', snapshot => {
        dispatch(childRemoved(getPayload(snapshot), path));
      });

    }

  }

}


export function unwatchList(firebaseApp, path) {
  return dispatch => {
    firebaseApp.database().ref(path).off();
    dispatch(unWatch(path));
  }

}

export function destroyList(firebaseApp, path) {
  return dispatch => {
    firebaseApp.database().ref(path).off();
    dispatch(unWatch(path));
    dispatch(destroy(path));
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

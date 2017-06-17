import * as types from './types';
import * as selectors from './selectors';
import * as initSelectors from '../initialization/selectors';

const valueChanged = (value, path) => {
  return {
    type: types.VALUE_CHANGED,
    payload: value,
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


export function watchPath(firebaseApp, path) {

  return (dispatch, getState) => {

    const isInitialized=initSelectors.isInitialised(getState(), path);

    if(!isInitialized){
      const ref=firebaseApp.database().ref(path);

      ref.on('value', snapshot => {
        dispatch(valueChanged(snapshot.val(), path));
      });

    }

  }

}


export function unwatchPath(firebaseApp, path) {
  return dispatch => {
    firebaseApp.database().ref(path).off();
    dispatch(unWatch(path));
  }

}

export function destroyPath(firebaseApp, path) {
  return dispatch => {
    firebaseApp.database().ref(path).off();
    dispatch(unWatch(path));
    dispatch(destroy(path));
  }

}

export function unwatchAllPaths(firebaseApp) {
  return (dispatch, getState) => {

    const allPaths=selectors.getAllPaths(getState())

    Object.keys(allPaths).forEach(function(key,index) {
      firebaseApp.database().ref(key).off();
      dispatch(unWatch(key));
    });


  }

}

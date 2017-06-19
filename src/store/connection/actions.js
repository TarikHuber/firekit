import * as types from './types';

export function onConnectionStateChange(isConnected) {
  return {
    type: types.ON_CONNECTION_STATE_CHANGED,
    payload: {isConnected}
  };
}

export function initConnection(firebaseApp) {
  return dispatch => {
    firebaseApp.database().ref(".info/connected").on("value", snapshot => {
      dispatch(onConnectionStateChange(snapshot.val()));
    });
  }

}


export function unsubscribeConnection(firebaseApp) {
  return dispatch => {
    firebaseApp.database().ref(".info/connected").off();
    onConnectionStateChange(false)
  }
}

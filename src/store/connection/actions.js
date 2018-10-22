import * as types from './types'
import { logError } from '../errors/actions'

export function onConnectionStateChange(isConnected) {
  return {
    type: types.ON_CONNECTION_STATE_CHANGED,
    payload: { isConnected }
  }
}

export function initConnection(firebaseApp, onChange) {
  return dispatch => {
    firebaseApp
      .database()
      .ref('.info/connected')
      .on(
        'value',
        snapshot => {
          dispatch(onConnectionStateChange(snapshot.val()))

          if (onChange !== undefined && onChange instanceof Function) {
            onChange(snapshot.val())
          }
        },
        err => {
          console.error(err)
          dispatch(logError('.info/connected', err))
        }
      )
  }
}

export function unsubscribeConnection(firebaseApp) {
  return dispatch => {
    firebaseApp
      .database()
      .ref('.info/connected')
      .off()
    dispatch(onConnectionStateChange(false))
  }
}

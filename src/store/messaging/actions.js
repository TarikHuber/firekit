import * as types from './types'

export function onTokenChanged (token) {
  return {
    type: types.TOKEN_CHANGED,
    payload: { token, isInitialized: true }
  }
}

export function onPermissionChanged (hasPermission, onMessage) {
  return {
    type: types.PERMISSION_CHANGED,
    payload: { hasPermission, isInitialized: true }
  }
}

export function onMessage (message) {
  return {
    type: types.ON_MESSAGE,
    payload: { message }
  }
}
export function clearMessage () {
  return {
    type: types.ON_CLEAR_MESSAGE
  }
}

export function onMessagingError (error) {
  return {
    type: types.MESSAGING_ERROR,
    payload: { error }
  }
}

export function initMessaging (firebaseApp, handleTokenChange, onMessageReceieved, onBackgroundMessageReceived) {
  return dispatch => {
    const messaging = firebaseApp.messaging()

    try {
      messaging.requestPermission()
        .then(() => {
          return messaging.getToken()
        })
        .then(token => {
          if (handleTokenChange !== undefined && handleTokenChange instanceof Function) {
            handleTokenChange(token)
          }

          dispatch(onPermissionChanged(true))
          dispatch(onTokenChanged(token))
        })
        .catch(error => {
          dispatch(onPermissionChanged(false))
          console.warn(error)
        })
    } catch (e) {
      dispatch(onPermissionChanged(false))
      console.warn(e)
    }

    messaging.onMessage(payload => {
      if (onMessageReceieved !== undefined && onMessageReceieved instanceof Function) {
        onMessageReceieved(payload)
      }

      dispatch(onMessage(payload))
    })
  }
}

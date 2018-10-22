import * as types from './types'

export function authStateChanged(user) {
  return {
    type: types.AUTH_STATE_CHANGED,
    payload: user
  }
}

export function authError(error) {
  return {
    type: types.AUTH_ERROR,
    payload: error
  }
}

export function defaultUserData(user) {
  if (user != null) {
    return {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      uid: user.uid,
      providerData: user.providerData,
      isAuthorised: true
    }
  } else {
    return {
      isAuthorised: false
    }
  }
}

export function watchAuth(firebaseApp, onAuthStateChanged, onAuthError) {
  return dispatch => {
    firebaseApp.auth().onAuthStateChanged(
      user => {
        if (onAuthStateChanged && onAuthStateChanged instanceof Function) {
          dispatch(authStateChanged({ isAuthorised: !!user, ...onAuthStateChanged(user) }))
        } else {
          dispatch(authStateChanged({ isAuthorised: !!user, ...defaultUserData(user) }))
        }
      },
      error => {
        if (onAuthError && onAuthError instanceof Function) {
          dispatch(authError(error))
        } else {
          dispatch(authError(error))
        }
      }
    )
  }
}

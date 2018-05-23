import * as types from './types'
import * as selectors from './selectors'
import * as initSelectors from '../initialization/selectors'
import { logError } from '../errors/actions'
import { logLoading } from '../loadings/actions'

export const valueChanged = (value, location, path) => {
  return {
    type: types.VALUE_CHANGED,
    payload: value,
    path,
    location,
    locationValue: true
  }
}

export const destroy = (location) => {
  return {
    type: types.DESTROY,
    location
  }
}

export const unWatch = (path) => {
  return {
    type: types.UNWATCH,
    path
  }
}

export function watchPath(firebaseApp, firebasePath, reduxPath = false, logLoad = true) {
  const location = reduxPath || firebasePath

  return (dispatch, getState) => {
    const isInitialized = initSelectors.isInitialised(getState(), location)

    if (!isInitialized) {
      const ref = firebaseApp.database().ref(firebasePath)
      const path = ref.toString()

      if (logLoad) {
        dispatch(logLoading(location))
      }


      ref.on('value', snapshot => {
        dispatch(valueChanged(snapshot.val(), location, path))
      }, err => {
        dispatch(logError(location, err))
      })
    }
  }
}

export function unwatchPath(firebaseApp, path, reduxPath = false) {
  return dispatch => {
    const location = reduxPath || path
    firebaseApp.database().ref(path).off()
    dispatch(unWatch(location))
  }
}

export function destroyPath(firebaseApp, path, reduxPath = false) {
  const location = reduxPath || path

  return dispatch => {
    firebaseApp.database().ref(path).off()
    dispatch(unWatch(location))
    dispatch(destroy(location))
  }
}

export function unwatchAllPaths(firebaseApp) {
  return (dispatch, getState) => {
    const allPaths = selectors.getAllPaths(getState())

    Object.keys(allPaths).forEach(function (key, index) {
      firebaseApp.database().ref(allPaths[index]).off()
      dispatch(unWatch(key))
    })
  }
}

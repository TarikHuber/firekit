import * as types from './types'
import * as selectors from './selectors'
import * as initSelectors from '../initialization/selectors'

export const valueChanged = (value, location, path, locationValue) => {
  return {
    type: types.VALUE_CHANGED,
    payload: value,
    path,
    location,
    locationValue
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

const getRef = (firebaseApp, path) => {
  if (typeof path === 'string' || path instanceof String) {
    return firebaseApp.firestore().doc(path)
  } else {
    return path
  }
}

const getLocation = (firebaseApp, path) => {
  if (typeof path === 'string' || path instanceof String) {
    return path
  } else {
    return firebaseApp.firestore().doc(path).path
  }
}

export function watchDoc (firebaseApp, firebasePath, reduxPath=false) {

  let ref = getRef(firebaseApp, firebasePath)
  let path = ref.path
  let location = reduxPath?reduxPath:getLocation(firebaseApp, firebasePath)

  return (dispatch, getState) => {
    const isInitialized = initSelectors.isInitialised(getState(), location)

    if (!isInitialized) {
      let unsub = ref.onSnapshot( doc => {
        dispatch(valueChanged(doc.data(), location, path, unsub))
      })
    }
  }
}

export function unwatchDoc (firebaseApp, path, reduxPath=false) {

  return (dispatch, getState) => {
    const location = reduxPath?reduxPath:path
    const allInitializations = selectors.getAllInitializations(getState())
    const unsubs=allInitializations[location]

    Object.keys(unsubs).map((key)=>{
      const unsub=unsubs[key]
      unsub()
      dispatch(unWatch(location))
    })
  }
}

export function destroyDoc (firebaseApp, path, reduxPath=false) {

  const location = reduxPath?reduxPath:path

  return dispatch => {
    firebaseApp.database().ref(path).off()
    dispatch(unWatch(location))
    dispatch(destroy(location))
  }
}

export function unwatchAllDocs (firebaseApp) {
  return (dispatch, getState) => {
    const allPaths = selectors.getAllDocs(getState())

    Object.keys(allPaths).forEach(function (key, index) {
      firebaseApp.database().ref(allPaths[index]).off()
      dispatch(unWatch(key))
    })
  }
}

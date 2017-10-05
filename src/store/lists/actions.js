import * as types from './types'
import * as selectors from './selectors'
import * as initSelectors from '../initialization/selectors'

export const initialize = (list, location, path, append) => {
  return {
    type: types.INIIALIZE,
    payload: list,
    path,
    location,
    append,
    locationValue: true
  }
}


export const childAdded = (child, location) => {
  return {
    type: types.CHILD_ADDED,
    payload: child,
    location
  }
}

export const childChanged = (child, location) => {
  return {
    type: types.CHILD_CHANGED,
    payload: child,
    location
  }
}

export const childRemoved = (child, location) => {
  return {
    type: types.CHILD_REMOVED,
    payload: child,
    location
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

const getPayload = (snapshot) => {
  return {key: snapshot.key, val: snapshot.val() }
}

const getPath = (firebaseApp, ref) => {
  return ref.toString().substring(firebaseApp.database().ref().root.toString().length)
}

const getRef = (firebaseApp, path) => {
  if (typeof path === 'string' || path instanceof String) {
    return firebaseApp.database().ref(path)
  } else {
    return path
  }
}

const getLocation = (firebaseApp, path) => {
  if (typeof path === 'string' || path instanceof String) {
    return path
  } else {
    return getPath(firebaseApp, path)
  }
}

export function watchList (firebaseApp, firebasePath, reduxPath=false, append=false) {
  let ref = getRef(firebaseApp, firebasePath)
  let path = ref.toString()
  let location = reduxPath?reduxPath:getLocation(firebaseApp, firebasePath)

  return (dispatch, getState) => {
    let initialized = false
    const isInitialized = initSelectors.isInitialised(getState(), path, location)

    if (!isInitialized) {
      ref.once('value', snapshot => {
        initialized = true

        let list = []

        snapshot.forEach(function (childSnapshot) {
          let childKey = childSnapshot.key
          let childData = childSnapshot.val()

          list.push({key: childKey, val: childData})
        })

        dispatch(initialize(list, location, path, append))

      })

      ref.on('child_added', snapshot => {
        if (initialized) {
          dispatch(childAdded(getPayload(snapshot), location))
        }
      })

      ref.on('child_changed', snapshot => {
        dispatch(childChanged(getPayload(snapshot), location))
      })

      ref.on('child_removed', snapshot => {
        dispatch(childRemoved(getPayload(snapshot), location))
      })
    }
  }
}

export function unwatchList (firebaseApp, firebasePath) {
  return dispatch => {
    let ref = getRef(firebaseApp, firebasePath)
    ref.off()
    dispatch(unWatch(ref.toString()))
  }
}

export function destroyList (firebaseApp, firebasePath, reduxPath=false) {
  return (dispatch, getState) => {
    let ref = getRef(firebaseApp, firebasePath)
    const locations=getState().initialization[ref.toString()]

    ref.off()
    dispatch(unWatch(ref.toString()))

    if(reduxPath){
      dispatch(destroy(reduxPath))
    }else if(locations){
      Object.keys(locations).forEach(location=>{
        dispatch(destroy(location))
      })
    }

  }
}


export function unwatchAllLists (firebaseApp, path) {
  return (dispatch, getState) => {
    const allLists = selectors.getAllLists(getState())

    Object.keys(allLists).forEach(function (key, index) {
      const ref = firebaseApp.database().ref(key)
      ref.off()
      dispatch(unWatch(ref.toString()))
    })
  }
}

export function destroyAllLists (firebaseApp, path) {
  return (dispatch, getState) => {
    const allLists = selectors.getAllLists(getState())

    Object.keys(allLists).forEach(function (key, index) {
      const ref = firebaseApp.database().ref(key)
      ref.off()
      dispatch(destroyList(firebaseApp, ref.toString()))
    })
  }
}

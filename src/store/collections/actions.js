import * as types from './types'
import * as selectors from './selectors'
import * as initSelectors from '../initialization/selectors'
import { logError } from '../errors/actions'
import { logLoading } from '../loadings/actions'

export const initialize = (list, location, path, locationValue, append) => {
  return {
    type: types.INIIALIZE,
    payload: list,
    path,
    location,
    append,
    locationValue
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

export const destroy = location => {
  return {
    type: types.DESTROY,
    location
  }
}

export const unWatch = path => {
  return {
    type: types.UNWATCH,
    path
  }
}

const getPath = (firebaseApp, ref) => {
  return ref._query.path.segments.join('/')
}

export const getRef = (firebaseApp, path) => {
  if (typeof path === 'string' || path instanceof String) {
    return firebaseApp.firestore().collection(path)
  } else {
    return path
  }
}

export const getLocation = (firebaseApp, path) => {
  if (typeof path === 'string' || path instanceof String) {
    return path
  } else {
    return getPath(firebaseApp, path)
  }
}

export function watchCol(firebaseApp, firebasePath, reduxPath = false, append = false) {
  let ref = getRef(firebaseApp, firebasePath)
  const path = getLocation(firebaseApp, firebasePath)
  let location = reduxPath || path

  return (dispatch, getState) => {
    const isInitialized = initSelectors.isInitialised(getState(), path, location)
    let initialized = false

    if (!isInitialized) {
      dispatch(logLoading(location))
      const unsub = ref.onSnapshot(
        snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              if (initialized) {
                dispatch(
                  childAdded(
                    {
                      id: change.doc.id,
                      data: change.doc.data()
                    },
                    location
                  )
                )
              } else {
                initialized = true
                dispatch(
                  initialize(
                    [
                      {
                        id: change.doc.id,
                        data: change.doc.data()
                      }
                    ],
                    location,
                    path,
                    unsub,
                    append
                  )
                )
              }
            }
            if (change.type === 'modified') {
              dispatch(
                childChanged(
                  {
                    id: change.doc.id,
                    data: change.doc.data()
                  },
                  location
                )
              )
            }
            if (change.type === 'removed') {
              dispatch(
                childRemoved(
                  {
                    id: change.doc.id,
                    data: change.doc.data()
                  },
                  location
                )
              )
            }
          })
        },
        err => {
          console.error(err)
          dispatch(logError(location, err))
        }
      )
    }
  }
}

export function unwatchCol(firebaseApp, firebasePath) {
  return (dispatch, getState) => {
    const location = firebasePath
    const allInitializations = selectors.getAllInitializations(getState())
    const unsubs = allInitializations[location]

    if (unsubs) {
      Object.keys(unsubs).map(key => {
        const unsub = unsubs[key]
        if (typeof unsub === 'function') {
          unsub()
        }
        dispatch(unWatch(location))
      })
    }
  }
}

export function destroyCol(firebaseApp, firebasePath, reduxPath = false) {
  return (dispatch, getState) => {
    const location = reduxPath || getLocation(firebaseApp, firebasePath)
    const locations = getState().initialization[location]

    dispatch(unWatch(location))
    dispatch(destroy(location))

    if (reduxPath) {
      dispatch(destroy(reduxPath))
      unwatchCol(firebaseApp, reduxPath)
    } else if (locations) {
      Object.keys(locations).forEach(location => {
        unwatchCol(firebaseApp, location)
        dispatch(destroy(location))
      })
    }
  }
}

export function unwatchAllCol(firebaseApp, path) {
  return (dispatch, getState) => {
    const allLists = selectors.getAllCols(getState())

    Object.keys(allLists).forEach(function(key, index) {
      unwatchCol(firebaseApp, key)
      dispatch(unWatch(key))
    })
  }
}

export function unwatchAllCols(firebaseApp, path) {
  return (dispatch, getState) => {
    const allColls = selectors.getAllCols(getState())

    Object.keys(allColls).forEach(function(key, index) {
      unwatchCol(firebaseApp, key)
      dispatch(destroyCol(firebaseApp, allColls[index]))
    })
  }
}

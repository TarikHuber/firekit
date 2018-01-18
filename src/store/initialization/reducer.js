import * as collectionsTypes from '../collections/types'
import * as docsTypes from '../docs/types'
import * as listsTypes from '../lists/types'
import * as pathsTypes from '../paths/types'
import * as types from './types'

function locations(state = [], action) {
  const { location, locationValue } = action
  switch (action.type) {
    case listsTypes.INIIALIZE:
    case collectionsTypes.INIIALIZE:
    case pathsTypes.VALUE_CHANGED:
    case docsTypes.VALUE_CHANGED:
      return {
        ...state, [location]: locationValue
      }
  }
}

export default function initialization(state = {}, action) {
  const { path } = action

  switch (action.type) {
    case listsTypes.INIIALIZE:
    case collectionsTypes.INIIALIZE:
    case pathsTypes.VALUE_CHANGED:
    case docsTypes.VALUE_CHANGED:
      return {
        ...state,
        [path]: locations(state[path], action)
      }

    case types.CLEAR_INITIALIZATION:
      return {}

    case listsTypes.DESTROY:
    case listsTypes.UNWATCH:
    case collectionsTypes.DESTROY:
    case collectionsTypes.UNWATCH:
    case pathsTypes.DESTROY:
    case pathsTypes.UNWATCH:
    case docsTypes.DESTROY:
    case docsTypes.UNWATCH:
      let { [path]: omit, ...rest } = state
      return { ...rest }

    default:
      return state
  }
}

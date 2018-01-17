import * as collectionsTypes from '../collections/types'
import * as docsTypes from '../docs/types'
import * as listsTypes from '../lists/types'
import * as pathsTypes from '../paths/types'
import * as types from './types'

export default function errors (state = {}, action) {
  const { location, err } = action

  switch (action.type) {
    case types.LOG_ERROR:
      return {
        ...state,
        [location]: err
      }

    case types.CLEAR_ALL_ERRORS:
      return {}

    case types.CLEAR_ERROR:
    case collectionsTypes.INIIALIZE:
    case listsTypes.INIIALIZE:
    case pathsTypes.VALUE_CHANGED:
    case docsTypes.VALUE_CHANGED:
    case listsTypes.DESTROY:
    case listsTypes.UNWATCH:
    case collectionsTypes.DESTROY:
    case collectionsTypes.UNWATCH:
    case pathsTypes.DESTROY:
    case pathsTypes.UNWATCH:
    case docsTypes.DESTROY:
    case docsTypes.UNWATCH:
      let { [location]: omit, ...rest } = state
      return { ...rest }

    default:
      return state
  }
}

import * as collectionsTypes from '../collections/types'
import * as docsTypes from '../docs/types'
import * as listsTypes from '../lists/types'
import * as pathsTypes from '../paths/types'
import * as errorTypes from '../errors/types'
import * as types from './types'

export default function loadings(state = {}, action) {
  const { location } = action

  switch (action.type) {
    case types.LOG_LOADING:
      return {
        ...state,
        [location]: true
      }

    case types.CLEAR_ALL_LOADINGS:
      return {}

    case types.CLEAR_LOADING:
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
    case errorTypes.LOG_ERROR:
      let { [location]: omit, ...rest } = state
      return { ...rest }

    default:
      return state
  }
}

import * as listsTypes from '../lists/types'
import * as pathsTypes from '../paths/types'
import * as types from './types'


function locations (state = [], action) {
  const {path, location} = action
  switch (action.type) {
    case listsTypes.INIIALIZE:
      return {
        ...state, [location]:true
      }

    default:
      return state
  }
}

export default function initialization (state = {}, action) {
  const { path, location } = action

  switch (action.type) {
    case listsTypes.INIIALIZE:
      return {
        ...state,
        [path]: locations(state[path], action)
      }

    case pathsTypes.VALUE_CHANGED:
      return {
        ...state,
        [path]: locations(state[path], action)
      }

    case types.CLEAR_INITIALIZATION:
      return {}

    case listsTypes.DESTROY:
    case listsTypes.UNWATCH:
    case pathsTypes.DESTROY:
    case pathsTypes.UNWATCH:
      let {[path]: omit, ...rest} = state
      return { ...rest}

    default:
      return state
  }
}

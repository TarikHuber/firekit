import * as types from './types'

function list(list = [], action) {
  const { payload, append } = action
  switch (action.type) {
    case types.INIIALIZE:
      return append ? [...list, ...payload] : payload

    case types.CHILD_ADDED:
      return list.findIndex(d => d.key === payload.key) === -1 ? [...list, payload] : [...list]

    case types.CHILD_CHANGED:
      return list.map(child => (payload.key === child.key ? payload : child))

    case types.CHILD_REMOVED:
      return list.filter(child => payload.key !== child.key)
  }
}

export default function lists(state = {}, action) {
  const { location } = action

  switch (action.type) {
    case types.INIIALIZE:
      return {
        ...state,
        [location]: list(state[action.location], action)
      }

    case types.CHILD_ADDED:
    case types.CHILD_CHANGED:
    case types.CHILD_REMOVED:
      return { ...state, [location]: list(state[action.location], action) }

    case types.DESTROY:
      const { [location]: omitData, ...rest } = state
      return { ...rest }

    default:
      return state
  }
}

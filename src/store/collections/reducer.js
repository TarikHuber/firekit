import * as types from './types'

function collection(list = [], action) {
  const { payload, append } = action
  switch (action.type) {
    case types.INIIALIZE:
      return append ? [...list, ...payload] : payload

    case types.CHILD_ADDED:
      return list.findIndex(d => d.id === payload.id) === -1 ? [...list, payload] : [...list]

    case types.CHILD_CHANGED:
      return list.map(child => (payload.id === child.id ? payload : child))

    case types.CHILD_REMOVED:
      return list.filter(child => payload.id !== child.id)
  }
}

export default function collections(state = {}, action) {
  const { location } = action

  switch (action.type) {
    case types.INIIALIZE:
      return {
        ...state,
        [location]: collection(state[action.location], action)
      }

    case types.CHILD_ADDED:
    case types.CHILD_CHANGED:
    case types.CHILD_REMOVED:
      return { ...state, [location]: collection(state[action.location], action) }

    case types.DESTROY:
      const { [location]: omitData, ...rest } = state
      return { ...rest }

    default:
      return state
  }
}

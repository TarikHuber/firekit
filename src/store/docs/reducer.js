import * as types from './types'

export default function docs(state = {}, action) {
  const { location } = action

  switch (action.type) {
    case types.VALUE_CHANGED:
      return { ...state, [location]: action.payload }

    case types.DESTROY:
      const { [location]: omitData, ...rest } = state
      return { ...rest }

    default:
      return state
  }
}

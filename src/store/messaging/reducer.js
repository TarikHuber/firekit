import * as types from './types'

export const initialState = {
  hasPermission: false,
  token: undefined
}

export default function messaging(state = initialState, { payload, type }) {
  switch (type) {
    case types.PERMISSION_CHANGED:
    case types.TOKEN_CHANGED:
    case types.MESSAGING_ERROR:
    case types.ON_MESSAGE:
      return { ...state, ...payload }

    case types.ON_CLEAR_MESSAGE:
      const { message, ...rest } = state
      return { ...rest }

    default:
      return state
  }
}

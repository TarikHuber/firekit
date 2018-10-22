import * as types from './types'

export const initialState = {}

export default function auth(state = initialState, { payload, type }) {
  switch (type) {
    case types.AUTH_STATE_CHANGED:
      return { ...state, ...payload }

    case types.AUTH_ERROR:
      return { ...state, error: payload }

    default:
      return state
  }
}

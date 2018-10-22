import * as types from './types'

export const initialState = {
  isConnected: true
}

export default function connection(state = initialState, { payload, type }) {
  switch (type) {
    case types.ON_CONNECTION_STATE_CHANGED:
      return { ...state, ...payload }

    default:
      return state
  }
}

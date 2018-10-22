import * as types from './types'

export function logLoading(location) {
  return {
    type: types.LOG_LOADING,
    location
  }
}
export function clearLoading(location) {
  return {
    type: types.CLEAR_LOADING,
    location
  }
}

export function clearAllLoadings() {
  return {
    type: types.CLEAR_ALL_LOADINGS
  }
}

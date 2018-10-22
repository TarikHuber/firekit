import * as types from './types'

export function logError(location, err) {
  return {
    type: types.LOG_ERROR,
    location,
    err
  }
}
export function clearError(location) {
  return {
    type: types.CLEAR_ERROR,
    location
  }
}

export function clearAllErrors() {
  return {
    type: types.CLEAR_ALL_ERRORS
  }
}

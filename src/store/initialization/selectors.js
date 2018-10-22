export function isInitialised(state, path, location) {
  if (state.initialization !== undefined && state.initialization[path]) {
    return state.initialization[path][location]
  }

  return false
}

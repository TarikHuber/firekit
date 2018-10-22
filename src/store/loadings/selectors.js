export function isLoading(state, location) {
  if (state.loadings !== undefined && state.loadings[location]) {
    return state.loadings[location]
  }

  return false
}

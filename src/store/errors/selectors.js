export function hasError(state, path) {
  if (state.errors !== undefined && state.errors[path]) {
    return state.errors[path]
  }

  return false
}

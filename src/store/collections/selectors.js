export function getAllCols(state) {
  return state.collections
}

export function getAllInitializations(state) {
  return state.initialization
}

export function getCol(state, location) {
  if (state.collections !== undefined && state.collections[location]) {
    return state.collections[location]
  }

  return []
}

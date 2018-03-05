
export function getAllPaths (state) {
  return state.paths
}

export function getPath (state, location) {
  if (state.paths !== undefined && state.paths[location]) {
    return state.paths[location]
  }

  return {}
}

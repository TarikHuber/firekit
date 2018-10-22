export function getAllDocs(state) {
  return state.docs
}

export function getAllInitializations(state) {
  return state.initialization
}

export function getDoc(state, location) {
  if (state.docs !== undefined && state.docs[location]) {
    return state.docs[location]
  }

  return null
}

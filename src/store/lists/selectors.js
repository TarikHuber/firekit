export function getAllLists(state) {
  return state.lists
}

export function getList(state, location) {
  if (state.lists !== undefined && state.lists[location]) {
    return state.lists[location]
  }

  return []
}

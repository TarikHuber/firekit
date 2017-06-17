export function isInitialised(state, path){

  if(state.initialization!==undefined ){
    return state.initialization[path];
  }

  return false;

}

import _ from 'lodash'
import * as types from './types';


function list(list=[], action){
  const {payload} = action;
  switch (action.type) {

    case types.INIIALIZE:
    return payload;

    case types.CHILD_ADDED:
    return [ ...list, payload]

    case types.CHILD_CHANGED:
    return list.map(child=>payload.key===child.key?payload:child);

    case types.CHILD_REMOVED:
    return list.filter(child=>payload.key!==child.key);

    default:
    return list;
  }

}


export default function lists (state = {}, action) {

  const { path } = action;

  switch (action.type) {

    case types.INIIALIZE:
    return {
      ...state,
      [path]: list(state[action.path], action)
    };

    case types.CHILD_ADDED:
    case types.CHILD_CHANGED:
    case types.CHILD_REMOVED:
    return {...state, [path]: list(state[action.path], action)};

    case types.DESTROY:
    const {[path]: omitData, ...rest} =state;
    return {...rest};

    default:
    return state;
  }
}

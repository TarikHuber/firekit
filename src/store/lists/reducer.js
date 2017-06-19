import * as types from './types';


function list(list={}, action){
  const {payload} = action;
  switch (action.type) {

    case types.INIIALIZE:
    return { ...payload };

    case types.CHILD_ADDED:
    case types.CHILD_CHANGED:
    return {...list,   [payload.key]: payload.data};

    case types.CHILD_REMOVED:
    let { [payload.key]: omit, ...rest}= list;
    return { ...rest };

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

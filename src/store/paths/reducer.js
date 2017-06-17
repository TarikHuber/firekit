import * as types from './types';

export default function paths (state = {}, action) {

  const { path } = action;

  switch (action.type) {

    case types.VALUE_CHANGED:
    return {...state, [path]: action.payload};

    case types.DESTROY:
    const {[path]: omitData, ...rest} =state;
    return {...rest};

    default:
    return state;
  }
}

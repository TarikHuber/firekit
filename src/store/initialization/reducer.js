import * as listsTypes from '../lists/types';
import * as pathsTypes from '../paths/types';
import * as types from './types';


export default function initialization(state = {}, action) {

  switch (action.type) {

    case listsTypes.INIIALIZE:
    return {
      ...state,[action.path]: true
    };

    case pathsTypes.VALUE_CHANGED:
    return {
      ...state,[action.path]: true
    };

    case types.CLEAR_INITIALIZATION:
    return {};

    case listsTypes.DESTROY:
    case listsTypes.UNWATCH:
    case pathsTypes.DESTROY:
    case pathsTypes.UNWATCH:
    let {[action.path]: omit, ...rest} = state;
    return { ...rest};

    default:
    return state;
  }
}

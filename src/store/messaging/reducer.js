import * as types from './types';

export const initialState={
  hasPermission: false,
  token: undefined
};

export default function messaging(state = initialState, {payload, type}) {
  switch (type) {

    case types.PERMISSION_CHANGED:
    case types.TOKEN_CHANGED:
    case types.MESSAGING_ERROR:
    case types.ON_MESSAGE:
    return {...state, ...payload};

    default:
    return state;
  }
}

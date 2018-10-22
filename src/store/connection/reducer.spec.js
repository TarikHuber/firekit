import expect from 'expect'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {
  isConnected: true
}

describe('connection reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(reducer(initialState, { type: 'NOT_EXISTING' })).toEqual(initialState)
  })

  it('should handle onConnectionStateChange', () => {
    expect(reducer(initialState, actions.onConnectionStateChange(true))).toEqual({ ...initialState, isConnected: true })
  })
})

import expect from 'expect'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {}

describe('locale reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(reducer(initialState, { type: 'NOT_EXISTING' })).toEqual(initialState)
  })

  it('should handle authStateChanged', () => {
    expect(reducer(initialState, actions.authStateChanged({ displayName: 'test' }))).toEqual({
      ...initialState,
      ...{ displayName: 'test' }
    })
  })

  it('should handle authError', () => {
    expect(reducer(initialState, actions.authError({ message: 'test' }))).toEqual({
      ...initialState,
      ...{ error: { message: 'test' } }
    })
  })
})

import expect from 'expect'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {
}

describe('initialization reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(
      reducer(initialState, { type: 'NOT_EXISTING' })
    ).toEqual(initialState)
  })

  it('should handle clearInitialization', () => {
    expect(
      reducer(initialState, actions.clearInitialization())
    ).toEqual({})
  })

})

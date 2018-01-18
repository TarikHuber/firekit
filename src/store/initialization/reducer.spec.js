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

  it('should unwatch', () => {
    expect(
      reducer({ 'foo': 'foo', 'bar': 'bar' }, { type: '@@firekit/LISTS@UNWATCH', path: 'foo' })
    ).toEqual({ 'bar': 'bar' })
  })

  it('should initisalize', () => {
    expect(
      reducer({}, { type: '@@firekit/LISTS@APPEND_INIIALIZE', path: 'foo' })
    ).toEqual({})
  })

  it('should handle clearInitialization', () => {
    expect(
      reducer(initialState, actions.clearInitialization())
    ).toEqual({})
  })
})

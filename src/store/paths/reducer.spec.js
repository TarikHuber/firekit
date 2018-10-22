import expect from 'expect'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {}

describe('paths reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(reducer(initialState, { type: 'NOT_EXISTING' })).toEqual(initialState)
  })

  it('should handle valueChanged', () => {
    expect(reducer(initialState, actions.valueChanged('test', 'test_location', 'test_path'))).toEqual({
      ...initialState,
      test_location: 'test'
    })
  })

  it('should handle destroy', () => {
    const initState = {
      test_location: 'test'
    }

    expect(reducer(initState, actions.destroy('test_location'))).toEqual({})
  })

  it('should handle unWatch', () => {
    const initState = {
      test_location: 'test'
    }

    expect(reducer(initState, actions.unWatch('test_location'))).toEqual({
      ...initState
    })
  })
})

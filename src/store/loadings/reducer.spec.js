import expect from 'expect'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {}

describe('loadings reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(reducer(initialState, { type: 'NOT_EXISTING' })).toEqual(initialState)
  })

  it('should handle logLoading', () => {
    expect(reducer(initialState, actions.logLoading('testPath', true))).toEqual({
      testPath: true
    })
  })

  it('should handle clearLoading', () => {
    expect(
      reducer(
        {
          testPath: true
        },
        actions.clearLoading('testPath')
      )
    ).toEqual({})
  })

  it('should handle clearAllLoadings', () => {
    expect(
      reducer(
        {
          testPath: true,
          testPath2: true
        },
        actions.clearAllLoadings()
      )
    ).toEqual({})
  })
})

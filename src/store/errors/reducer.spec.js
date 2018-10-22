import expect from 'expect'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {}

describe('errors reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(reducer(initialState, { type: 'NOT_EXISTING' })).toEqual(initialState)
  })

  it('should handle logError', () => {
    expect(
      reducer(initialState, actions.logError('testPath', { errorId: 'id', erroMessage: 'error message' }))
    ).toEqual({
      testPath: { errorId: 'id', erroMessage: 'error message' }
    })
  })

  it('should handle clearError', () => {
    expect(
      reducer(
        {
          testPath: { errorId: 'id', erroMessage: 'error message' }
        },
        actions.clearError('testPath')
      )
    ).toEqual({})
  })

  it('should handle clearAllErrors', () => {
    expect(
      reducer(
        {
          testPath: { errorId: 'id', erroMessage: 'error message' },
          testPath2: { errorId: 'id2', erroMessage: 'error message 2' }
        },
        actions.clearAllErrors()
      )
    ).toEqual({})
  })
})

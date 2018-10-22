import expect from 'expect'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {
  hasPermission: false,
  token: undefined
}

describe('messaging reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(reducer(initialState, { type: 'NOT_EXISTING' })).toEqual(initialState)
  })

  it('should handle onTokenChanged', () => {
    expect(reducer(initialState, actions.onTokenChanged('testToken'))).toEqual({
      ...initialState,
      isInitialized: true,
      token: 'testToken'
    })
  })

  it('should handle onMessage', () => {
    expect(reducer(initialState, actions.onMessage('testMessage'))).toEqual({
      ...initialState,
      token: undefined,
      message: 'testMessage'
    })
  })
  it('should handle clearMessage', () => {
    expect(
      reducer(
        {
          hasPermission: true,
          token: 'test',
          message: 'test'
        },
        actions.clearMessage()
      )
    ).toEqual({
      hasPermission: true,
      token: 'test'
    })
  })

  it('should handle onMessagingError', () => {
    expect(reducer(initialState, actions.onMessagingError('testError'))).toEqual({
      ...initialState,
      hasPermission: false,
      error: 'testError',
      token: undefined
    })
  })
})

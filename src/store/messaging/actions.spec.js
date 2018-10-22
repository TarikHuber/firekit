import expect from 'expect'
import firebasemock from 'firebase-mock'
import * as actions from './actions'
import * as types from './types'

const firebaseApp = {
  messaging: () => {
    return {
      requestPermission: () => {
        return {
          then: () => {
            return {
              then: () => {
                return {}
              }
            }
          }
        }
      },
      onMessage: () => {
        return null
      },
      getToken: () => {
        return {}
      }
    }
  }
}

describe('messaging actions', () => {
  it('onPermissionChanged should return proper type', () => {
    expect(actions.onPermissionChanged(true)).toEqual({
      type: types.PERMISSION_CHANGED,
      payload: { hasPermission: true, isInitialized: true }
    })
  })

  it('initMessaging should return a function', () => {
    expect(actions.initMessaging(firebaseApp)).toBeA('function')
  })
})

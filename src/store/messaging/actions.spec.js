import expect from 'expect'
import firebasemock from 'firebase-mock'
import * as actions from './actions'
import * as types from './types'

let mockauth = new firebasemock.MockFirebase()
let mocksdk = new firebasemock.MockFirebaseSdk(path => {
  return path ? mockauth : mockauth
}, () => {
  return mockauth
})

let firebase = mocksdk.initializeApp()

describe('messaging actions', () => {
  it('onPermissionChanged should return proper type', () => {
    expect(
      actions.onPermissionChanged(true)
    ).toEqual({ type: types.PERMISSION_CHANGED, payload: { hasPermission: true, isInitialized: true } })
  })
})

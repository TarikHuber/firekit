import expect from 'expect'
import firebasemock from 'firebase-mock'
import * as actions from './actions'

let mockauth = new firebasemock.MockFirebase()
let mocksdk = new firebasemock.MockFirebaseSdk(
  path => {
    return path ? mockauth : mockauth
  },
  () => {
    return mockauth
  }
)

let firebase = mocksdk.initializeApp()

function onAuthStateChanged(user) {
  return user
}

describe('auth actions', () => {
  it('defaultUserData should return not authorised', () => {
    expect(actions.defaultUserData(null)).toEqual({ isAuthorised: false })
  })

  it('defaultUserData should return user', () => {
    expect(
      actions.defaultUserData({
        displayName: 'foo',
        email: 'foo',
        photoURL: 'foo',
        emailVerified: 'foo',
        isAnonymous: 'foo',
        uid: 'foo',
        providerData: 'foo',
        isAuthorised: true
      })
    ).toEqual({
      displayName: 'foo',
      email: 'foo',
      photoURL: 'foo',
      emailVerified: 'foo',
      isAnonymous: 'foo',
      uid: 'foo',
      providerData: 'foo',
      isAuthorised: true
    })
  })

  it('watchAuth should call dispatch', () => {
    const dispatch = expect.createSpy()

    actions.watchAuth(firebase)(dispatch)

    let ref = firebase.auth()

    ref.changeAuthState({
      uid: 'theUid',
      provider: 'github',
      token: 'theToken',
      expires: Math.floor(new Date() / 1000) + 24 * 60 * 60, // expire in 24 hours
      auth: {
        myAuthProperty: true
      }
    })

    ref.flush()

    expect(dispatch.calls.length).toEqual(1)
  })

  it('watchAuth with onAuthStateChanged should call dispatch', () => {
    const dispatch = expect.createSpy()

    function test(user) {
      return user
    }

    actions.watchAuth(firebase, onAuthStateChanged)(dispatch)

    let ref = firebase.auth()

    ref.changeAuthState(null)

    ref.flush()

    expect(dispatch.calls.length).toEqual(1)
  })

  it('watchAuth should call dispatch', () => {
    const dispatch = expect.createSpy()

    actions.watchAuth(firebase)(dispatch)

    let ref = firebase.auth()
    var error = new Error()
    function onValue(snapshot) {}
    function onCancel(_err_) {
      err = _err_
    }

    ref.changeAuthState({
      uid: 'theUid',
      provider: 'github',
      token: 'theToken',
      expires: Math.floor(new Date() / 1000) + 24 * 60 * 60, // expire in 24 hours
      auth: {
        myAuthProperty: true
      }
    })

    ref.flush()
    ref.forceCancel(error, 'value', onValue)
    expect(dispatch.calls.length).toEqual(1)
  })
})

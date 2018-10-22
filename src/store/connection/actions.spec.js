import expect from 'expect'
import firebasemock from 'firebase-mock'
import * as actions from './actions'
import * as types from './types'

let mockdatabase = new firebasemock.MockFirebase()
let mockauth = new firebasemock.MockFirebase()
let mocksdk = new firebasemock.MockFirebaseSdk(
  path => {
    return path ? mockdatabase.child(path) : mockdatabase
  },
  () => {
    return mockauth
  }
)

let firebase = mocksdk.initializeApp()

describe('connection actions', () => {
  it('initConnection should return a function', () => {
    expect(actions.initConnection(firebase)).toBeA('function')
  })

  it('unsubscribeConnection should return a function', () => {
    expect(actions.unsubscribeConnection(firebase)).toBeA('function')
  })

  it('initConnection should call dispatch with proper payload', () => {
    const getState = () => ({})
    const dispatch = expect.createSpy()

    let ref = firebase.database().ref('path')
    var snapshot
    function onValue(_snapshot_) {
      snapshot = _snapshot_
    }
    ref.on('value', onValue)
    ref.set({
      path: 'bar'
    })
    actions.initConnection(firebase)(dispatch)
    ref.flush()

    expect(dispatch).toHaveBeenCalled()
  })

  it('unsubscribeConnection should call dispatch with proper payload', () => {
    const getState = () => ({})
    const dispatch = expect.createSpy()

    let ref = firebase.database().ref('path')
    var snapshot
    function onValue(_snapshot_) {
      snapshot = _snapshot_
    }
    ref.on('value', onValue)
    ref.set({
      path: 'bar'
    })
    actions.unsubscribeConnection(firebase)(dispatch)
    ref.flush()

    expect(dispatch).toHaveBeenCalled()
  })

  it('initConnection should log error', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    actions.initConnection(firebase)(dispatch)
    let ref = firebase.database().ref('.info/connected')
    var error = new Error('Oh no!')
    ref.failNext('on', error)
    ref.forceCancel(error, 'value')
    ref.flush()

    expect(dispatch).toHaveBeenCalled()
  })
})

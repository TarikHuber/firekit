import expect from 'expect'
import * as actions from './actions'

const firebasemock = require('firebase-mock')

const mockdatabase = new firebasemock.MockFirebase()
const mockauth = new firebasemock.MockFirebase()
const mocksdk = new firebasemock.MockFirebaseSdk(path => {
  return path ? mockdatabase.child(path) : mockdatabase
}, () => {
  return mockauth
})

const firebase = mocksdk.initializeApp()

describe('paths actions', () => {
  it('should return a function', () => {
      expect(
            actions.watchPath(firebase, 'path', 'path2')
        ).toBeA('function')
    })

  it('should dispatch the function', () => {
      const getState = () => ({ users: 'foo' })
      const dispatch = expect.createSpy()

      actions.watchPath(firebase, 'path', 'path2')(dispatch, getState)

      expect(
            dispatch
        ).toHaveBeenCalled()
    })

  it('should dispatch the function with proper type and payload', () => {
      const getState = () => ({ users: 'foo' })
      const dispatch = expect.createSpy()

      actions.watchPath(firebase, 'path')(dispatch, getState)

      expect(
            dispatch
        ).toHaveBeenCalledWith({ type: '@@firekit/LOADING@LOG_LOADING', location: 'path' })
    })

  it('should dispatch the function', () => {
      const getState = () => ({ users: 'foo' })
      const dispatch = expect.createSpy()

      actions.watchPath(firebase, 'path')(dispatch, getState)

      expect(
            dispatch.calls.length
        ).toEqual(1)
    })
})

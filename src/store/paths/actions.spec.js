import expect from 'expect'
import firebasemock from 'firebase-mock'
import * as actions from './actions'

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

describe('paths actions', () => {
  it('watchPath should return a function', () => {
    expect(actions.watchPath(firebase, 'path', 'path2')).toBeA('function')
  })

  it('unwatchPath should return a function', () => {
    expect(actions.unwatchPath(firebase, 'path')).toBeA('function')
  })

  it('destroyPath should return a function', () => {
    expect(actions.destroyPath(firebase, 'path')).toBeA('function')
  })

  it('unwatchAllPaths should return a function', () => {
    expect(actions.unwatchAllPaths(firebase, 'path')).toBeA('function')
  })

  it('watchPath should call dispatch with proper payload', () => {
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
    actions.watchPath(firebase, 'path')(dispatch, getState)
    ref.flush()

    expect(dispatch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith({ type: '@@firekit/LOADING@LOG_LOADING', location: 'path' })
    // .toHaveBeenCalledWith({ type: '@@firekit/PATHS@VALUE_CHANGED', location: 'path', payload: 'bar', locationValue: true })
  })

  it('watchPath should call dispatch 2 times', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    actions.watchPath(firebase, 'path', 'path2')(dispatch, getState)

    let ref = firebase.database().ref('path')

    var snapshot
    function onValue(_snapshot_) {
      snapshot = _snapshot_
    }
    ref.on('value', onValue)
    ref.set({
      path: 'bar'
    })
    ref.flush()

    expect(dispatch.calls.length).toEqual(2)
  })

  it('watchPath should call dispatch 2 times', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    let ref = firebase.database().ref('path')
    var error = new Error('Oh no!')
    ref.failNext('on', error)
    actions.watchPath(firebase, 'path', 'path2')(dispatch, getState)
    ref.flush()

    expect(dispatch.calls.length).toEqual(2)
  })

  it('unwatchPath should call dispatch with proper payload', () => {
    const getState = () => ({ path: 'foo' })
    const dispatch = expect.createSpy()

    actions.unwatchPath(firebase, 'path')(dispatch, getState)

    expect(dispatch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith({ type: '@@firekit/PATHS@UNWATCH', path: 'path' })
  })

  it('destroyPath should call dispatch with proper payload', () => {
    const getState = () => ({ path: 'foo' })
    const dispatch = expect.createSpy()

    actions.destroyPath(firebase, 'path')(dispatch, getState)

    expect(dispatch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith({ type: '@@firekit/PATHS@UNWATCH', path: 'path' })
      .toHaveBeenCalledWith({ type: '@@firekit/PATHS@DESTROY', location: 'path' })
  })

  it('unwatchAllPaths should call dispatch with proper payload', () => {
    const getState = () => ({ paths: { path1: 'path1', path2: 'path2' } })
    const dispatch = expect.createSpy()

    actions.unwatchAllPaths(firebase, 'path')(dispatch, getState)

    expect(dispatch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith({ type: '@@firekit/PATHS@UNWATCH', path: 'path1' })
      .toHaveBeenCalledWith({ type: '@@firekit/PATHS@UNWATCH', path: 'path2' })
  })

  it('unwatchAllPaths should call dispatch 2 time', () => {
    const getState = () => ({ paths: { path1: 'path1', path2: 'path2' } })
    const dispatch = expect.createSpy()

    actions.unwatchAllPaths(firebase, 'path')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(2)
  })
})

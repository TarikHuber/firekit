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

describe('lists actions', () => {
  it('watchList should return a function', () => {
    expect(actions.watchList(firebase, 'path', 'path2')).toBeA('function')
  })

  it('unwatchList should return a function', () => {
    expect(actions.unwatchList(firebase, 'path')).toBeA('function')
  })

  it('destroyList should return a function', () => {
    expect(actions.destroyList(firebase, 'path')).toBeA('function')
  })

  it('destroyAllLists should return a function', () => {
    expect(actions.destroyAllLists(firebase, 'path')).toBeA('function')
  })

  it('unwatchAllLists should return a function', () => {
    expect(actions.unwatchAllLists(firebase, 'path')).toBeA('function')
  })

  it('getLocation should return string', () => {
    expect(actions.getLocation(firebase, 'path')).toEqual('path')
  })

  it('getLocation should return object', () => {
    expect(
      actions.getLocation(firebase, {
        toString: () => {
          return 'Mock://path2'
        }
      })
    ).toEqual('path2')
  })

  it('getRef should return string', () => {
    expect(actions.getRef(firebase, 'path')).toEqual(firebase.database().ref('path'))
  })

  it('getRef should return object', () => {
    expect(actions.getRef(firebase, {})).toEqual({})
  })

  it('watchList should call dispatch with proper payload', () => {
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
    actions.watchList(firebase, 'path')(dispatch, getState)
    ref.flush()

    expect(dispatch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith({ type: '@@firekit/LOADING@LOG_LOADING', location: 'path' })
    // .toHaveBeenCalledWith({ type: '@@firekit/PATHS@VALUE_CHANGED', location: 'path', payload: 'bar', locationValue: true })
  })

  it('watchList should call dispatch 5 times', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    actions.watchList(firebase, 'path', 'path2')(dispatch, getState)

    let ref = firebase.database().ref('path')

    var snapshot
    function onValue(_snapshot_) {
      snapshot = _snapshot_
    }
    ref.on('value', onValue)
    ref.set({
      path: 'bar'
    })
    ref.push({
      path: 'bar'
    })

    ref.flush()

    expect(dispatch.calls.length).toEqual(5)
  })

  it('watchList should call dispatch 7 times', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    actions.watchList(firebase, 'path', 'path2')(dispatch, getState)

    let ref = firebase.database().ref('path')

    var snapshot
    function onValue(_snapshot_) {
      snapshot = _snapshot_
    }
    ref.on('value', onValue)
    ref.set({
      path: 'bar'
    })
    ref.fakeEvent('child_removed', 'bar', null)
    ref.flush()

    expect(dispatch.calls.length).toEqual(7)
  })

  it('watchList should call dispatch 5 times', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    actions.watchList(firebase, 'path', 'path2')(dispatch, getState)

    let ref = firebase.database().ref('path')

    var snapshot
    function onValue(_snapshot_) {
      snapshot = _snapshot_
    }
    ref.on('value', onValue)
    ref.set({
      path: 'bar'
    })
    ref.fakeEvent('child_changed', 'bar', null)
    ref.flush()

    expect(dispatch.calls.length).toEqual(5)
  })

  it('watchList should call dispatch 4 times', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    let ref = firebase.database().ref('path')
    var error = new Error('Oh no!')
    ref.failNext('on', error)
    ref.failNext('once', error)
    actions.watchList(firebase, 'path', 'path2')(dispatch, getState)
    ref.flush()

    expect(dispatch.calls.length).toEqual(4)
  })

  it('watchList should call dispatch 5 times', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    actions.watchList(firebase, 'path', 'path2')(dispatch, getState)

    let ref = firebase.database().ref('path')
    var error = new Error('Oh no!')

    ref.failNext('on', error)
    ref.failNext('child_changed', error)
    ref.fakeEvent('child_changed', 'bar', null)
    ref.forceCancel(error, 'child_changed')
    ref.flush()

    expect(dispatch.calls.length).toEqual(5)
  })

  it('watchList should call dispatch 5 times', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    actions.watchList(firebase, 'path', 'path2')(dispatch, getState)
    let ref = firebase.database().ref('path')
    var error = new Error('Oh no!')

    ref.failNext('on', error)
    ref.failNext('child_removed', error)
    ref.fakeEvent('child_removed', 'bar', null)
    ref.forceCancel(error, 'child_removed')
    ref.flush()

    expect(dispatch.calls.length).toEqual(5)
  })

  it('watchList should call dispatch 5 times', () => {
    const getState = () => ({ users: 'foo' })
    const dispatch = expect.createSpy()

    let ref = firebase.database().ref('path')
    var error = new Error('Oh no!')

    ref.failNext('child_changed', error)
    ref.fakeEvent('child_changed', 'bar', null)
    actions.watchList(firebase, 'path', 'path2')(dispatch, getState)
    ref.flush()

    expect(dispatch.calls.length).toEqual(5)
  })

  it('unwatchList should call dispatch ', () => {
    const getState = () => ({ path: 'foo' })
    const dispatch = expect.createSpy()

    actions.unwatchList(firebase, 'path')(dispatch, getState)

    expect(dispatch).toHaveBeenCalled()
  })

  it('destroyList should call dispatch ', () => {
    const getState = () => ({ initialization: { path: 'foo' } })
    const dispatch = expect.createSpy()

    actions.destroyList(firebase, 'path', 'path2')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(2)
  })

  it('destroyList should call dispatch ', () => {
    const getState = () => ({ initialization: { 'Mock://path': { foo: true, bar: true } } })
    const dispatch = expect.createSpy()

    let ref = firebase.database().ref('path')
    actions.destroyList(firebase, 'path')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(3)
  })

  it('destroyList should call dispatch 2times ', () => {
    const getState = () => ({ initialization: { foo: 'foo' } })
    const dispatch = expect.createSpy()

    actions.destroyList(firebase, 'path', 'path2')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(2)
  })

  it('unwatchAllLists should call dispatch 2 times', () => {
    const getState = () => ({ lists: { path1: 'path1', path2: 'path2' } })
    const dispatch = expect.createSpy()

    actions.unwatchAllLists(firebase, 'path')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(2)
  })

  it('destroyAllLists should call dispatch 3 times', () => {
    const getState = () => ({ lists: { path1: 'path1', path2: 'path2' } })
    const dispatch = expect.createSpy()

    actions.destroyAllLists(firebase, 'path')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(2)
  })
})

import expect from 'expect'
import firebasemock from 'firebase-mock'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {}

let mockfirestore = new firebasemock.MockFirestore()
let mockauth = new firebasemock.MockFirebase()
let mocksdk = new firebasemock.MockFirebaseSdk(
  path => {
    return path ? mockfirestore.child(path) : mockfirestore
  },
  () => {
    return mockauth
  }
)

let firebase = mocksdk.initializeApp()

describe('collections reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(reducer(initialState, { type: 'NOT_EXISTING' })).toEqual(initialState)
  })

  it('should handle initialize', () => {
    expect(reducer(initialState, actions.initialize([1, 2, 3], 'test_location', 'test_path', 'unsub', false))).toEqual({
      ...initialState,
      test_location: [1, 2, 3]
    })
  })

  it('should handle initialize with append', () => {
    const initState = {
      test_location: [1]
    }

    expect(reducer(initState, actions.initialize([2, 3], 'test_location', 'test_path', 'unsub', true))).toEqual({
      ...initState,
      test_location: [1, 2, 3]
    })
  })

  it('should handle childAdded', () => {
    const initState = {
      test_location: [{ id: 1 }]
    }

    expect(reducer(initState, actions.childAdded({ id: 2 }, 'test_location'))).toEqual({
      ...initState,
      test_location: [{ id: 1 }, { id: 2 }]
    })
  })

  it('should handle childAdded and not add duplicates', () => {
    const initState = {
      test_location: [{ id: 1 }]
    }

    expect(reducer(initState, actions.childAdded({ id: 1 }, 'test_location'))).toEqual({
      ...initState,
      test_location: [{ id: 1 }]
    })
  })

  it('should handle childChanged', () => {
    const initState = {
      test_location: [{ id: 1, data: 'test' }]
    }

    expect(reducer(initState, actions.childChanged({ id: 1, data: 'test2' }, 'test_location'))).toEqual({
      ...initState,
      test_location: [{ id: 1, data: 'test2' }]
    })
  })

  it('should handle childRemoved', () => {
    const initState = {
      test_location: [{ id: 1, data: 'test' }]
    }

    expect(reducer(initState, actions.childRemoved({ id: 1, data: 'test2' }, 'test_location'))).toEqual({
      ...initState,
      test_location: []
    })
  })

  it('should handle destroy', () => {
    const initState = {
      test_location: [{ id: 1, data: 'test' }]
    }

    expect(reducer(initState, actions.destroy('test_location'))).toEqual({})
  })

  it('should handle unWatch', () => {
    const initState = {
      test_location: [{ id: 1, data: 'test' }]
    }

    expect(reducer(initState, actions.unWatch('test_location'))).toEqual({
      ...initState
    })
  })

  it('getLocation should return string', () => {
    expect(actions.getLocation(firebase, 'path')).toEqual('path')
  })

  it('getLocation should return object', () => {
    expect(
      actions.getLocation(
        {
          firestore: () => {
            return {
              doc: path => {
                return {
                  path: path
                }
              }
            }
          }
        },
        {
          _query: {
            path: {
              segments: ['123', '456']
            }
          }
        }
      )
    ).toEqual('123/456')
  })

  it('getRef should return object', () => {
    expect(actions.getRef(firebase, {})).toEqual({})
  })

  it('destroyCol should call dispatch with proper payload', () => {
    const getState = () => ({ initialization: 'path2' })
    const dispatch = expect.createSpy()

    actions.destroyCol(firebase, 'path', 'path2')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(3)
  })

  it('unwatchAllCol should call dispatch 2 time', () => {
    const getState = () => ({ collections: { path1: 'path1', path2: 'path2' } })
    const dispatch = expect.createSpy()

    actions.unwatchAllCol(firebase)(dispatch, getState)

    expect(dispatch.calls.length).toEqual(2)
  })

  it('unwatchCol should call dispatch with proper payload', () => {
    const getState = () => ({ initialization: { path: { path: true } } })
    const dispatch = expect.createSpy()

    actions.unwatchCol(firebase, 'path')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(1)
  })

  it('unwatchCol should call dispatch with proper payload', () => {
    const unsub = expect.createSpy()
    const getState = () => ({ initialization: { path: { path: unsub } } })
    const dispatch = expect.createSpy()

    actions.unwatchCol(firebase, 'path')(dispatch, getState)

    expect(unsub.calls.length).toEqual(1)
  })
})

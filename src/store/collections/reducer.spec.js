import expect from 'expect'
import firebasemock from 'firebase-mock'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {

}

let mockfirestore = new firebasemock.MockFirestore()
let mockauth = new firebasemock.MockFirebase()
let mocksdk = new firebasemock.MockFirebaseSdk(path => {
  return path ? mockfirestore.child(path) : mockfirestore
}, () => {
  return mockauth
})

let firebase = mocksdk.initializeApp()

describe('collections reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(
      reducer(initialState, { type: 'NOT_EXISTING' })
    ).toEqual(initialState)
  })

  it('should handle initialize', () => {
    expect(
      reducer(initialState, actions.initialize(
        [1, 2, 3],
        'test_location',
        'test_path',
        'unsub',
        false
      ))
    ).toEqual({
      ...initialState,
      test_location: [1, 2, 3]
    })
  })

  it('should handle initialize with append', () => {
    const initState = {
      test_location: [1]
    }

    expect(
      reducer(initState, actions.initialize(
        [2, 3],
        'test_location',
        'test_path',
        'unsub',
        true
      ))
    ).toEqual({
      ...initState,
      test_location: [1, 2, 3]
    })
  })

  it('should handle childAdded', () => {
    const initState = {
      test_location: [1]
    }

    expect(
      reducer(initState, actions.childAdded(
        2,
        'test_location'
      ))
    ).toEqual({
      ...initState,
      test_location: [1, 2]
    })
  })

  it('should handle childChanged', () => {
    const initState = {
      test_location: [{ id: 1, data: 'test' }]
    }

    expect(
      reducer(initState, actions.childChanged(
        { id: 1, data: 'test2' },
        'test_location'
      ))
    ).toEqual({
      ...initState,
      test_location: [{ id: 1, data: 'test2' }]
    })
  })

  it('should handle childRemoved', () => {
    const initState = {
      test_location: [{ id: 1, data: 'test' }]
    }

    expect(
      reducer(initState, actions.childRemoved(
        { id: 1, data: 'test2' },
        'test_location'
      ))
    ).toEqual({
      ...initState,
      test_location: []
    })
  })

  it('should handle destroy', () => {
    const initState = {
      test_location: [{ id: 1, data: 'test' }]
    }

    expect(
      reducer(initState, actions.destroy(
        'test_location'
      ))
    ).toEqual({
    })
  })

  it('should handle unWatch', () => {
    const initState = {
      test_location: [{ id: 1, data: 'test' }]
    }

    expect(
      reducer(initState, actions.unWatch(
        'test_location'
      ))
    ).toEqual({
      ...initState
    })
  })

  it('getLocation should return string', () => {
    expect(
      actions.getLocation(firebase, 'path')
    ).toEqual('path')
  })

  it('getLocation should return object', () => {
    expect(
      actions.getLocation({
        firestore: () => {
          return {
            doc: (path) => {
              return {
                path: path
              }
            }
          }
        }
      }, {
          '_query': {
            path: {
              segments: [
                '123',
                '456'
              ]
            }
          }

        })
    ).toEqual('123/456')
  })

  it('getRef should return object', () => {
    expect(
      actions.getRef(firebase, {})
    ).toEqual({})
  })
})

import expect from 'expect'
import firebasemock from 'firebase-mock'
import * as actions from './actions'

let mockfirestore = new firebasemock.MockFirestore()
let mockauth = new firebasemock.MockFirebase()
let mocksdk = new firebasemock.MockFirebaseSdk(path => {
  return path ? mockfirestore.child(path) : mockfirestore
}, () => {
  return mockauth
})

let firebase = mocksdk.initializeApp()

describe('collections actions', () => {

  it('watchCol should return a function', () => {
    expect(
      actions.watchCol(firebase, 'path', 'path2')
    ).toBeA('function')
  })


  it('destroyCol should call dispatch 7 time', () => {
    const getState = () => ({ initialization: { 'path1': 'path1', 'path2': 'path2' } })
    const dispatch = expect.createSpy()

    actions.destroyCol(firebase, 'path1')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(7)
  })

  it('unwatchAllCols should call dispatch 2 time', () => {
    const getState = () => ({ collections: { 'path1': 'path1', 'path2': 'path2' } })
    const dispatch = expect.createSpy()

    actions.unwatchAllCols(firebase)(dispatch, getState)

    expect(dispatch.calls.length).toEqual(2)
  })

  it('getRef should return path string', () => {
    expect(actions.getRef({
      firestore: () => {
        return {
          collection: (path) => {
            return path
          }
        }
      }
    }, 'path')).toEqual(
      'path'
      )
  })
})

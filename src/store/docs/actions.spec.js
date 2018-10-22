import expect from 'expect'
import firebasemock from 'firebase-mock'
import * as actions from './actions'

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

describe('docs actions', () => {
  it('watchDoc should return a function', () => {
    expect(actions.watchDoc(firebase, 'path', 'path2')).toBeA('function')
  })

  it('unwatchDoc should return a function', () => {
    expect(actions.unwatchDoc(firebase, 'path')).toBeA('function')
  })

  it('destroyDoc should return a function', () => {
    expect(actions.destroyDoc(firebase, 'path')).toBeA('function')
  })

  it('unwatchAllDocs should return a function', () => {
    expect(actions.unwatchAllDocs(firebase, 'path')).toBeA('function')
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
        {}
      )
    ).toEqual({})
  })

  it('getRef should return object', () => {
    expect(actions.getRef(firebase, {})).toEqual({})
  })

  it('destroyDoc should call dispatch with proper payload', () => {
    const getState = () => ({ path: 'foo' })
    const dispatch = expect.createSpy()

    actions.destroyDoc(firebase, 'path')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(2)
  })

  it('unwatchAllDocs should call dispatch 2 time', () => {
    const getState = () => ({ docs: { path1: 'path1', path2: 'path2' } })
    const dispatch = expect.createSpy()

    actions.unwatchAllDocs(firebase)(dispatch, getState)

    expect(dispatch.calls.length).toEqual(2)
  })

  it('unwatchDoc should call dispatch with proper payload', () => {
    const getState = () => ({ initialization: { path: { path: true } } })
    const dispatch = expect.createSpy()

    actions.unwatchDoc(firebase, 'path')(dispatch, getState)

    expect(dispatch.calls.length).toEqual(1)
  })

  it('unwatchDoc should call dispatch with proper payload', () => {
    const unsub = expect.createSpy()
    const getState = () => ({ initialization: { path: { path: unsub } } })
    const dispatch = expect.createSpy()

    actions.unwatchDoc(firebase, 'path')(dispatch, getState)

    expect(unsub.calls.length).toEqual(1)
  })
})

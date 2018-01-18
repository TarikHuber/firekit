import expect from 'expect'
import firebasemock from 'firebase-mock'
import * as actions from './actions'

let mockdatabase = new firebasemock.MockFirebase()
let mockauth = new firebasemock.MockFirebase()
let mocksdk = new firebasemock.MockFirebaseSdk(path => {
    return path ? mockdatabase.child(path) : mockdatabase
}, () => {
    return mockauth
})

let firebase = mocksdk.initializeApp()

describe('watchPath should be a function', () => {
    it('should return a function', () => {
        expect(
            actions.watchPath(firebase, 'path', 'path2')
        ).toBeA('function')
    })

    it('watchPath should call dispatch with proper payload', () => {
        const getState = () => ({ users: 'foo' })
        const dispatch = expect.createSpy()

        actions.watchPath(firebase, 'path')(dispatch, getState)

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

        expect(dispatch.calls.length)
            .toEqual(2)
    })

    it('watchPath should call dispatch 3 times', () => {
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
        var error = new Error('Oh no!')
        ref.failNext('value', error)
        var err
        ref.set('data', function onComplete(_err_) {
            err = _err_
        })
        ref.flush()

        expect(dispatch.calls.length)
            .toEqual(3)
    })
})

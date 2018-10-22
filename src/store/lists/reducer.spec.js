import expect from 'expect'
import reducer from './reducer'
import * as actions from './actions'

const initialState = {}

describe('lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should not affect state', () => {
    expect(reducer(initialState, { type: 'NOT_EXISTING', location: 'test' })).toEqual(initialState)
  })

  it('should handle initialize', () => {
    expect(reducer(initialState, actions.initialize([1, 2, 3], 'test_location', 'test_path', false))).toEqual({
      ...initialState,
      test_location: [1, 2, 3]
    })
  })

  it('should handle initialize with append', () => {
    const initState = {
      test_location: [1]
    }

    expect(reducer(initState, actions.initialize([2, 3], 'test_location', 'test_path', true))).toEqual({
      ...initState,
      test_location: [1, 2, 3]
    })
  })

  it('should handle childAdded', () => {
    const initState = {
      test_location: [{ key: 1 }]
    }

    expect(reducer(initState, actions.childAdded({ key: 2 }, 'test_location'))).toEqual({
      ...initState,
      test_location: [{ key: 1 }, { key: 2 }]
    })
  })

  it('should handle childAdded and not add duplicates', () => {
    const initState = {
      test_location: [{ key: 1 }]
    }

    expect(reducer(initState, actions.childAdded({ key: 1 }, 'test_location'))).toEqual({
      ...initState,
      test_location: [{ key: 1 }]
    })
  })

  it('should handle childChanged', () => {
    const initState = {
      test_location: [{ key: 1, val: 'test' }]
    }

    expect(reducer(initState, actions.childChanged({ key: 1, val: 'test2' }, 'test_location'))).toEqual({
      ...initState,
      test_location: [{ key: 1, val: 'test2' }]
    })
  })

  it('should handle childRemoved', () => {
    const initState = {
      test_location: [{ key: 1, val: 'test' }]
    }

    expect(reducer(initState, actions.childRemoved({ key: 1, val: 'test2' }, 'test_location'))).toEqual({
      ...initState,
      test_location: []
    })
  })

  it('should handle destroy', () => {
    const initState = {
      test_location: [{ key: 1, val: 'test' }]
    }

    expect(reducer(initState, actions.destroy('test_location'))).toEqual({})
  })

  it('should handle unWatch', () => {
    const initState = {
      test_location: [{ key: 1, val: 'test' }]
    }

    expect(reducer(initState, actions.unWatch('test_location'))).toEqual({
      ...initState
    })
  })
})

import expect from 'expect'
import * as selectors from './selectors'

describe('lists selectors', () => {
  it('should return all lists', () => {
    expect(selectors.getAllLists({ lists: 'test' })).toEqual('test')
  })

  it('should return a empty list', () => {
    expect(selectors.getList({ lists: 'test' }, 'test2')).toEqual([])
  })

  it('should return the right list', () => {
    expect(selectors.getList({ lists: { test: [1, 2, 3], test2: [1, 2, 3, 4] } }, 'test')).toEqual([1, 2, 3])
  })
})

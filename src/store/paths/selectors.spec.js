import expect from 'expect'
import * as selectors from './selectors'

describe('paths selectors', () => {
  it('should return all paths', () => {
    expect(selectors.getAllPaths({ paths: 'test' })).toEqual('test')
  })

  it('should return a empty path', () => {
    expect(selectors.getPath({ paths: 'test' }, 'test2')).toEqual({})
  })

  it('should return the right path', () => {
    expect(selectors.getPath({ paths: { test: [1, 2, 3], test2: [1, 2, 3, 4] } }, 'test')).toEqual([1, 2, 3])
  })
})

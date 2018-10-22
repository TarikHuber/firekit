import expect from 'expect'
import * as selectors from './selectors'

describe('docs selectors', () => {
  it('getAllDocs should return all docs', () => {
    expect(selectors.getAllDocs({ docs: 'test' })).toEqual('test')
  })

  it('getAllInitializations should return a empty path', () => {
    expect(selectors.getAllInitializations({ docs: 'test' }, 'test2')).toEqual(null)
  })

  it('getDoc should return the right path', () => {
    expect(selectors.getDoc({ docs: { test: [1, 2, 3], test2: [1, 2, 3, 4] } }, 'test')).toEqual([1, 2, 3])
  })

  it('getDoc should return the right path', () => {
    expect(selectors.getDoc({ docs: { test: [1, 2, 3], test2: [1, 2, 3, 4] } }, 'test3')).toEqual(null)
  })
})

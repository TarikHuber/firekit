import expect from 'expect'
import * as selectors from './selectors'

describe('lists selectors', () => {
  it('should false', () => {
    expect(selectors.isInitialised({ initialization: {} }, 'path', 'location')).toEqual(false)
  })

  it('should return true', () => {
    expect(selectors.isInitialised({ initialization: { path: { location: true } } }, 'path', 'location')).toEqual(true)
  })

  it('should return false', () => {
    expect(selectors.isInitialised({ initialization: { path: 'location' } }, 'path2', 'location')).toEqual(false)
  })
})

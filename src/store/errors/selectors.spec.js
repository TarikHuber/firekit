import expect from 'expect'
import * as selectors from './selectors'

describe('errors selectors', () => {
  it('should false', () => {
    expect(selectors.hasError({ errors: {} }, 'location')).toEqual(false)
  })

  it('should return error', () => {
    expect(selectors.hasError({ errors: { location: 'error' } }, 'location')).toEqual('error')
  })

  it('should return false', () => {
    expect(selectors.hasError({ errors: { location: 'error' } }, 'location2')).toEqual(false)
  })
})

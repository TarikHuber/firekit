import expect from 'expect'
import * as selector from './selector'

describe('connection selectors', () => {
  it('should false', () => {
    expect(selector.isConnected(null)).toEqual(false)
  })
  it('should false', () => {
    expect(selector.isConnected({})).toEqual(false)
  })

  it('should return true', () => {
    expect(selector.isConnected({ isConnected: true })).toEqual(true)
  })
  it('should return false', () => {
    expect(selector.isConnected({ isConnected: false })).toEqual(false)
  })
})

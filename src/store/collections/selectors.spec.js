import expect from 'expect'
import * as selectors from './selectors'

describe('collections selectors', () => {
    it('should return all lists', () => {
        expect(
            selectors.getAllCols({ collections: 'test' })
        ).toEqual('test')
    })

    it('should return a empty list', () => {
        expect(
            selectors.getCol({ collections: 'test' }, 'test2')
        ).toEqual([])
    })

    it('should return the right list', () => {
        expect(
            selectors.getCol({ collections: { 'test': [1, 2, 3], 'test2': [1, 2, 3, 4] } }, 'test')
        ).toEqual([1, 2, 3])
    })
})

import { isValidationError } from 'src/types/helpers'
import * as Yup from 'yup'

describe('isValidationError type guard', () => {
  it('Should return true for a real yup ValidationError', () => {
    try {
      Yup.object({ age: Yup.number().min(18) }).validateSync({ age: 2 })
    } catch (e) {
      expect(isValidationError(e)).toBe(true)
    }
  })

  it('Should return true when path is undefined but message is a valid string', () => {
    const error = { message: 'some error', path: undefined, inner: [] }

    expect(isValidationError(error)).toBe(true)
  })

  it('Should return false when message is not a string (path undefined)', () => {
    // Bug regression: the guard must validate `message`, not re-check `path`.
    const error = { message: 123, path: undefined, inner: [] }

    expect(isValidationError(error)).toBe(false)
  })

  it('Should return false for plain objects and primitives', () => {
    expect(isValidationError(null)).toBe(false)
    expect(isValidationError(undefined)).toBe(false)
    expect(isValidationError('error')).toBe(false)
    expect(isValidationError({ message: 'x', path: 'y' })).toBe(false)
    expect(isValidationError({ message: 'x', path: 'y', inner: 'not-array' })).toBe(false)
  })
})

import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'
import { TEST_ERROR_MESSAGES } from '../helpers/constants'

const initialValues = {}
const yup = Yup.object({
  age: Yup.number().min(18),
  user: Yup.object({ name: Yup.string().required() })
})

describe('validate fn', () => {
  it('Should validate only the given path', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 2))

    expect(result.current.error('age')).toBe(undefined)

    act(() => result.current.validate('age'))

    expect(result.current.error('age')).toMatch(TEST_ERROR_MESSAGES.MIN)

    expect(result.current.error('user.name')).toBe(undefined)

    unmount()
  })

  it('Should validate only the given nested path', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    expect(result.current.error('user.name')).toBe(undefined)

    act(() => result.current.validate('user.name'))

    expect(result.current.error('user.name')).toMatch(TEST_ERROR_MESSAGES.REQUIRED)

    expect(result.current.error('age')).toBe(undefined)

    unmount()
  })

  it('Should turn on the liveValidation for the validated field', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validate('user.name'))

    expect(result.current.error('user.name')).toMatch(TEST_ERROR_MESSAGES.REQUIRED)

    expect(result.current.liveValidation('user.name')).toBe(true)

    unmount()
  })

  it('Should invoke successCallback if the validation was successful', () => {
    const successCallback = jest.fn()
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('user.name', 'Harry'))

    act(() => result.current.validate('user.name', { successCallback }))

    expect(successCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('Should invoke errorCallback if the validation was NOT successful', () => {
    const errorCallback = jest.fn()
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validate('user.name', { errorCallback }))

    expect(errorCallback).toHaveBeenCalledTimes(1)

    unmount()
  })
})

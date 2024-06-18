import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'
import { TEST_ERROR_MESSAGES } from '../helpers/constants'

const initialValues = {}
const yup = Yup.object({
  age: Yup.number().min(18),
  user: Yup.object({
    name: Yup.string().required(),
    lastName: Yup.string().required()
  })
})

const lastNamePath = 'user.lastName'
const namePath = 'user.name'

describe('validateAll fn', () => {
  it('Should validate only the given path', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 2))

    expect(result.current.error('age')).toBe(undefined)
    expect(result.current.error(namePath)).toBe(undefined)

    act(() => result.current.validateAll(['age', namePath]))

    expect(result.current.error('age')).toMatch(TEST_ERROR_MESSAGES.MIN)
    expect(result.current.error(namePath)).toMatch(TEST_ERROR_MESSAGES.REQUIRED)
    expect(result.current.error(lastNamePath)).toBe(undefined)

    unmount()
  })

  it('Should turn on the liveValidation for the validated fields', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validateAll([namePath, lastNamePath]))

    expect(result.current.liveValidation(namePath)).toBe(true)
    expect(result.current.liveValidation(lastNamePath)).toBe(true)
    expect(result.current.liveValidation('age')).toBe(undefined)

    unmount()
  })

  it('Should invoke successCallback if the validation was successful', () => {
    const successCallback = jest.fn()
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.writeAll([[namePath, 'Harry'], [lastNamePath, 'Potter']]))

    act(() => result.current.validateAll([namePath, lastNamePath], { successCallback }))

    expect(successCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('Should invoke errorCallback if the validation was NOT successful', () => {
    const errorCallback = jest.fn()
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validateAll([namePath, lastNamePath], { errorCallback }))

    expect(errorCallback).toHaveBeenCalledTimes(1)

    unmount()
  })
})

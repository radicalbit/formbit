import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'
import { TEST_ERROR_MESSAGES } from '../helpers/constants'

const initialValues = {}
const yup = Yup.object({
  age: Yup.number().min(18).required(),
  user: Yup.object({
    name: Yup.string().required(),
    lastName: Yup.string().required()
  })
})

const lastNamePath = 'user.lastName'
const namePath = 'user.name'

describe('validateForm fn', () => {
  it('Should validate all the form', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    expect(result.current.error('age')).toBe(undefined)
    expect(result.current.error(namePath)).toBe(undefined)
    expect(result.current.error(lastNamePath)).toBe(undefined)

    act(() => result.current.validateForm())

    expect(result.current.error('age')).toMatch(TEST_ERROR_MESSAGES.REQUIRED)
    expect(result.current.error(namePath)).toMatch(TEST_ERROR_MESSAGES.REQUIRED)
    expect(result.current.error(lastNamePath)).toMatch(TEST_ERROR_MESSAGES.REQUIRED)

    unmount()
  })

  it('Should turn on the liveValidation for the validated fields', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validateForm())

    expect(result.current.liveValidation('age')).toBe(true)
    expect(result.current.liveValidation(namePath)).toBe(true)
    expect(result.current.liveValidation(lastNamePath)).toBe(true)

    unmount()
  })

  it('Should invoke successCallback if the validation was successful', () => {
    const successCallback = jest.fn()
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.writeAll([['age', 20], [namePath, 'Harry'], [lastNamePath, 'Potter']]))

    act(() => result.current.validateForm(successCallback))

    expect(successCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('Should invoke errorCallback if the validation was NOT successful', () => {
    const successCallback = jest.fn()
    const errorCallback = jest.fn()
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validateForm(successCallback, errorCallback))

    expect(errorCallback).toHaveBeenCalledTimes(1)
    expect(successCallback).toHaveBeenCalledTimes(0)

    unmount()
  })
})

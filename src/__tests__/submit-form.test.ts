import { act, renderHook } from '@testing-library/react'
import { SuccessSubmitCallback } from 'src/types'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

type Form = {
  age?: number
}

const initialValues:Form = {}
const yup = Yup.object({
  age: Yup.number().required().min(18)
})

describe('submitForm fn', () => {
  it('Should prevent submitting form is form is NOT valid', () => {
    const successCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.submitForm(successCallback))

    expect(successCallback).toHaveBeenCalledTimes(0)

    unmount()
  })

  it('Should invoke success callback if form is valid', () => {
    const successCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 20))

    act(() => result.current.submitForm(successCallback))

    expect(successCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('ClearIsDirty should reset isDirty value', () => {
    const successCallback: SuccessSubmitCallback<Form> = (_, __, clearIsDirty) => clearIsDirty()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 20))

    expect(result.current.isDirty).toBe(true)

    act(() => result.current.submitForm(successCallback))

    expect(result.current.isDirty).toBe(false)

    unmount()
  })

  it('Should invoke error callback if form is NOT valid', () => {
    const successCallback = jest.fn()
    const errorCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 10))

    act(() => result.current.submitForm(successCallback, errorCallback))

    expect(successCallback).toHaveBeenCalledTimes(0)

    expect(errorCallback).toHaveBeenCalledTimes(1)

    unmount()
  })
})

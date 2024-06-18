import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const initialValues = {}
const yup = Yup.object({
  age: Yup.number().min(18)
})

describe('check fn', () => {
  it('Should return undefined if the provided json is valid according to the original schema', () => {
    const validJson = {
      age: 20
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    expect(result.current.check(validJson)).toStrictEqual(undefined)

    unmount()
  })

  it('Should return an array of errors if the provided json is NOT valid according to the original schema', () => {
    const invalidJson = {
      age: 2
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    const errors = result.current.check(invalidJson)

    expect(errors).toHaveLength(1)

    const error = errors?.[0]

    expect(error?.path).toBe('age')
    expect(error?.type).toBe('min')

    unmount()
  })

  it('Should execute given successCallback only once', () => {
    const validJson = {
      age: 20
    }
    const successCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.check(validJson, { successCallback }))

    expect(successCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('Should execute given errorCallback only once', () => {
    const invalidJson = {
      age: 2
    }
    const errorCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.check(invalidJson, { errorCallback }))

    expect(errorCallback).toHaveBeenCalledTimes(1)

    unmount()
  })
})

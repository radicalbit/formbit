import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const yup = Yup.object().shape({
  name: Yup.string()
})

const initialValues = { }

describe('write fn', () => {
  it('Should write in the form object the given value', () => {
    const fieldName = 'name'
    const value = 'Ada'

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))
    act(() => result.current.write(fieldName, value))

    expect(result.current.form.name).toStrictEqual(value)

    unmount()
  })

  it('Should write in the form object the given nested value', () => {
    const path = 'user.lastName'
    const value = 'Lovelace'

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))
    act(() => result.current.write(path, value))

    expect(result.current.form).toStrictEqual({ user: { lastName: value } })

    unmount()
  })

  it('Should set isDirty to true after writing', () => {
    const path = 'user.lastName'
    const value = 'Lovelace'

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    expect(result.current.isDirty).toBe(false)

    act(() => result.current.write(path, value))

    expect(result.current.form).toStrictEqual({ user: { lastName: value } })
    expect(result.current.isDirty).toBe(true)

    unmount()
  })

  it('Should execute given successCallback only once', () => {
    const path = 'age'
    const value = 1
    const successCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write(path, value, { successCallback }))

    expect(result.current.form).toStrictEqual({ age: value })
    expect(successCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('Should execute given errorCallback only once', () => {
    const path = 'age'
    const value = 'one year'
    const schema = Yup.object({
      age: Yup.number()
    })
    const errorCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.write(path, value, { errorCallback, pathsToValidate: ['age'] }))

    expect(result.current.form).toStrictEqual({ age: value })
    expect(errorCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('Should validate paths given in options', () => {
    const path = 'age'
    const value = 'one year'
    const schema = Yup.object({
      required: Yup.number().required()
    })
    const errorCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.write(path, value, { errorCallback, pathsToValidate: ['required'] }))

    expect(errorCallback).toHaveBeenCalledTimes(1)

    unmount()
  })
})

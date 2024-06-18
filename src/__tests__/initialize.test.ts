import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const initialValues = { age: 12 }
const yup = Yup.object({
  age: Yup.number(),
  new: Yup.boolean()
})

describe('initialize fn', () => {
  it('Should initialize the form with the given initial values', () => {
    const newInitialValues = { new: true }
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.initialize(newInitialValues))

    expect(result.current.form).toStrictEqual(newInitialValues)

    unmount()
  })

  it('Should reset isDirty after initialize', () => {
    const newInitialValues = { new: true }
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 1))

    expect(result.current.isDirty).toBe(true)

    act(() => result.current.initialize(newInitialValues))

    expect(result.current.form).toStrictEqual(newInitialValues)

    expect(result.current.isDirty).toBe(false)

    unmount()
  })

  it('Should reset errors after initialize', () => {
    const newInitialValues = { new: true }
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.setError('error', 'error'))

    act(() => result.current.initialize(newInitialValues))

    expect(result.current.form).toStrictEqual(newInitialValues)

    expect(result.current.errors).toStrictEqual({})

    unmount()
  })

  it('Should reset liveValidation after initialize', () => {
    const newInitialValues = { new: true }
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 'oneYear', { pathsToValidate: ['age'] }))

    expect(result.current.liveValidation('age')).toBe(true)

    act(() => result.current.initialize(newInitialValues))

    expect(result.current.form).toStrictEqual(newInitialValues)

    expect(result.current.liveValidation('age')).toBe(undefined)

    unmount()
  })
})

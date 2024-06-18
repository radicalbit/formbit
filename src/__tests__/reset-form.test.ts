import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const initialValues = {
  name: 'Harry'
}

const yup = Yup.object({
  age: Yup.number().min(2),
  name: Yup.string()
})

describe('resetForm fn', () => {
  it('Should reset the form to the initial values', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 2))

    act(() => result.current.resetForm())

    expect(result.current.form).toStrictEqual(initialValues)

    unmount()
  })

  it('Should reset isDirty after resetForm', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 1))

    expect(result.current.isDirty).toBe(true)

    act(() => result.current.resetForm())

    expect(result.current.form).toStrictEqual(initialValues)

    expect(result.current.isDirty).toBe(false)

    unmount()
  })

  it('Should reset errors after resetForm', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.setError('error', 'error'))

    act(() => result.current.resetForm())

    expect(result.current.errors).toStrictEqual({})

    unmount()
  })

  it('Should reset liveValidation after resetForm', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 'oneYear', { pathsToValidate: ['age'] }))

    expect(result.current.liveValidation('age')).toBe(true)

    act(() => result.current.resetForm())

    expect(result.current.liveValidation('age')).toBe(undefined)

    unmount()
  })
})

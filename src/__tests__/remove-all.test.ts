import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const yup = Yup.object()

describe('remove fn', () => {
  it('Should remove the given field from the form', () => {
    const initialValues = {
      name: 'Harry'
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.remove('name'))

    expect(result.current.form).toStrictEqual({})

    unmount()
  })

  it('Should remove the given nested field from the form', () => {
    const initialValues = {
      user: { name: 'Harry', lastName: 'Potter' }
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.remove('user.name'))

    expect(result.current.form).toStrictEqual({ user: { lastName: 'Potter' } })

    unmount()
  })

  it('Should set isDirty to true after writing', () => {
    const initialValues = {
      user: { name: 'Harry', lastName: 'Potter' }
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.remove('user.name'))

    expect(result.current.form).toStrictEqual({ user: { lastName: 'Potter' } })

    expect(result.current.isDirty).toBe(true)

    unmount()
  })

  it('Should execute given successCallback only once', () => {
    const initialValues = {
      name: 'Harry'
    }
    const successCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.remove('name', { successCallback }))

    expect(result.current.form).toStrictEqual({ })
    expect(successCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('Should execute given errorCallback only once', () => {
    const initialValues = {
      name: 'Harry',
      age: 2
    }

    const schema = Yup.object({ age: Yup.number().min(18) })

    const errorCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.remove('name', { errorCallback, pathsToValidate: ['age'] }))

    expect(result.current.form).toStrictEqual({ age: 2 })

    expect(errorCallback).toHaveBeenCalledTimes(1)

    unmount()
  })
})

import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const initialValues = {}
const yup = Yup.object()

describe('writeAll fn', () => {
  it('Should write in the form object the given values', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.writeAll([
      ['name', 'Harry'],
      ['lastName', 'Potter']]
    ))

    expect(result.current.form).toStrictEqual({ name: 'Harry', lastName: 'Potter' })

    unmount()
  })

  it('Should write in the form object the given nested value', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.writeAll([
      ['name', 'Harry'],
      ['lastName', 'Potter'],
      ['contacts.email', 'harry@potter.com']
    ]
    ))

    expect(result.current.form).toStrictEqual({
      name: 'Harry',
      lastName: 'Potter',
      contacts: { email: 'harry@potter.com' }
    })

    unmount()
  })

  it('Should set isDirty to true after writing', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.writeAll([
      ['name', 'Harry'],
      ['lastName', 'Potter']]
    ))

    expect(result.current.form).toStrictEqual({ name: 'Harry', lastName: 'Potter' })

    expect(result.current.isDirty).toBe(true)

    unmount()
  })

  it('Should execute given successCallback only once', () => {
    const successCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.writeAll([
      ['name', 'Harry'],
      ['lastName', 'Potter']],
    { successCallback }
    ))

    expect(result.current.form).toStrictEqual({ name: 'Harry', lastName: 'Potter' })
    expect(successCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('Should execute given errorCallback only once', () => {
    const schema = Yup.object({
      lastName: Yup.string().min(20)
    })
    const errorCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.writeAll([
      ['name', 'Harry'],
      ['lastName', 'Potter']
    ],
    { errorCallback, pathsToValidate: ['lastName'] }))

    expect(result.current.form).toStrictEqual({ name: 'Harry', lastName: 'Potter' })
    expect(errorCallback).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('Should validate paths given in options', () => {
    const schema = Yup.object({
      required: Yup.number().required()
    })
    const errorCallback = jest.fn()

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.writeAll([
      ['name', 'Harry'],
      ['lastName', 'Potter']
    ], { errorCallback, pathsToValidate: ['required'] }))

    expect(errorCallback).toHaveBeenCalledTimes(1)

    unmount()
  })
})

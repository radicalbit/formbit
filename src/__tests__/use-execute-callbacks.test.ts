import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as yup from 'yup'

const name = 'John Doe'
const email = 'john@doe.com'

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required()
})

describe('useExecuteCallbacks', () => {
  it('write can be used inside successCallbacks', () => {
    const initialValues = { name: '', email: '' }

    const { result } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.write('name', name))
    act(() => result.current.write('email', 'john@doe.com'))

    act(() => result.current.validateForm(() => result.current.write('name', 'after-success-callback')))

    expect(result.current.form.name).toBe('after-success-callback')
  })

  it('Subsequent calls of write and writeAll with different successCallbacks are executed correctly', () => {
    const initialValues = { name: '', email: '' }

    const { result } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.write('name', name))
    act(() => result.current.write('email', email))

    act(() => result.current.validateForm(() => result.current.write('name', 'Al')))
    act(() => result.current.validateForm(() => result.current.writeAll([
      ['name', 'John'],
      ['email', 'john@foo.com']
    ])))

    expect(result.current.form).toStrictEqual({ name: 'John', email: 'john@foo.com' })
  })

  it('successCallbacks and errorCallbacks are called correctly', () => {
    const initialValues = { name: '', email: '' }

    const successCallback = jest.fn()
    const errorCallback = jest.fn()

    const { result } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.write('name', name, { successCallback, errorCallback }))
    act(() => result.current.validateForm(successCallback, errorCallback))

    act(() => result.current.write('email', email, { successCallback, errorCallback }))
    act(() => result.current.validateForm(successCallback, errorCallback))

    expect(successCallback).toHaveBeenCalledTimes(3)
    expect(errorCallback).toHaveBeenCalledTimes(1)
  })

  it('Should fire each callback exactly once when two writes register callbacks in the same tick', () => {
    const initialValues = { name: '', email: '' }
    const cb1 = jest.fn()
    const cb2 = jest.fn()

    const { result } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => {
      result.current.write('name', name, { successCallback: cb1 })
      result.current.write('email', email, { successCallback: cb2 })
    })

    expect(cb1).toHaveBeenCalledTimes(1)
    expect(cb2).toHaveBeenCalledTimes(1)
    expect(cb2.mock.calls[0][0].form).toStrictEqual({ name, email })
  })

  it('Should fire each callback exactly once when validate and validateAll register callbacks in the same tick', () => {
    const initialValues = { name, email }
    const cb1 = jest.fn()
    const cb2 = jest.fn()

    const { result } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => {
      result.current.validate('name', { successCallback: cb1 })
      result.current.validateAll(['email'], { successCallback: cb2 })
    })

    expect(cb1).toHaveBeenCalledTimes(1)
    expect(cb2).toHaveBeenCalledTimes(1)
  })
})

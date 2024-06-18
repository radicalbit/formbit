import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as yup from 'yup'

const initialValues = {
  name: '',
  email: ''
}

const name = 'John Doe'
const email = 'john@doe.com'

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required()
})

describe('useExecuteCallbacks', () => {
  it('write can be used inside successCallbacks', () => {
    const { result } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.write('name', name))
    act(() => result.current.write('email', 'john@doe.com'))

    act(() => result.current.validateForm(() => result.current.write('name', 'after-success-callback')))

    expect(result.current.form.name).toBe('after-success-callback')
  })

  it('Subsequent calls with different successCallbacks are executed', () => {
    const { result } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.write('name', name))
    act(() => result.current.write('email', email))

    act(() => result.current.validateForm(() => result.current.write('name', 'first-validation')))
    act(() => result.current.validateForm(() => result.current.write('email', 'second-validation')))

    expect(result.current.form).toStrictEqual({ name: 'first-validation', email: 'second-validation' })
  })

  it('successCallbacks are called only once', () => {
    const successCallback = jest.fn()
    const { result } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.write('name', name))
    act(() => result.current.write('email', email))

    act(() => result.current.validateForm(successCallback))

    expect(successCallback).toHaveBeenCalledTimes(1)
  })
})

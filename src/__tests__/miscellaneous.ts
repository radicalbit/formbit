import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

describe('Executing many different operations', () => {
  it('Should lead to a correct result', () => {
    // SETUP
    const initialValues = { }
    const schema = Yup.object({
      firstName: Yup.string().required(),
      lastName: Yup.string(),
      age: Yup.number().min(18)
    })

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    const successCallback = jest.fn()
    const errorCallback = jest.fn()

    // EXECUTON
    act(() => result.current.writeAll([
      ['firstName', 'John'],
      ['lastName', 'Doe'],
      ['age', 2]
    ]))
    act(() => result.current.submitForm(successCallback, errorCallback))

    act(() => result.current.removeAll(['firstName', 'lastName', 'age']))
    act(() => result.current.write('firstName', 'John'))
    act(() => result.current.write('lastName', 'Doe'))
    act(() => result.current.write('age', 18))
    act(() => result.current.submitForm(successCallback, errorCallback))

    // VERIFY
    expect(result.current.form).toStrictEqual({ firstName: 'John', lastName: 'Doe', age: 18 })
    expect(successCallback).toHaveBeenCalledTimes(1)
    expect(errorCallback).toHaveBeenCalledTimes(1)

    // TEARDOWN
    unmount()
  })
})

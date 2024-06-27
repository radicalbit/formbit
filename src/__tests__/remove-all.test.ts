import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const schema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  age: Yup.number().min(18).required()
})

describe('removeAll fn', () => {
  it('Should remove the given fields from the form', () => {
    const initialValues = { firstName: 'Jane', lastName: 'Doe', age: 23 }
    const expectedValues = { firstName: undefined, lastName: undefined, age: 23 }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.removeAll(['firstName', 'lastName']))

    expect(result.current.form).toStrictEqual(expectedValues)

    unmount()
  })

  it('Should remove just the given fields from the form', () => {
    const initialValues = { firstName: 'Jane', lastName: 'Doe', age: 17 }
    const expectedValues = { firstName: undefined, lastName: undefined, age: 24 }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.validateForm())
    act(() => result.current.write('age', 24, { pathsToValidate: ['age'] }))
    act(() => result.current.removeAll(['firstName', 'lastName']))

    expect(result.current.form).toStrictEqual(expectedValues)

    unmount()
  })
})

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
    const expectedValues = { age: 23 }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.removeAll(['firstName', 'lastName']))

    expect(result.current.form).toStrictEqual(expectedValues)

    unmount()
  })

  it('Should remove just the given fields from the form', () => {
    const initialValues = { firstName: 'Jane', lastName: 'Doe', age: 17 }
    const expectedValues = { age: 24 }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => result.current.validateForm())
    act(() => result.current.write('age', 24, { pathsToValidate: ['age'] }))
    act(() => result.current.removeAll(['firstName', 'lastName']))

    expect(result.current.form).toStrictEqual(expectedValues)

    unmount()
  })

  it('Should re-validate fields with active live-validation, like writeAll does', () => {
    const initialValues = { firstName: 'Jane', lastName: 'Doe', age: 10 }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: schema }))

    // Make `age` live-validated: it fails validation, so formbit marks it as live-validated.
    act(() => result.current.validate('age'))
    expect(result.current.liveValidation('age')).toBe(true)
    expect(result.current.error('age')).toBeTruthy()

    // Fix `age` to a valid value WITHOUT validating it explicitly.
    act(() => result.current.write('age', 30, { noLiveValidation: true, pathsToValidate: [] }))

    // Removing another field must re-run live-validation on `age` and clear its (now stale) error.
    act(() => result.current.removeAll(['firstName']))

    expect(result.current.error('age')).toBeFalsy()

    unmount()
  })

  it('Should delete only the nested leaf', () => {
    const initialValues = { address: { city: 'Milan', zip: '20100' } }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup: Yup.object() }))

    act(() => result.current.removeAll(['address.city']))

    expect(result.current.form).toStrictEqual({ address: { zip: '20100' } })

    unmount()
  })

  it('Should behave like remove for a single path', () => {
    const initialValues = { firstName: 'Jane', lastName: 'Doe', age: 23 }

    const { result: withRemoveAll, unmount: unmountRemoveAll } =
      renderHook(() => useFormbit({ initialValues, yup: schema }))
    const { result: withRemove, unmount: unmountRemove } =
      renderHook(() => useFormbit({ initialValues, yup: schema }))

    act(() => withRemoveAll.current.removeAll(['firstName']))
    act(() => withRemove.current.remove('firstName'))

    expect(withRemoveAll.current.form).toStrictEqual(withRemove.current.form)

    unmountRemoveAll()
    unmountRemove()
  })
})

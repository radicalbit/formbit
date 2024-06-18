import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const yup = Yup.object({
  age: Yup.number().min(18),
  nested: Yup.object({ age: Yup.number().min(18) })
})

describe('isFormInvalid fn', () => {
  it('Should return false if the form is valid', () => {
    const initialValues = {
      age: 20
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validateForm())

    expect(result.current.isFormInvalid()).toStrictEqual(false)

    unmount()
  })

  it('Should return true if the form is invalid', () => {
    const initialValues = {
      age: 2
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validateForm())

    expect(result.current.isFormInvalid()).toStrictEqual(true)

    unmount()
  })
})

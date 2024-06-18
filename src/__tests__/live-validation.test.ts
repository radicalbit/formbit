import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const initialValues = {
  age: 16
}

const yup = Yup.object({
  age: Yup.number().min(18)
})

describe('liveValidation fn', () => {
  it('Should return true if live validation is active for the given path', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validateForm())

    expect(result.current.liveValidation('age')).toStrictEqual(true)

    unmount()
  })

  it('Should return undefined if live validation is NOT active for the given path', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    expect(result.current.liveValidation('age')).toStrictEqual(undefined)

    unmount()
  })
})

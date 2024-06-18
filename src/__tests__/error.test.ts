import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'
import { TEST_ERROR_MESSAGES } from '../helpers/constants'

const yup = Yup.object({
  age: Yup.number().min(18),
  nested: Yup.object({ age: Yup.number().min(18) })
})

describe('error fn', () => {
  it('Should return undefined if the corresponding field is valid', () => {
    const initialValues = {
      age: 20
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validate('age'))

    expect(result.current.error('age')).toStrictEqual(undefined)

    unmount()
  })

  it('Should return an error if the corresponding field is NOT valid', () => {
    const initialValues = {
      age: 5
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validate('age'))

    expect(result.current.error('age')).toMatch(TEST_ERROR_MESSAGES.MIN)

    unmount()
  })

  it('Should return an error if the corresponding NESTED field is NOT valid', () => {
    const initialValues = {
      nested: { age: 2 }
    }

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.validate('nested.age'))

    expect(result.current.error('nested.age')).toMatch(TEST_ERROR_MESSAGES.MIN)

    unmount()
  })
})

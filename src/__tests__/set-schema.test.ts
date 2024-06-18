import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'
import { TEST_ERROR_MESSAGES } from '../helpers/constants'

const initialValues = {}
const yup = Yup.object()

describe('setSchema fn', () => {
  it('After setting a new schema it should be used to validate', () => {
    const newSchema = Yup.object({ age: Yup.number().min(18) })

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.write('age', 2))

    act(() => result.current.validate('age'))

    expect(result.current.check({ age: 2 })).toBe(undefined)

    act(() => result.current.setSchema(newSchema))

    act(() => result.current.validate('age'))

    expect(result.current.error('age')).toMatch(TEST_ERROR_MESSAGES.MIN)

    unmount()
  })
})

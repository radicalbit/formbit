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

  it('Should keep live validation on the index, not the row, when an array shrinks', () => {
    const friendsSchema = Yup.object({
      friends: Yup.array(Yup.object({ name: Yup.string().required() }))
    })
    const friendsInitialValues = { friends: [{ name: 'a' }, { name: '' }] }

    const { result, unmount } =
      renderHook(() => useFormbit({ initialValues: friendsInitialValues, yup: friendsSchema }))

    act(() => result.current.validateAll(['friends[1].name']))
    expect(result.current.error('friends[1].name')).toBeTruthy()

    // Remove the first row: the invalid row moves from index 1 to index 0.
    act(() => result.current.write('friends', [{ name: '' }]))

    expect(result.current.liveValidation('friends[1].name')).toBe(true)
    expect(result.current.error('friends[1].name')).toBeUndefined()
    expect(result.current.error('friends[0].name')).toBeUndefined()

    unmount()
  })
})

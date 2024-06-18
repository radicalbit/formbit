import { TEST_ERROR_MESSAGES } from 'src/helpers/constants'
import { validateSyncAll } from 'src/validate-sync-all'
import * as Yup from 'yup'

const schema = Yup.object({
  age: Yup.number().min(18),
  nested: Yup.object({ age: Yup.number().min(18) })
})

describe('validateSyncAll fn', () => {
  it('Should return an empty array if no paths are passed', () => {
    const result = validateSyncAll([], schema, {})

    expect(result).toHaveLength(0)
  })

  it('Should validate only the given paths', () => {
    const form = { age: 2, nested: { age: 2 } }
    const result = validateSyncAll(['age'], schema, form)

    expect(result).toHaveLength(1)
    expect(result[0].message).toMatch(TEST_ERROR_MESSAGES.MIN)
    expect(result[0].path).toBe('age')
  })

  it('Should be able to validate multiple  paths', () => {
    const form = { age: 2, nested: { age: 2 } }
    const result = validateSyncAll(['age', 'nested.age'], schema, form)

    expect(result).toHaveLength(2)
    expect(result[0].message).toMatch(TEST_ERROR_MESSAGES.MIN)
    expect(result[0].path).toBe('age')
    expect(result[1].message).toMatch(TEST_ERROR_MESSAGES.MIN)
    expect(result[1].path).toBe('nested.age')
  })
})

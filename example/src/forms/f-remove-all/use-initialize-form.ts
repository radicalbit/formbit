import { useFormbitContext } from 'formbit'
import { useEffect } from 'react'
import { useFakeApiContext } from '../fake-api-context'
import type { FormValues } from './schema'

export const useInitializeForm = () => {
  const { initialize } = useFormbitContext<FormValues>()

  const { fakeUser } = useFakeApiContext()
  const { data: user } = fakeUser

  useEffect(() => {
    if (user) {
      // The fake user carries an `email` this form's schema doesn't have,
      // so we only initialize the fields this form actually manages.
      initialize({ name: user.name, surname: user.surname })
    }
  }, [initialize, user])
}

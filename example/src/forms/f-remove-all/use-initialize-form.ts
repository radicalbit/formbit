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
      initialize({ ...user })
    }
  }, [initialize, user])
}

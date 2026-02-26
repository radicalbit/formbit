import { useFormbitContext } from 'formbit'
import { useEffect } from 'react'
import { useFakeApiContext } from '../fake-api-context'
import { FormData } from './schema'

export const useInitializeForm = () => {
  const { initialize } = useFormbitContext<FormData>()

  const { fakeUser } = useFakeApiContext()
  const { data: user } = fakeUser

  useEffect(() => {
    if (user) {
      initialize({ ...user })
    }
  }, [initialize, user])
}

import { useCallback, useEffect, useState } from 'react'
import type { User, UseGetFakeUserResult } from './use-get-fake-user-types'

const fakeUser: User = {
  name: 'Ada',
  surname: 'Lovelace',
  email: 'ada@example.com'
}

export const useGetFakeUser = (): UseGetFakeUserResult => {
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const [fetchCount, setFetchCount] = useState(0)

  const refetch = useCallback(() => {
    setFetchCount(prev => prev + 1)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setError(undefined)
    setIsSuccess(false)

    const fakeGet = () => {
      if (Math.random() < 0.2) {
        setError(new Error('Failed to fetch user'))
        setUser(undefined)
      } else {
        setUser(fakeUser)
        setIsSuccess(true)
      }
      setIsLoading(false)
    }

    const timeout = setTimeout(() => {
      fakeGet()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [fetchCount])

  return {
    data: user,
    isLoading,
    isError: !!error,
    isSuccess,
    error,
    refetch
  }
}

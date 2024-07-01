import { useEffect, useState } from 'react'

const fakeUser = {
  name: 'Ada',
  surname: 'Lovelace',
  email: 'ada@example.com'
}

type User = Partial<typeof fakeUser>

export const useGetFakeUser = () => {
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fakeGet = () => {
      setUser(fakeUser)
      setIsLoading(false)
    }

    const timeout = setTimeout(() => {
      fakeGet()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return [user, isLoading] as const
}

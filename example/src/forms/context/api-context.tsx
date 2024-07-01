import { PropsWithChildren, useContext, createContext } from 'react'
import { useFakePost } from './use-fake-post'
import { useGetFakeUser } from './use-get-fake-user'

type Context = {
    fakePost: ReturnType<typeof useFakePost>
    fakeUser: ReturnType<typeof useGetFakeUser>
} | undefined

const FakeApiContext = createContext<Context>(undefined)

export function FakeApiProvider({ children }: PropsWithChildren) {
  const fakePost = useFakePost()
  const fakeUser = useGetFakeUser()

  return <FakeApiContext.Provider value={{ fakePost, fakeUser }}>{children}</FakeApiContext.Provider>
}

export const useGetUser = () => {
  const context = useContext(FakeApiContext)

  if (!context) {
    throw Error('FakeApiContext not found')
  }

  return context.fakeUser
}

export const usePost = () => {
  const context = useContext(FakeApiContext)

  if (!context) {
    throw Error('FakeApiContext not found')
  }

  return context.fakePost
}

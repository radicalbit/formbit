import { useState } from 'react'

const sleep = (ms: number) => new Promise((resolve) => {
  setTimeout(() => {
    const success = true
    if (success) {
      resolve('Operation was successful!')
    } else {
      throw new Error('Operation failed')
    }
  }, ms)
})

export const useFakePost = () => {
  const [isLoading, setIsLoading] = useState(false)

  const fakePost = async (body?: unknown) => {
    setIsLoading(true)

    await sleep(1000)

    setIsLoading(false)

    return body
  }

  return [fakePost, isLoading] as const
}

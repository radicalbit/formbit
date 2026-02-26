import { useState } from 'react'
import type { UseFakePostResult } from './use-fake-post-types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useFakePost = (): UseFakePostResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [error, setError] = useState<Error>()

  const mutate = async (body?: unknown) => {
    setIsLoading(true)
    setIsSuccess(false)
    setError(undefined)

    await sleep(1000)

    setIsLoading(false)
    setIsSuccess(true)

    return body
  }

  return {
    mutate,
    isLoading,
    isError: !!error,
    isSuccess,
    error
  }
}

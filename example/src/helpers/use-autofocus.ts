import { useEffect, useRef } from 'react'

type InputLike = Pick<HTMLElement, 'focus'>

export const useAutoFocus = <T extends InputLike>(shouldRefocus?: unknown) => {
  const ref = useRef<T>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [ref, shouldRefocus])

  return ref
}

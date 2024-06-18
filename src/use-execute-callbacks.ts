import { useCallback, useEffect, useRef } from 'react'
import { GenericCallback, InitialValues, SetError, Writer } from './types'

type CbTypes<Values extends InitialValues> = GenericCallback<Values> | undefined

type RefsStore<Values extends InitialValues> = CbTypes<Values>[]

/**
 * useExecuteCallbacks
 *
 * This hook is meant to give a simple way to make sure that callbacks are called only once,
 * even if they are called inside React hooks like useEffect or setState.
 *
 *
 */
export default <Values extends InitialValues>(writer: Writer<Values>, setError: SetError) => {
  const callbacksStore = useRef<RefsStore<Partial<Values>>>([])

  useEffect(() => {
    if (callbacksStore.current.length) {
      callbacksStore.current.forEach((cb) => {
        if (cb) {
          cb(writer, setError)
        }
      })
      callbacksStore.current = []
    }
  }, [setError, writer])

  /**
    * executeCallbacks
    * @param cb Callback that needs to be executed.
    *
    */
  return useCallback((cb?: GenericCallback<Partial<Values>>) => {
    if (cb) {
      callbacksStore.current.push(cb)
    }
  }, [])
}

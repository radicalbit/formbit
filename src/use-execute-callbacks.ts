import { useCallback, useEffect, useRef } from 'react'
import { FormState, GenericCallback, FormbitValues, SetError } from './types'
import { isEmpty } from 'lodash'

/**
 * useExecuteCallbacks
 *
 * This hook is meant to give a simple way to make sure that callbacks are called only once,
 * even if they are called inside React hooks like useEffect or setState.
 *
 *
 */
export default <Values extends FormbitValues>(writer: FormState<Values>, setError: SetError) => {
  const callbacksStore = useRef<Record<string, GenericCallback<Partial<Values>> | undefined>>({})

  useEffect(() => {
    if (isEmpty(callbacksStore.current)) {
      return
    }

    Object.entries(callbacksStore.current).forEach(([, cb]) => {
      if (cb) {
        cb(writer, setError)
      }
    })

    callbacksStore.current = {}
  }, [setError, writer])

  /**
    * executeCallbacks
    * @param cb Callback that needs to be executed.
    *
    */
  return useCallback((uuid: string, cb?: GenericCallback<Partial<Values>>) => {
    if (cb) {
      callbacksStore.current = { ...callbacksStore.current, [uuid]: cb }
    }
  }, [])
}

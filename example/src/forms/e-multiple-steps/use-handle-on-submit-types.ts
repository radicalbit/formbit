import type { FormbitValues } from 'formbit'
import type { UseFakePostResult } from '../fake-api-context/use-fake-post-types'

export interface UseHandleOnSubmitResult {
    handleOnSubmit: () => void
    isSubmitDisabled: boolean
    args: Omit<UseFakePostResult, 'mutate'>
}

export type Context = FormbitValues & {
    __metadata?: {
        resetSteps?: () => void
    }
}

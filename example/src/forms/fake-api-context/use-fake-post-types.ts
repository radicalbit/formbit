export interface UseFakePostResult {
    mutate: (body?: unknown) => Promise<unknown>
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
    error: Error | undefined
}

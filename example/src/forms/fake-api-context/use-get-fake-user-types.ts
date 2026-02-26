export interface User {
    name?: string
    surname?: string
    email?: string
}

export interface UseGetFakeUserResult {
    data: User | undefined
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
    error: Error | undefined
    refetch: () => void
}

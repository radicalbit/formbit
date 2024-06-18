import { useState } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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



import { useFormbitContext, type FormbitValues } from "formbit";
import { useCallback } from "react";

type Context = FormbitValues & {
    __metadata: {
        nextStep?: () => void
    }
}

export const useHandleNextStep = (fields: string[]) => {
    const { form: { __metadata }, validateAll, error } = useFormbitContext<Context>();

    const nextStep = __metadata?.nextStep

    const handleOnNext = useCallback(
        () => validateAll(fields, { successCallback: nextStep }),
        [fields, nextStep, validateAll]
    );

    const isStepInvalid = fields?.some(field => error(field))

    return [handleOnNext, isStepInvalid] as const
}
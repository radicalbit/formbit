import { useFormbitContext } from "formbit";
import { useCallback } from "react";


type Context = {
    __metadata: {
        nextStep?: () => void
    }
 }

export const useHandleNextStep = (fields?: string[]) => {
    const { form: { __metadata }, validateAll, error } = useFormbitContext<Context>();

    const nextStep = __metadata?.nextStep

    const handleOnNext = useCallback(
        () => validateAll(['name', 'surname'], { successCallback: nextStep }),
        [nextStep, validateAll]
    );

    const isStepInvalid = fields?.some(field => error(field))

    return [handleOnNext, isStepInvalid] as const
}
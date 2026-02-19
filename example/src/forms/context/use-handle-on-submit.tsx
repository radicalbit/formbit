import { useFormbitContext, type FormbitValues } from "formbit";
import { success } from "../../helpers/message";
import { usePost } from "./api-context";

type Context = FormbitValues & {
    __metadata?: {
        resetSteps?: () => void
    }
}

export const useHandleOnSubmit = () => {
    const { form: { __metadata }, submitForm, isFormInvalid, resetForm, isDirty } = useFormbitContext<Context>();

    const [triggerMutation, isLoading] = usePost();

    const resetSteps = __metadata?.resetSteps;

    const isSubmitDisabled = isFormInvalid() || !isDirty;

    const handleOnSubmit = () => {
        if (isSubmitDisabled || isLoading) return;

        submitForm(async ({ form }, _setError, clearIsDirty) => {
            await triggerMutation(form);
            success(form);
            resetForm();
            clearIsDirty();
            resetSteps?.();
        });
    };

    return [handleOnSubmit, isSubmitDisabled, isLoading] as const;
}
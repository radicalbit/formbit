import { useFormbitContext } from "formbit";
import { Button, FormField, Input, SectionTitle } from "@radicalbit/radicalbit-design-system";
import { InputRef } from 'rc-input';
import { ChangeEvent } from "react";
import { useAutoFocus } from "../../helpers/use-autofocus";
import { FormData } from "./schema";
import { useHandleNextStep } from "./use-handle-next-step";

const useMultipleStepsForm = () => useFormbitContext<FormData>();

export function StepOne() {
    return <>
        <div className='flex flex-col gap-4 w-96 justify-center p-8 m-auto'>
            <SectionTitle title='Step 1' />

            <Name />

            <Surname />

            <Actions />
        </div>
    </>
}

function Name() {
    const { form, error, write } = useMultipleStepsForm();

    const [handleOnNext] = useHandleNextStep()

    const handleOnChangeName = (e: ChangeEvent<HTMLInputElement>) => write('name', e.target.value);

    const ref = useAutoFocus<InputRef>()

    return (
        <FormField label="Name" message={error('name')}>
            <Input
                placeholder="Name"
                onChange={handleOnChangeName}
                onPressEnter={handleOnNext}
                value={form.name}
                ref={ref}
                required
            />
        </FormField>
    );
}

function Surname() {
    const { form, error, write } = useMultipleStepsForm();

    const [handleOnNext] = useHandleNextStep()

    const handleOnChangeSurname = (e: ChangeEvent<HTMLInputElement>) => write('surname', e.target.value);

    return (
        <FormField label="Surname" message={error('surname')}>
            <Input
                placeholder="Surname"
                onChange={handleOnChangeSurname}
                onPressEnter={handleOnNext}
                value={form.surname}
                required
            />
        </FormField>
    )
}

function Actions() {
    const [handleOnNext, isStepInvalid] = useHandleNextStep(['name', 'surname'])

    return (
        <Button
            disabled={isStepInvalid}
            onClick={handleOnNext}
            type='primary'
        >
            Next
        </Button>
    )
}


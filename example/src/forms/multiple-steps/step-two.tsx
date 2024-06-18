import { useFormbitContext } from "formbit";
import { Button, FormField, InputNumber, SectionTitle } from "rbit-design-system-os";
import { useAutoFocus } from "../../helpers/use-autofocus";
import { FormData } from "./schema";
import { useHandleNextStep } from "./use-handle-next-step";


const useMultipleStepsForm = () => useFormbitContext<FormData>();

export function StepTwo() {
    return <>
        <div className='flex flex-col gap-4 w-96 justify-center p-8 m-auto'>
            <SectionTitle title='Step 2' />

            <Age />

            <Actions />
        </div>
    </>
}

function Age() {
    const { form, error, write } = useMultipleStepsForm()

    const [handleOnNext] = useHandleNextStep()

    const handleOnChangeInputNumber = (value?: number | null) => write('age', value);

    const ref = useAutoFocus<HTMLInputElement>()

    return (
        <FormField label="Age" message={error('age')}>
            <InputNumber
                type="number"
                placeholder="Age"
                min={0}
                max={200}
                onChange={handleOnChangeInputNumber}
                onPressEnter={handleOnNext}
                value={form.age}
                ref={ref}
                required
            />
        </FormField>)
}

function Actions() {
    const { form: { __metadata } } = useMultipleStepsForm();

    const [handleOnNext, isStepInvalid] = useHandleNextStep();

    const prevStep = __metadata?.prevStep;

    return (
        <>
            <Button
                disabled={isStepInvalid}
                onClick={handleOnNext}
                type='primary'
            >
                Next
            </Button>

            <Button
                onClick={prevStep}
                type="ghost"
            >
                Prev
            </Button>
        </>
    )
}

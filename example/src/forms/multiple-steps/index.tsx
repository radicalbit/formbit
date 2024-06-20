import { FormbitContextProvider } from 'formbit';
import { Steps } from "@radicalbit/radicalbit-design-system";
import { useState } from 'react';
import { schema } from './schema';
import { StepOne } from './step-one';
import { StepThree } from './step-three';
import { StepTwo } from './step-two';

const items = [{
  title: 'Step One',
  description: "Let's start!"
}, {
  title: 'Step Two',
  description: 'Half way...'
}, {
  title: 'Step Three',
  description: 'Just one more info'
}]

export function MultipleStepsForm() {
  const [step, setStep] = useState(0)

  const nextStep = () => setStep(prev => {
    const next = prev + 1
    return next > 2 ? 0 : next
  })

  const prevStep = () => setStep(prev => {
    const next = prev - 1
    return next < 0 ? 2 : next
  })

  const resetSteps = () => {
    setStep(0)
  }

  return (
    <FormbitContextProvider
      initialValues={{ __metadata: { step, nextStep, prevStep, resetSteps } }}
      schema={schema}
    >

      <div className='flex flex-col p-6 w-[34rem] m-auto'>
        <Steps
          direction='horizontal'
          current={step}
          items={items} />
        {step === 0 && <StepOne />}

        {step === 1 && <StepTwo />}

        {step === 2 && <StepThree />}
      </div>
    </FormbitContextProvider>

  );
}




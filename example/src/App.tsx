import { Tabs } from "rbit-design-system-os"
import { BasicFormContext } from './forms/basic-form-context'
import { BasicFormHook } from './forms/basic-form-hook'
import { MultipleStepsForm } from './forms/multiple-steps'
import { AddableFieldsForm } from './forms/addable-fields'
import { EditLikeForm } from './forms/edit-like'
import { FakeApiProvider } from "./forms/context/api-context"
import FormbitLogo from "./img/formbit-logo.svg"

enum EXAMPLES {
  CONTEXT = 'context',
  HOOK = 'hook',
  MULTI = 'multi',
  ADDABLE = 'addable',
  EDIT = 'edit'
}

function App() {
  return (
    <div className="flex flex-col justify-center  gap-8 p-4">
      <header>
        <img src={FormbitLogo} alt="Formbit Logo" className="h-14 mt-4 mx-auto pe-6 block"/>
      </header>

      <FakeApiProvider>
        <Tabs
          destroyInactiveTabPane
          defaultActiveKey={EXAMPLES.HOOK}
          modifier='flex flex-col'
          centered
          items={[
            {
              label: 'Basic Hook',
              key: EXAMPLES.HOOK,
              children: <BasicFormHook />
            },
            {
              label: 'Basic Context',
              key: EXAMPLES.CONTEXT,
              children: <BasicFormContext />
            },
            {
              label: 'Multi-step Form',
              key: EXAMPLES.MULTI,
              children: <MultipleStepsForm />
            },
            {
              label: 'Addable-Fields Form',
              key: EXAMPLES.ADDABLE,
              children: <AddableFieldsForm />
            },
            {
              label: 'Edit Form',
              key: EXAMPLES.EDIT,
              children: <EditLikeForm />
            },
          ]} />
      </FakeApiProvider>
    </div>
  )
}

export default App
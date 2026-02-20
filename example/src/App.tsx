import { Tabs } from "@radicalbit/radicalbit-design-system"
import { BasicFormContext } from './forms/basic-form-context'
import { BasicFormHook } from './forms/basic-form-hook'
import { MultipleStepsForm } from './forms/multiple-steps'
import { AddableFieldsForm } from './forms/addable-fields'
import { EditLikeForm } from './forms/edit-like'
import { FakeApiProvider } from "./forms/context/api-context"
import Logo from "./img/LogoRB_PositivoBN.png"
import { WriteRemoveAllForm } from "./forms/remove-all"

enum EXAMPLES {
  CONTEXT = 'context',
  HOOK = 'hook',
  MULTI = 'multi',
  ADDABLE = 'addable',
  EDIT = 'edit',
  WRITEREMOVEALL = 'write/remove all',
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col justify-start gap-8 p-4 flex-1">
        <header>
          <img src={Logo} alt="Logo" className="h-14 mt-4 mx-auto pe-6 block"/>
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
              {
                label: 'Write/Remove All Form',
                key: EXAMPLES.WRITEREMOVEALL,
                children: <WriteRemoveAllForm />
              },
            ]} />
        </FakeApiProvider>
      </div>

      <footer className="text-right text-sm text-gray-500 py-8 pr-8">
        powered by <a href="https://github.com/radicalbit/radicalbit-design-system" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">@radicalbit/rbit-design-system</a>
      </footer>
    </div>
  )
}

export default App
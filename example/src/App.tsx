import { Tabs } from '@radicalbit/radicalbit-design-system'
import { BasicFormHook } from './forms/a-basic-form-hook'
import { BasicFormContext } from './forms/b-basic-form-context'
import { AddableFieldsForm } from './forms/c-addable-fields'
import { EditLikeForm } from './forms/d-edit-like'
import { MultipleStepsForm } from './forms/e-multiple-steps'
import { WriteRemoveAllForm } from './forms/f-remove-all'
import { FakeApiProvider } from './forms/fake-api-context'
import Logo from './img/LogoRB_PositivoBN.png'

enum EXAMPLES {
  CONTEXT = 'context',
  HOOK = 'hook',
  MULTI = 'multi',
  ADDABLE = 'addable',
  EDIT = 'edit',
  WRITEREMOVEALL = 'write-remove-all',
}

const QUERY_PARAM = 'example'

const getActiveTab = (): string => {
  const params = new URLSearchParams(window.location.search)
  const tab = params.get(QUERY_PARAM)

  if (tab && Object.values<string>(EXAMPLES).includes(tab)) {
    return tab
  }

  return EXAMPLES.HOOK
}

const setActiveTab = (key: string) => {
  const params = new URLSearchParams(window.location.search)
  params.set(QUERY_PARAM, key)
  window.history.replaceState({}, '', `?${params.toString()}`)
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
            defaultActiveKey={getActiveTab()}
            onChange={setActiveTab}
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
                label: 'Multi-step Form',
                key: EXAMPLES.MULTI,
                children: <MultipleStepsForm />
              },
              {
                label: 'Write/Remove All Form',
                key: EXAMPLES.WRITEREMOVEALL,
                children: <WriteRemoveAllForm />
              }
            ]} />
        </FakeApiProvider>
      </div>

      <footer className="text-right text-sm text-gray-500 py-8 pr-8">
        powered by{' '}
        <a
          href="https://github.com/radicalbit/radicalbit-design-system"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          @radicalbit/rbit-design-system
        </a>
      </footer>
    </div>
  )
}

export default App

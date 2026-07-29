# Formbit

Formbit is a **lightweight React state form library** designed to simplify form management within your applications. With **Formbit**, you can easily handle form state, validate user input, and submit data efficiently.

[![NPM](https://img.shields.io/npm/v/@radicalbit/formbit.svg)](https://www.npmjs.com/package/@radicalbit/formbit) [![downloads](https://img.shields.io/npm/dm/@radicalbit/formbit.svg)](https://www.npmjs.com/package/@radicalbit/formbit) [![license](https://badgen.net/badge/license/MIT)](./LICENSE)

## Why formbit?

Formbit keeps your form **state, validation, and errors in one hook**, addressed by
**dot-path** (`write('user.address.city', value)`) so nested and dynamic fields work
without extra wiring. Validation is delegated to [yup](https://github.com/jquense/yup),
and a built-in **Context Provider** shares the whole form across a component tree
without prop drilling — while formbit stays out of your markup, so it works with any
UI (Antd, MaterialUI, or plain HTML).

📖 **Learn more:** [Decoupling form state from UI in React with Formbit](https://medium.com/@luca.tagliabue/decoupling-form-state-from-ui-in-react-with-formbit-%EF%B8%8F-fa3af2adfb94) — the design rationale behind the library.

## Table of contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Features](#features)
- [Install](#install)
- [Getting Started](#getting-started)
- [Usage Patterns](#usage-patterns)
  - [Context Provider](#context-provider)
  - [Edit / Initialize Pattern](#edit--initialize-pattern)
  - [Multi-Step Form](#multi-step-form)
- [Local Development](#local-development)
- [API](#api)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Features

- Intuitive and easy-to-use form state management.
- Out of the box support for validation with [yup](https://github.com/jquense/yup).
- Full **TypeScript generics** — `useFormbit<FormValues>(...)` infers paths, values, and callbacks.
- Support for handling complex forms with dynamic and nested fields via **dot-path notation**.
- **Context Provider** for sharing form state across deeply nested component trees.
- Seamless and flexible integration with React — works with Antd, MaterialUI, or plain HTML.

## Install

```bash
npm install --save @radicalbit/formbit
```

```bash
yarn add @radicalbit/formbit
```

## Getting Started

Three steps: **define a schema**, **call the hook**, **bind the UI**.

```tsx
import * as yup from 'yup';
import useFormbit from '@radicalbit/formbit';

// 1. Define a Yup schema and infer the TypeScript type from it
const schema = yup.object({
  name: yup.string().max(25, 'Max 25 characters').required('Name is required'),
  age:  yup.number().max(120, 'Must be 0–120').required('Age is required'),
});

type FormValues = yup.InferType<typeof schema>;

const initialValues: Partial<FormValues> = { name: undefined, age: undefined };

// 2. Call the hook with generics so every callback is fully typed
function Example() {
  const { form, submitForm, write, error, isDirty } = useFormbit<FormValues>({
    initialValues,
    yup: schema,
  });

  const handleChangeName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    write('name', value);
  };

  const handleChangeAge = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    write('age', Number(value));
  };

  const handleSubmit = () => {
    submitForm(
      ({ form }) => console.log('Validated form:', form),
      ({ errors }) => console.error('Validation errors:', errors),
    );
  };

  // 3. Bind inputs, errors, and submit — Formbit stays out of your UI
  return (
    <div>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        value={form.name ?? ''}
        onChange={handleChangeName}
      />
      <div>{error('name')}</div>

      <label htmlFor="age">Age</label>
      <input
        id="age"
        type="number"
        value={form.age ?? ''}
        onChange={handleChangeAge}
      />
      <div>{error('age')}</div>

      <button disabled={!isDirty} onClick={handleSubmit} type="button">
        Submit
      </button>
    </div>
  );
}

export default Example;
```

## Usage Patterns

### Context Provider

Use `FormbitContextProvider` when you need to share form state across deeply nested components without prop drilling.

<details>
<summary>Show example</summary>

```tsx
import { FormbitContextProvider, useFormbitContext } from '@radicalbit/formbit';
import * as yup from 'yup';

const schema = yup.object({
  name:    yup.string().required('Name is required'),
  surname: yup.string().required('Surname is required'),
  age:     yup.number().required('Age is required'),
});

type FormValues = yup.InferType<typeof schema>;

const initialValues: Partial<FormValues> = { name: undefined, surname: undefined, age: undefined };

// Wrap your form tree with the provider
function App() {
  return (
    <FormbitContextProvider<FormValues>
      initialValues={initialValues}
      yup={schema}
    >
      <NameField />
      <SubmitButton />
    </FormbitContextProvider>
  );
}

// Any child can access form state without props
function NameField() {
  const { form, write, error } = useFormbitContext<FormValues>();

  const handleChangeName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    write('name', value);
  };

  return (
    <div>
      <input
        value={form.name ?? ''}
        onChange={handleChangeName}
      />
      <span>{error('name')}</span>
    </div>
  );
}

function SubmitButton() {
  const { submitForm, isDirty } = useFormbitContext<FormValues>();

  return (
    <button
      disabled={!isDirty}
      onClick={() => submitForm(({ form }) => console.log(form))}
    >
      Submit
    </button>
  );
}
```

</details>

### Edit / Initialize Pattern

Start with empty initial values and call `initialize()` once data arrives from an API.

<details>
<summary>Show example</summary>

```tsx
import { useEffect, useState } from 'react';
import useFormbit from '@radicalbit/formbit';
import * as yup from 'yup';

const schema = yup.object({
  name:  yup.string().required(),
  email: yup.string().email().required(),
});

type FormValues = yup.InferType<typeof schema>;

const initialValues: Partial<FormValues> = { name: undefined, email: undefined };

function EditUserForm({ userId }: { userId: string }) {
  const { form, write, error, initialize, submitForm } = useFormbit<FormValues>({
    initialValues,
    yup: schema,
  });

  const [loading, setLoading] = useState(true);

  // Fetch and initialize — resetForm() will revert to these values
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((user) => { initialize(user); setLoading(false); });
  }, [userId]);

  const handleChangeName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    write('name', value);
  };

  const handleChangeEmail = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    write('email', value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(({ form }) => console.log(form));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name ?? ''} onChange={handleChangeName} />
      <div>{error('name')}</div>

      <input value={form.email ?? ''} onChange={handleChangeEmail} />
      <div>{error('email')}</div>

      <button type="submit">Save</button>
    </form>
  );
}
```

</details>

### Multi-Step Form

Use `__metadata` to store step state and `validateAll` to gate navigation between steps.

<details>
<summary>Show example</summary>

```tsx
import useFormbit from '@radicalbit/formbit';
import * as yup from 'yup';

const schema = yup.object({
  name:  yup.string().required('Name is required'),
  age:   yup.number().required('Age is required'),
  email: yup.string().email().required('Email is required'),
});

type FormValues = yup.InferType<typeof schema>;

const initialValues: Partial<FormValues> & { __metadata: { step: number } } = {
  name: undefined,
  age: undefined,
  email: undefined,
  __metadata: { step: 0 },
};

function MultiStepForm() {
  const { form, write, error, validateAll, submitForm } = useFormbit<FormValues>({
    initialValues,
    yup: schema,
  });

  const step = (form.__metadata?.step as number) ?? 0;
  const goTo = (n: number) => write('__metadata.step', n);

  // Validate only the current step's fields before advancing
  const next = (paths: string[]) => {
    validateAll(paths, {
      successCallback: () => goTo(step + 1),
    });
  };

  const handleChangeName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    write('name', value);
  };

  const handleChangeAge = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    write('age', Number(value));
  };

  const handleChangeEmail = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    write('email', value);
  };

  const handleSubmit = () => {
    submitForm(({ form }) => console.log('Submit:', form));
  };

  return (
    <div>
      {step === 0 && (
        <div>
          <input value={form.name ?? ''} onChange={handleChangeName} />
          <div>{error('name')}</div>
          <button onClick={() => next(['name'])}>Next</button>
        </div>
      )}

      {step === 1 && (
        <div>
          <input type="number" value={form.age ?? ''} onChange={handleChangeAge} />
          <div>{error('age')}</div>
          <button onClick={() => goTo(0)}>Back</button>
          <button onClick={() => next(['age'])}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <input value={form.email ?? ''} onChange={handleChangeEmail} />
          <div>{error('email')}</div>
          <button onClick={() => goTo(1)}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}
```

</details>

## Local Development

Install dependencies and build the library:

```bash
yarn install
yarn build      # bundle with microbundle (modern + cjs)
yarn start      # same, in watch mode
```

Run the checks:

```bash
yarn test           # unit tests + lint + build
yarn test:unit      # unit tests only
yarn test:coverage  # unit tests with coverage
```

To test your local version of formbit inside another project, we suggest using
[Yalc](https://github.com/wclr/yalc):

```bash
yarn yalc:publish   # publish the local build to the Yalc store and push to linked projects
```

## API

`useFormbit(...)` (and `useFormbitContext()`) returns an object with the following
members. For full type signatures see [`src/types/index.ts`](https://github.com/radicalbit/formbit/blob/main/src/types/index.ts).

**State**

- `form` — the current form values
- `errors` — validation error messages, keyed by dot-path
- `isDirty` — `true` once any value has changed since the last init

**Queries**

- `error(path)` — the error message at `path`, if any
- `liveValidation(path)` — whether `path` is re-validated on every change
- `isFormValid()` — `true` if there are no errors
- `isFormInvalid()` — `true` if there is at least one error
- `check(json, opts?)` — validate an arbitrary object and return its errors, without touching form state

**Writing values**

- `write(path, value, opts?)` — set the value at `path` and validate
- `writeAll(entries, opts?)` — set several `[path, value]` pairs at once
- `remove(path, opts?)` — remove the value at `path`
- `removeAll(paths, opts?)` — remove several paths at once

**Validation**

- `validate(path, opts?)` — validate a single `path`
- `validateAll(paths, opts?)` — validate several paths
- `validateForm(onOk?, onErr?)` — validate the whole form against the schema
- `submitForm(onOk, onErr?)` — validate, then run `onOk` with the completed form

**Setup & lifecycle**

- `initialize(values)` — replace form and initial values (e.g. with fetched data)
- `resetForm()` — revert the form to its initial values
- `setError(path, message)` — set an error message manually
- `setSchema(schema)` — swap the validation schema at runtime

## License

MIT © [Radicalbit (https://github.com/radicalbit)]

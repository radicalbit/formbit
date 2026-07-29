# Formbit

Formbit is a **lightweight React state form library** designed to simplify form management within your applications. With **Formbit**, you can easily handle form state, validate user input, and submit data efficiently.

[![NPM](https://img.shields.io/npm/v/formbit.svg)](https://www.npmjs.com/package/formbit) [![license](https://badgen.net/badge/license/MIT)](./LICENSE)

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
- [API Reference](#api-reference)
  - [FormbitObject](#formbitobject)
  - [Core Types](#core-types)
  - [Callback Types](#callback-types)
  - [Method Types](#method-types)
  - [Options Types](#options-types)
  - [Yup Re-Exports](#yup-re-exports)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Features

- Intuitive and easy-to-use form state management.
- Out of the box support for validation with [yup](https://github.com/jquense/yup).
- Full **TypeScript generics** — `useFormbit<FormData>(...)` infers paths, values, and callbacks.
- Support for handling complex forms with dynamic and nested fields via **dot-path notation**.
- **Context Provider** for sharing form state across deeply nested component trees.
- Seamless and flexible integration with React — works with Antd, MaterialUI, or plain HTML.

## Install

```bash
npm  install  --save  formbit
```

```bash
yarn  add  formbit
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

type FormData = yup.InferType<typeof schema>;

const initialValues: Partial<FormData> = { name: undefined, age: undefined };

// 2. Call the hook with generics so every callback is fully typed
function Example() {
  const { form, submitForm, write, error, isDirty } = useFormbit<FormData>({
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

```tsx
import { FormbitContextProvider, useFormbitContext } from '@radicalbit/formbit';
import * as yup from 'yup';

const schema = yup.object({
  name:    yup.string().required('Name is required'),
  surname: yup.string().required('Surname is required'),
  age:     yup.number().required('Age is required'),
});

type FormData = yup.InferType<typeof schema>;

const initialValues: Partial<FormData> = { name: undefined, surname: undefined, age: undefined };

// Wrap your form tree with the provider
function App() {
  return (
    <FormbitContextProvider<FormData>
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
  const { form, write, error } = useFormbitContext<FormData>();

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
  const { submitForm, isDirty } = useFormbitContext<FormData>();

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

### Edit / Initialize Pattern

Start with empty initial values and call `initialize()` once data arrives from an API.

```tsx
import { useEffect, useState } from 'react';
import useFormbit from '@radicalbit/formbit';
import * as yup from 'yup';

const schema = yup.object({
  name:  yup.string().required(),
  email: yup.string().email().required(),
});

type FormData = yup.InferType<typeof schema>;

const initialValues: Partial<FormData> = { name: undefined, email: undefined };

function EditUserForm({ userId }: { userId: string }) {
  const { form, write, error, initialize, submitForm } = useFormbit<FormData>({
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

### Multi-Step Form

Use `__metadata` to store step state and `validateAll` to gate navigation between steps.

```tsx
import useFormbit from '@radicalbit/formbit';
import * as yup from 'yup';

const schema = yup.object({
  name:  yup.string().required('Name is required'),
  age:   yup.number().required('Age is required'),
  email: yup.string().email().required('Email is required'),
});

type FormData = yup.InferType<typeof schema>;

const initialValues: Partial<FormData> & { __metadata: { step: number } } = {
  name: undefined,
  age: undefined,
  email: undefined,
  __metadata: { step: 0 },
};

function MultiStepForm() {
  const { form, write, error, validateAll, submitForm } = useFormbit<FormData>({
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

## Local Development
For local development we suggest using [Yalc](https://github.com/wclr/yalc) to test your local version of formbit in your projects.

<!-- START_TYPES_DOC -->
## API Reference

### FormbitObject

Ƭ **FormbitObject**\<`T`\>: `Object`

The object returned by `useFormbit()` and `useFormbitContext()`. Holds the form
state and every method needed to read, mutate and validate the form.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `check` | [`Check`](#check)\<`Partial`\<`T`\>\> | Validates `json` against the current schema; returns the errors, or undefined if valid. |
| `error` | (`path`: `string`) => `string` \| `undefined` | - |
| `errors` | [`Errors`](#errors) | Error messages registered since the last validation, keyed by the value's dot-path. **`Example`** ```ts form: { age: 1 } errors: { age: "Age must be greater than 18" } ``` |
| `form` | `Partial`\<`T`\> | The current form values. Partial: fields may be missing until validated. |
| `initialize` | [`Initialize`](#initialize)\<`T`\> | Re-initializes the form with new initial values. |
| `isDirty` | `boolean` | True once the user has interacted with the form. |
| `isFormInvalid` | () => `boolean` | - |
| `isFormValid` | () => `boolean` | - |
| `liveValidation` | (`path`: `string`) => ``true`` \| `undefined` | - |
| `remove` | [`Remove`](#remove)\<`T`\> | Removes the value at `path`, sets `isDirty`, then validates `pathsToValidate` plus every live-validated field. |
| `removeAll` | [`RemoveAll`](#removeall)\<`T`\> | Removes every given path, sets `isDirty`, then validates `pathsToValidate` plus every live-validated field. |
| `resetForm` | () => `void` | - |
| `setError` | [`SetError`](#seterror) | Sets the error message at `path`. |
| `setSchema` | [`SetSchema`](#setschema)\<`T`\> | Replaces the current validation schema. |
| `submitForm` | [`SubmitForm`](#submitform)\<`T`\> | Validates the whole form and, if valid, runs the success callback to submit. |
| `validate` | [`Validate`](#validate)\<`T`\> | Validates only `path` (ignores live-validated fields). |
| `validateAll` | [`ValidateAll`](#validateall)\<`T`\> | Validates only the given `paths` (ignores live-validated fields). |
| `validateForm` | [`ValidateForm`](#validateform)\<`Partial`\<`T`\>\> | Validates the whole form and registers any error. |
| `write` | [`Write`](#write)\<`T`\> | Writes `value` at `path`, sets `isDirty`, then validates `pathsToValidate` plus every live-validated field. |
| `writeAll` | [`WriteAll`](#writeall)\<`T`\> | Writes every `[path, value]` pair, sets `isDirty`, then validates `pathsToValidate` plus every live-validated field. |

#### Defined in

[index.ts:186](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L186)
### Core Types

#### Errors

Ƭ **Errors**: `Record`\<`string`, `string`\>

Error messages registered since the last validation, stored under the same
dot-path as the corresponding form value.

**`Example`**

```ts
form:   { age: 1 }
errors: { age: "Age must be greater than 18" }
```

#### Defined in

[index.ts:23](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L23)
#### FormState

Ƭ **FormState**\<`T`\>: `Object`

The whole internal state of the form (everything except the validation schema).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errors` | [`Errors`](#errors) |
| `form` | `T` |
| `initialValues` | `T` |
| `isDirty` | `boolean` |
| `liveValidation` | [`LiveValidation`](#livevalidation) |

#### Defined in

[index.ts:38](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L38)
#### FormbitValues

Ƭ **FormbitValues**: `Record`\<`string`, `unknown`\> & \{ `__metadata?`: `Record`\<`string`, `unknown`\>  }

Base shape of every form handled by formbit: an open record of values, plus an
optional `__metadata` field formbit uses to carry data that must survive a
reset/initialize but must NOT be submitted.

The generic `T` you pass to `useFormbit<T>()` must extend this type.

#### Defined in

[index.ts:13](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L13)
#### LiveValidation

Ƭ **LiveValidation**: `Record`\<`string`, ``true``\>

Fields currently under live-validation (re-validated on every form change).
A field is added here automatically when it fails a validation. Empty by default.

**`Example`**

```ts
form:           { age: 1 }
liveValidation: { age: true }
```

#### Defined in

[index.ts:33](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L33)
### Callback Types

#### CheckErrorCallback

Ƭ **CheckErrorCallback**\<`T`\>: (`json`: [`FormbitValues`](#formbitvalues), `inner`: [`ValidationError`](#validationerror)[], `writer`: [`FormState`](#formstate)\<`T`\>, `setError`: [`SetError`](#seterror)) => `void`

Invoked by `check()` when the given json is invalid.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`json`, `inner`, `writer`, `setError`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`FormbitValues`](#formbitvalues) |
| `inner` | [`ValidationError`](#validationerror)[] |
| `writer` | [`FormState`](#formstate)\<`T`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:72](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L72)
#### CheckSuccessCallback

Ƭ **CheckSuccessCallback**\<`T`\>: (`json`: [`FormbitValues`](#formbitvalues), `writer`: [`FormState`](#formstate)\<`T`\>, `setError`: [`SetError`](#seterror)) => `void`

Invoked by `check()` when the given json is valid.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`json`, `writer`, `setError`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`FormbitValues`](#formbitvalues) |
| `writer` | [`FormState`](#formstate)\<`T`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:68](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L68)
#### ErrorCallback

Ƭ **ErrorCallback**\<`T`\>: (`writer`: [`FormState`](#formstate)\<`T`\>, `setError`: [`SetError`](#seterror)) => `void`

Invoked by validation methods when validation fails.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`writer`, `setError`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `writer` | [`FormState`](#formstate)\<`T`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:64](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L64)
#### SubmitSuccessCallback

Ƭ **SubmitSuccessCallback**\<`T`\>: (`writer`: [`FormState`](#formstate)\<`Omit`\<`T`, ``"__metadata"``\>\>, `setError`: [`SetError`](#seterror), `clearIsDirty`: () => `void`) => `void`

Invoked by `submitForm()` once the whole form is valid — the place to send data
to the backend. `__metadata` is stripped from `writer.form` before this runs.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`writer`, `setError`, `clearIsDirty`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `writer` | [`FormState`](#formstate)\<`Omit`\<`T`, ``"__metadata"``\>\> |
| `setError` | [`SetError`](#seterror) |
| `clearIsDirty` | () => `void` |

##### Returns

`void`

#### Defined in

[index.ts:79](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L79)
#### SuccessCallback

Ƭ **SuccessCallback**\<`T`\>: (`writer`: [`FormState`](#formstate)\<`T`\>, `setError`: [`SetError`](#seterror)) => `void`

Invoked by validation methods when the form (or the validated paths) are valid.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`writer`, `setError`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `writer` | [`FormState`](#formstate)\<`T`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:60](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L60)
### Method Types

#### Check

Ƭ **Check**\<`T`\>: (`json`: [`FormbitValues`](#formbitvalues), `options?`: [`CheckFnOptions`](#checkfnoptions)\<`T`\>) => [`ValidationError`](#validationerror)[] \| `undefined`

See [FormbitObject.check](#check).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`json`, `options?`): [`ValidationError`](#validationerror)[] \| `undefined`

##### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`FormbitValues`](#formbitvalues) |
| `options?` | [`CheckFnOptions`](#checkfnoptions)\<`T`\> |

##### Returns

[`ValidationError`](#validationerror)[] \| `undefined`

#### Defined in

[index.ts:89](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L89)
#### Initialize

Ƭ **Initialize**\<`T`\>: (`values`: `Partial`\<`T`\>) => `void`

See [FormbitObject.initialize](#initialize).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`values`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Partial`\<`T`\> |

##### Returns

`void`

#### Defined in

[index.ts:93](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L93)
#### Remove

Ƭ **Remove**\<`T`\>: (`path`: `string`, `options?`: [`WriteFnOptions`](#writefnoptions)\<`T`\>) => `void`

See [FormbitObject.remove](#remove).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`path`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`WriteFnOptions`](#writefnoptions)\<`T`\> |

##### Returns

`void`

#### Defined in

[index.ts:96](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L96)
#### RemoveAll

Ƭ **RemoveAll**\<`T`\>: (`arr`: `string`[], `options?`: [`WriteFnOptions`](#writefnoptions)\<`T`\>) => `void`

See [FormbitObject.removeAll](#removeall).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`arr`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `string`[] |
| `options?` | [`WriteFnOptions`](#writefnoptions)\<`T`\> |

##### Returns

`void`

#### Defined in

[index.ts:116](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L116)
#### SetError

Ƭ **SetError**: (`path`: `string`, `value`: `string`) => `void`

See [FormbitObject.setError](#seterror).

#### Type declaration

▸ (`path`, `value`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `value` | `string` |

##### Returns

`void`

#### Defined in

[index.ts:99](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L99)
#### SetSchema

Ƭ **SetSchema**\<`T`\>: (`newSchema`: [`ValidationSchema`](#validationschema)\<`T`\>) => `void`

See [FormbitObject.setSchema](#setschema).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`newSchema`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `newSchema` | [`ValidationSchema`](#validationschema)\<`T`\> |

##### Returns

`void`

#### Defined in

[index.ts:102](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L102)
#### SubmitForm

Ƭ **SubmitForm**\<`T`\>: (`successCallback`: [`SubmitSuccessCallback`](#submitsuccesscallback)\<`T`\>, `errorCallback?`: [`ErrorCallback`](#errorcallback)\<`Partial`\<`T`\>\>, `options?`: [`ValidateOptions`](#validateoptions)) => `void`

See [FormbitObject.submitForm](#submitform).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`successCallback`, `errorCallback?`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `successCallback` | [`SubmitSuccessCallback`](#submitsuccesscallback)\<`T`\> |
| `errorCallback?` | [`ErrorCallback`](#errorcallback)\<`Partial`\<`T`\>\> |
| `options?` | [`ValidateOptions`](#validateoptions) |

##### Returns

`void`

#### Defined in

[index.ts:132](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L132)
#### Validate

Ƭ **Validate**\<`T`\>: (`path`: `string`, `options?`: [`ValidateFnOptions`](#validatefnoptions)\<`T`\>) => `void`

See [FormbitObject.validate](#validate).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`path`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`ValidateFnOptions`](#validatefnoptions)\<`T`\> |

##### Returns

`void`

#### Defined in

[index.ts:120](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L120)
#### ValidateAll

Ƭ **ValidateAll**\<`T`\>: (`paths`: `string`[], `options?`: [`ValidateFnOptions`](#validatefnoptions)\<`T`\>) => `void`

See [FormbitObject.validateAll](#validateall).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`paths`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `paths` | `string`[] |
| `options?` | [`ValidateFnOptions`](#validatefnoptions)\<`T`\> |

##### Returns

`void`

#### Defined in

[index.ts:123](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L123)
#### ValidateForm

Ƭ **ValidateForm**\<`T`\>: (`successCallback?`: [`SuccessCallback`](#successcallback)\<`T`\>, `errorCallback?`: [`ErrorCallback`](#errorcallback)\<`T`\>, `options?`: [`ValidateOptions`](#validateoptions)) => `void`

See [FormbitObject.validateForm](#validateform).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`successCallback?`, `errorCallback?`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `successCallback?` | [`SuccessCallback`](#successcallback)\<`T`\> |
| `errorCallback?` | [`ErrorCallback`](#errorcallback)\<`T`\> |
| `options?` | [`ValidateOptions`](#validateoptions) |

##### Returns

`void`

#### Defined in

[index.ts:126](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L126)
#### Write

Ƭ **Write**\<`T`\>: (`path`: keyof `T` \| `string`, `value`: `unknown`, `options?`: [`WriteFnOptions`](#writefnoptions)\<`T`\>) => `void`

See [FormbitObject.write](#write).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`path`, `value`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | keyof `T` \| `string` |
| `value` | `unknown` |
| `options?` | [`WriteFnOptions`](#writefnoptions)\<`T`\> |

##### Returns

`void`

#### Defined in

[index.ts:108](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L108)
#### WriteAll

Ƭ **WriteAll**\<`T`\>: (`arr`: [`WriteAllValue`](#writeallvalue)\<`T`\>[], `options?`: [`WriteFnOptions`](#writefnoptions)\<`T`\>) => `void`

See [FormbitObject.writeAll](#writeall).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

▸ (`arr`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | [`WriteAllValue`](#writeallvalue)\<`T`\>[] |
| `options?` | [`WriteFnOptions`](#writefnoptions)\<`T`\> |

##### Returns

`void`

#### Defined in

[index.ts:112](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L112)
### Options Types

#### CheckFnOptions

Ƭ **CheckFnOptions**\<`T`\>: `Object`

Options accepted by `check()`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorCallback?` | [`CheckErrorCallback`](#checkerrorcallback)\<`T`\> |
| `options?` | [`ValidateOptions`](#validateoptions) |
| `successCallback?` | [`CheckSuccessCallback`](#checksuccesscallback)\<`T`\> |

#### Defined in

[index.ts:140](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L140)
#### ValidateFnOptions

Ƭ **ValidateFnOptions**\<`T`\>: `Object`

Options accepted by the `validate` methods.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorCallback?` | [`ErrorCallback`](#errorcallback)\<`Partial`\<`T`\>\> |
| `options?` | [`ValidateOptions`](#validateoptions) |
| `successCallback?` | [`SuccessCallback`](#successcallback)\<`Partial`\<`T`\>\> |

#### Defined in

[index.ts:147](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L147)
#### WriteAllValue

Ƭ **WriteAllValue**\<`T`\>: [keyof `T` \| `string`, `unknown`]

A single `[path, value]` pair accepted by `writeAll`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Defined in

[index.ts:105](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L105)
#### WriteFnOptions

Ƭ **WriteFnOptions**\<`T`\>: \{ `noLiveValidation?`: `boolean` ; `pathsToValidate?`: `string`[]  } & [`ValidateFnOptions`](#validatefnoptions)\<`T`\>

Options accepted by the `write`/`remove` methods (validate options plus path control).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Defined in

[index.ts:154](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L154)
### Yup Re-Exports

#### ValidateOptions

Ƭ **ValidateOptions**: `YupValidateOptions`

Options forwarded to yup's validation methods. See [https://github.com/jquense/yup](https://github.com/jquense/yup).

#### Defined in

[index.ts:52](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L52)
#### ValidationError

Ƭ **ValidationError**: `YupValidationError`

The error object yup throws when a validation fails. See [https://github.com/jquense/yup](https://github.com/jquense/yup).

#### Defined in

[index.ts:55](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L55)
#### ValidationSchema

Ƭ **ValidationSchema**\<`T`\>: `ObjectSchema`\<`T`\>

A validation schema built with `yup.object()`. See [https://github.com/jquense/yup](https://github.com/jquense/yup).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`FormbitValues`](#formbitvalues) |

#### Defined in

[index.ts:49](https://github.com/radicalbit/formbit/blob/2ca1a8a/src/types/index.ts#L49)
<!-- END_TYPES_DOC -->

## License

MIT © [Radicalbit (https://github.com/radicalbit)]

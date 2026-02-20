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
  - [Deprecated Types](#deprecated-types)
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

Ƭ **FormbitObject**\<`Values`\>: `Object`

Object returned by useFormbit() and useFormbitContextHook().
It contains all the data and methods needed to handle the form.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `check` | [`Check`](#check)\<`Partial`\<`Values`\>\> | Checks the given json against the form schema and returns an array of errors. It returns undefined if the json is valid. |
| `error` | (`path`: `string`) => `string` \| `undefined` | - |
| `errors` | [`Errors`](#errors) | Object including all the registered error messages since the last validation. Errors are stored using the same path of the corresponding form values. **`Example`** If the form object has this structure: ```json { "age": 1 } ``` and age is a non valid field, errors object will look like this ```json { "age": "Age must be greater then 18" } ``` |
| `form` | `Partial`\<`Values`\> | Object containing the updated form. |
| `initialize` | [`Initialize`](#initialize)\<`Values`\> | Initialize the form with new initial values. |
| `isDirty` | `boolean` | Returns true if the form is Dirty (user already interacted with the form), false otherwise. |
| `isFormInvalid` | () => `boolean` | - |
| `isFormValid` | () => `boolean` | - |
| `liveValidation` | (`path`: `string`) => ``true`` \| `undefined` | - |
| `remove` | [`Remove`](#remove)\<`Values`\> | This method updates the form state deleting value, setting isDirty to true. After writing, it validates all the paths contained into pathsToValidate (if any) and all the fields that have the live validation active. |
| `removeAll` | [`RemoveAll`](#removeall)\<`Values`\> | This method updates the form state deleting multiple values, setting isDirty to true. |
| `resetForm` | () => `void` | - |
| `setError` | [`SetError`](#seterror) | Set a message (value) to the given error path. |
| `setSchema` | [`SetSchema`](#setschema)\<`Values`\> | Override the current schema with the given one. |
| `submitForm` | [`SubmitForm`](#submitform)\<`Values`\> | Perform a validation against the current form object, and execute the successCallback if the validation passes, otherwise it executes the errorCallback. |
| `validate` | [`Validate`](#validate)\<`Values`\> | This method only validates the specified path. Does not check for fields that have the live validation active. |
| `validateAll` | [`ValidateAll`](#validateall)\<`Values`\> | This method only validates the specified paths. Does not check for fields that have the live validation active. |
| `validateForm` | [`ValidateForm`](#validateform)\<`Partial`\<`Values`\>\> | This method validates the entire form and sets the corresponding errors if any. |
| `write` | [`Write`](#write)\<`Values`\> | This method updates the form state writing $value into the $path, setting isDirty to true. After writing, it validates all the paths contained into $pathsToValidate (if any) and all the fields that have the live validation active. |
| `writeAll` | [`WriteAll`](#writeall)\<`Values`\> | This method takes an array of [path, value] and updates the form state writing all those values into the specified paths. It sets isDirty to true. After writing, it validates all the paths contained into $pathToValidate and all the fields that have the live validation active. |

#### Defined in

[index.ts:297](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L297)
### Core Types

#### Errors

Ƭ **Errors**: `Record`\<`string`, `string`\>

Object including all the registered error messages since the last validation.
Errors are stored using the same path of the corresponding form values.

**`Example`**

If the form object has this structure:
```json
{
  "age": 1
}
```
and age is a non valid field, errors object will look like this
```json
{
  "age": "Age must be greater then 18"
}
```

#### Defined in

[index.ts:78](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L78)
#### Form

Ƭ **Form**: [`FormbitValues`](#formbitvalues)

Object containing the updated form.

#### Defined in

[index.ts:55](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L55)
#### FormState

Ƭ **FormState**\<`Values`\>: `Object`

Internal form state storing all the data of the form (except the validation schema).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errors` | [`Errors`](#errors) |
| `form` | `Values` |
| `initialValues` | `Values` |
| `isDirty` | `boolean` |
| `liveValidation` | [`LiveValidation`](#livevalidation) |

#### Defined in

[index.ts:110](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L110)
#### FormbitValues

Ƭ **FormbitValues**: \{ `__metadata?`: `FormbitRecord`  } & `FormbitRecord`

Base type for form values: a record of string keys with an optional `__metadata` field.

#### Defined in

[index.ts:52](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L52)
#### InitialValues

Ƭ **InitialValues**: [`FormbitValues`](#formbitvalues)

InitialValues used to set up formbit; also used to reset the form to its original version.

#### Defined in

[index.ts:58](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L58)
#### LiveValidation

Ƭ **LiveValidation**: `Record`\<`string`, ``true``\>

Object including all the values that are being live validated.
Usually fields that fail validation (using one of the methods that triggers validation)
will automatically be set to live-validated.

A value/path is live-validated when validated at every change of the form.

By default no field is live-validated.

**`Example`**

If the form object has this structure:
```json
{
  "age": 1
}
```
and age is a field that is being live-validated, liveValidation object will look like this
```json
{
  "age": true
}
```

#### Defined in

[index.ts:103](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L103)
### Callback Types

#### CheckErrorCallback

Ƭ **CheckErrorCallback**\<`Values`\>: (`json`: [`Form`](#form), `inner`: [`ValidationError`](#validationerror)[], `writer`: [`FormState`](#formstate)\<`Values`\>, `setError`: [`SetError`](#seterror)) => `void`

Invoked in case of errors raised by validation of check method.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`json`, `inner`, `writer`, `setError`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`Form`](#form) |
| `inner` | [`ValidationError`](#validationerror)[] |
| `writer` | [`FormState`](#formstate)\<`Values`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:171](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L171)
#### CheckSuccessCallback

Ƭ **CheckSuccessCallback**\<`Values`\>: (`json`: [`Form`](#form), `writer`: [`FormState`](#formstate)\<`Values`\>, `setError`: [`SetError`](#seterror)) => `void`

Success callback invoked by the check method when the operation is successful.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`json`, `writer`, `setError`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`Form`](#form) |
| `writer` | [`FormState`](#formstate)\<`Values`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:162](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L162)
#### ErrorCallback

Ƭ **ErrorCallback**\<`Values`\>: (`writer`: [`FormState`](#formstate)\<`Values`\>, `setError`: [`SetError`](#seterror)) => `void`

Invoked in case of errors raised by validation.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`writer`, `setError`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `writer` | [`FormState`](#formstate)\<`Values`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:157](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L157)
#### SubmitSuccessCallback

Ƭ **SubmitSuccessCallback**\<`Values`\>: (`writer`: [`FormState`](#formstate)\<`Values` \| `Omit`\<`Values`, ``"__metadata"``\>\>, `setError`: [`SetError`](#seterror), `clearIsDirty`: () => `void`) => `void`

Success callback invoked by the submit method when the validation is successful.
Is the right place to send your data to the backend.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`writer`, `setError`, `clearIsDirty`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `writer` | [`FormState`](#formstate)\<`Values` \| `Omit`\<`Values`, ``"__metadata"``\>\> |
| `setError` | [`SetError`](#seterror) |
| `clearIsDirty` | () => `void` |

##### Returns

`void`

#### Defined in

[index.ts:181](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L181)
#### SuccessCallback

Ƭ **SuccessCallback**\<`Values`\>: (`writer`: [`FormState`](#formstate)\<`Values`\>, `setError`: [`SetError`](#seterror)) => `void`

Success callback invoked by some formbit methods when the operation is successful.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`writer`, `setError`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `writer` | [`FormState`](#formstate)\<`Values`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:152](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L152)
### Method Types

#### Check

Ƭ **Check**\<`Values`\>: (`json`: [`Form`](#form), `options?`: [`CheckFnOptions`](#checkfnoptions)\<`Values`\>) => [`ValidationError`](#validationerror)[] \| `undefined`

See [FormbitObject.check](#check).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`json`, `options?`): [`ValidationError`](#validationerror)[] \| `undefined`

##### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`Form`](#form) |
| `options?` | [`CheckFnOptions`](#checkfnoptions)\<`Values`\> |

##### Returns

[`ValidationError`](#validationerror)[] \| `undefined`

#### Defined in

[index.ts:213](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L213)
#### Initialize

Ƭ **Initialize**\<`Values`\>: (`values`: `Partial`\<`Values`\>) => `void`

See [FormbitObject.initialize](#initialize).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`values`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Partial`\<`Values`\> |

##### Returns

`void`

#### Defined in

[index.ts:217](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L217)
#### Remove

Ƭ **Remove**\<`Values`\>: (`path`: `string`, `options?`: [`WriteFnOptions`](#writefnoptions)\<`Values`\>) => `void`

See [FormbitObject.remove](#remove).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`path`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`WriteFnOptions`](#writefnoptions)\<`Values`\> |

##### Returns

`void`

#### Defined in

[index.ts:220](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L220)
#### RemoveAll

Ƭ **RemoveAll**\<`Values`\>: (`arr`: `string`[], `options?`: [`WriteFnOptions`](#writefnoptions)\<`Values`\>) => `void`

See [FormbitObject.removeAll](#removeall).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`arr`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `string`[] |
| `options?` | [`WriteFnOptions`](#writefnoptions)\<`Values`\> |

##### Returns

`void`

#### Defined in

[index.ts:255](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L255)
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

[index.ts:223](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L223)
#### SetSchema

Ƭ **SetSchema**\<`Values`\>: (`newSchema`: [`ValidationSchema`](#validationschema)\<`Values`\>) => `void`

See [FormbitObject.setSchema](#setschema).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`newSchema`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `newSchema` | [`ValidationSchema`](#validationschema)\<`Values`\> |

##### Returns

`void`

#### Defined in

[index.ts:226](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L226)
#### SubmitForm

Ƭ **SubmitForm**\<`Values`\>: (`successCallback`: [`SubmitSuccessCallback`](#submitsuccesscallback)\<`Values`\>, `errorCallback?`: [`ErrorCallback`](#errorcallback)\<`Partial`\<`Values`\>\>, `options?`: [`ValidateOptions`](#validateoptions)) => `void`

See [FormbitObject.submitForm](#submitform).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`successCallback`, `errorCallback?`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `successCallback` | [`SubmitSuccessCallback`](#submitsuccesscallback)\<`Values`\> |
| `errorCallback?` | [`ErrorCallback`](#errorcallback)\<`Partial`\<`Values`\>\> |
| `options?` | [`ValidateOptions`](#validateoptions) |

##### Returns

`void`

#### Defined in

[index.ts:229](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L229)
#### Validate

Ƭ **Validate**\<`Values`\>: (`path`: `string`, `options?`: [`ValidateFnOptions`](#validatefnoptions)\<`Values`\>) => `void`

See [FormbitObject.validate](#validate).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`path`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`ValidateFnOptions`](#validatefnoptions)\<`Values`\> |

##### Returns

`void`

#### Defined in

[index.ts:235](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L235)
#### ValidateAll

Ƭ **ValidateAll**\<`Values`\>: (`paths`: `string`[], `options?`: [`ValidateFnOptions`](#validatefnoptions)\<`Values`\>) => `void`

See [FormbitObject.validateAll](#validateall).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`paths`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `paths` | `string`[] |
| `options?` | [`ValidateFnOptions`](#validatefnoptions)\<`Values`\> |

##### Returns

`void`

#### Defined in

[index.ts:238](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L238)
#### ValidateForm

Ƭ **ValidateForm**\<`Values`\>: (`successCallback?`: [`SuccessCallback`](#successcallback)\<`Values`\>, `errorCallback?`: [`ErrorCallback`](#errorcallback)\<`Values`\>, `options?`: [`ValidateOptions`](#validateoptions)) => `void`

See [FormbitObject.validateForm](#validateform).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`successCallback?`, `errorCallback?`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `successCallback?` | [`SuccessCallback`](#successcallback)\<`Values`\> |
| `errorCallback?` | [`ErrorCallback`](#errorcallback)\<`Values`\> |
| `options?` | [`ValidateOptions`](#validateoptions) |

##### Returns

`void`

#### Defined in

[index.ts:241](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L241)
#### Write

Ƭ **Write**\<`Values`\>: (`path`: keyof `Values` \| `string`, `value`: `unknown`, `options?`: [`WriteFnOptions`](#writefnoptions)\<`Values`\>) => `void`

See [FormbitObject.write](#write).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`path`, `value`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | keyof `Values` \| `string` |
| `value` | `unknown` |
| `options?` | [`WriteFnOptions`](#writefnoptions)\<`Values`\> |

##### Returns

`void`

#### Defined in

[index.ts:247](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L247)
#### WriteAll

Ƭ **WriteAll**\<`Values`\>: (`arr`: [`WriteAllValue`](#writeallvalue)\<`Values`\>[], `options?`: [`WriteFnOptions`](#writefnoptions)\<`Values`\>) => `void`

See [FormbitObject.writeAll](#writeall).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`arr`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | [`WriteAllValue`](#writeallvalue)\<`Values`\>[] |
| `options?` | [`WriteFnOptions`](#writefnoptions)\<`Values`\> |

##### Returns

`void`

#### Defined in

[index.ts:251](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L251)
### Options Types

#### CheckFnOptions

Ƭ **CheckFnOptions**\<`Values`\>: `Object`

Options object to change the behavior of the check method.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorCallback?` | [`CheckErrorCallback`](#checkerrorcallback)\<`Values`\> |
| `options?` | [`ValidateOptions`](#validateoptions) |
| `successCallback?` | [`CheckSuccessCallback`](#checksuccesscallback)\<`Values`\> |

#### Defined in

[index.ts:268](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L268)
#### ValidateFnOptions

Ƭ **ValidateFnOptions**\<`Values`\>: `Object`

Options object to change the behavior of the validate methods.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorCallback?` | [`ErrorCallback`](#errorcallback)\<`Partial`\<`Values`\>\> |
| `options?` | [`ValidateOptions`](#validateoptions) |
| `successCallback?` | [`SuccessCallback`](#successcallback)\<`Partial`\<`Values`\>\> |

#### Defined in

[index.ts:277](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L277)
#### WriteAllValue

Ƭ **WriteAllValue**\<`Values`\>: [keyof `Values` \| `string`, `unknown`]

Tuple of [key, value] pair.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:261](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L261)
#### WriteFnOptions

Ƭ **WriteFnOptions**\<`Values`\>: \{ `noLiveValidation?`: `boolean` ; `pathsToValidate?`: `string`[]  } & [`ValidateFnOptions`](#validatefnoptions)\<`Values`\>

Options object to change the behavior of the write methods.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:286](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L286)
### Yup Re-Exports

#### ValidateOptions

Ƭ **ValidateOptions**: `YupValidateOptions`

Type imported from the yup library.
It represents the object with all the options that can be passed to the internal yup validation method.

Link to the Yup documentation [https://github.com/jquense/yup](https://github.com/jquense/yup)

#### Defined in

[index.ts:137](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L137)
#### ValidationError

Ƭ **ValidationError**: `YupValidationError`

Type imported from the yup library.
It represents the error object returned when a validation fails.

Link to the Yup documentation [https://github.com/jquense/yup](https://github.com/jquense/yup)

#### Defined in

[index.ts:145](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L145)
#### ValidationSchema

Ƭ **ValidationSchema**\<`Values`\>: `ObjectSchema`\<`Values`\>

Type imported from the yup library.
It represents any validation schema created with the yup.object() method.

Link to the Yup documentation [https://github.com/jquense/yup](https://github.com/jquense/yup)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:129](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L129)
### Deprecated Types

<details>
<summary>Show deprecated types</summary>

#### ClearIsDirty

Ƭ **ClearIsDirty**: () => `void`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[index.ts:199](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L199)
#### ErrorCheckCallback

Ƭ **ErrorCheckCallback**\<`Values`\>: [`CheckErrorCallback`](#checkerrorcallback)\<`Values`\>

**`Deprecated`**

Use [CheckErrorCallback](#checkerrorcallback) instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:175](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L175)
#### ErrorFn

Ƭ **ErrorFn**: (`path`: `string`) => `string` \| `undefined`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (`path`): `string` \| `undefined`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`string` \| `undefined`

#### Defined in

[index.ts:190](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L190)
#### IsDirty

Ƭ **IsDirty**: `boolean`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Defined in

[index.ts:208](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L208)
#### IsFormInvalid

Ƭ **IsFormInvalid**: () => `boolean`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (): `boolean`

##### Returns

`boolean`

#### Defined in

[index.ts:196](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L196)
#### IsFormValid

Ƭ **IsFormValid**: () => `boolean`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (): `boolean`

##### Returns

`boolean`

#### Defined in

[index.ts:193](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L193)
#### LiveValidationFn

Ƭ **LiveValidationFn**: (`path`: `string`) => ``true`` \| `undefined`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (`path`): ``true`` \| `undefined`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

``true`` \| `undefined`

#### Defined in

[index.ts:205](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L205)
#### Object

Ƭ **Object**: `FormbitRecord`

**`Deprecated`**

Use FormbitRecord instead. Renamed to avoid shadowing the global `Object`.

#### Defined in

[index.ts:19](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L19)
#### ResetForm

Ƭ **ResetForm**: () => `void`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[index.ts:202](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L202)
#### SuccessCheckCallback

Ƭ **SuccessCheckCallback**\<`Values`\>: [`CheckSuccessCallback`](#checksuccesscallback)\<`Values`\>

**`Deprecated`**

Use [CheckSuccessCallback](#checksuccesscallback) instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:166](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L166)
#### Writer

Ƭ **Writer**\<`Values`\>: [`FormState`](#formstate)\<`Values`\>

**`Deprecated`**

Use [FormState](#formstate) instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:119](https://github.com/radicalbit/formbit/blob/1136d0a/src/types/index.ts#L119)
</details>
<!-- END_TYPES_DOC -->

## License

MIT © [Radicalbit (https://github.com/radicalbit)]

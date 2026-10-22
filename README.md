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

> **FormbitObject**\<`T`\> = `object`

The object returned by `useFormbit()` and `useFormbitContext()`. Holds the form
state and every method needed to read, mutate and validate the form.

#### Type Parameters

##### T

`T` *extends* [`FormbitValues`](#formbitvalues)

#### Properties

##### check

> **check**: [`Check`](#check)\<`Partial`\<`T`\>\>

Validates `json` against the current schema; returns the errors, or undefined if valid.

##### error

> **error**: (`path`) => `string` \| `undefined`

Returns the error message registered for `path`, if any.

###### Parameters

###### path

`string`

###### Returns

`string` \| `undefined`

##### errors

> **errors**: [`Errors`](#errors)

Error messages registered since the last validation, keyed by the value's dot-path.

###### Example

```ts
form:   { age: 1 }
errors: { age: "Age must be greater than 18" }
```

##### form

> **form**: `Partial`\<`T`\>

The current form values. Partial: fields may be missing until validated.

##### initialize

> **initialize**: [`Initialize`](#initialize-1)\<`T`\>

Re-initializes the form with new initial values.

##### isDirty

> **isDirty**: `boolean`

True once the user has interacted with the form.

##### isFormInvalid

> **isFormInvalid**: () => `boolean`

True if any error is currently registered. Does not run validation.

###### Returns

`boolean`

##### isFormValid

> **isFormValid**: () => `boolean`

True if no errors are currently registered. Does not run validation.

###### Returns

`boolean`

##### liveValidation

> **liveValidation**: (`path`) => `true` \| `undefined`

True if live-validation is active for `path`.

###### Parameters

###### path

`string`

###### Returns

`true` \| `undefined`

##### remove

> **remove**: [`Remove`](#remove-1)\<`T`\>

Removes the value at `path`, sets `isDirty`, then validates `pathsToValidate`
plus every live-validated field.

##### removeAll

> **removeAll**: [`RemoveAll`](#removeall-1)\<`T`\>

Removes every given path, sets `isDirty`, then validates `pathsToValidate`
plus every live-validated field.

##### resetForm

> **resetForm**: () => `void`

Resets form, errors, liveValidation and isDirty back to their initial state.

###### Returns

`void`

##### setError

> **setError**: [`SetError`](#seterror-1)

Sets the error message at `path`.

##### setSchema

> **setSchema**: [`SetSchema`](#setschema-1)\<`T`\>

Replaces the current validation schema.

##### submitForm

> **submitForm**: [`SubmitForm`](#submitform-1)\<`T`\>

Validates the whole form and, if valid, runs the success callback to submit.

##### validate

> **validate**: [`Validate`](#validate-1)\<`T`\>

Validates only `path` (ignores live-validated fields).

##### validateAll

> **validateAll**: [`ValidateAll`](#validateall-1)\<`T`\>

Validates only the given `paths` (ignores live-validated fields).

##### validateForm

> **validateForm**: [`ValidateForm`](#validateform-1)\<`Partial`\<`T`\>\>

Validates the whole form and registers any error.

##### write

> **write**: [`Write`](#write-1)\<`T`\>

Writes `value` at `path`, sets `isDirty`, then validates `pathsToValidate`
plus every live-validated field.

##### writeAll

> **writeAll**: [`WriteAll`](#writeall-1)\<`T`\>

Writes every `[path, value]` pair, sets `isDirty`, then validates
`pathsToValidate` plus every live-validated field.
### Core Types

#### Errors

> **Errors** = `object`

Error messages registered since the last validation, stored as a nested object
that mirrors the shape of the form. Read a single message with `error(path)`.

##### Index Signature

\[`key`: `string`\]: `string` \| [`Errors`](#errors) \| (`string` \| [`Errors`](#errors) \| `undefined`)[] \| `undefined`

##### Example

```ts
form:   { age: 1, friends: [{ name: '' }] }
errors: { age: "Age must be greater than 18", friends: [{ name: "Name is required" }] }
```
#### FormbitValues

> **FormbitValues** = `Record`\<`string`, `unknown`\> & `object`

Base shape of every form handled by formbit: an open record of values, plus an
optional `__metadata` field formbit uses to carry data that must survive a
reset/initialize but must NOT be submitted.

The generic `T` you pass to `useFormbit<T>()` must extend this type.

##### Type Declaration

###### \_\_metadata?

> `optional` **\_\_metadata?**: `Record`\<`string`, `unknown`\>
#### FormState

> **FormState**\<`T`\> = `object`

The whole internal state of the form (everything except the validation schema).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Properties

###### errors

> **errors**: [`Errors`](#errors)

###### form

> **form**: `T`

###### initialValues

> **initialValues**: `T`

###### isDirty

> **isDirty**: `boolean`

###### liveValidation

> **liveValidation**: [`LiveValidation`](#livevalidation-2)
#### LiveValidation

> **LiveValidation** = `Record`\<`string`, `true`\>

Fields currently under live-validation (re-validated on every form change).
A field is added here automatically when it fails a validation. Empty by default.

##### Example

```ts
form:           { age: 1 }
liveValidation: { age: true }
```
### Callback Types

#### CheckErrorCallback

> **CheckErrorCallback**\<`T`\> = (`json`, `inner`, `writer`, `setError`) => `void`

Invoked by `check()` when the given json is invalid.

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### json

[`FormbitValues`](#formbitvalues)

###### inner

[`ValidationError`](#validationerror)[]

###### writer

[`FormState`](#formstate)\<`T`\>

###### setError

[`SetError`](#seterror-1)

##### Returns

`void`
#### CheckSuccessCallback

> **CheckSuccessCallback**\<`T`\> = (`json`, `writer`, `setError`) => `void`

Invoked by `check()` when the given json is valid.

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### json

[`FormbitValues`](#formbitvalues)

###### writer

[`FormState`](#formstate)\<`T`\>

###### setError

[`SetError`](#seterror-1)

##### Returns

`void`
#### ErrorCallback

> **ErrorCallback**\<`T`\> = (`writer`, `setError`) => `void`

Invoked by validation methods when validation fails.

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### writer

[`FormState`](#formstate)\<`T`\>

###### setError

[`SetError`](#seterror-1)

##### Returns

`void`
#### SubmitSuccessCallback

> **SubmitSuccessCallback**\<`T`\> = (`writer`, `setError`, `clearIsDirty`) => `void`

Invoked by `submitForm()` once the whole form is valid — the place to send data
to the backend. `__metadata` is stripped from `writer.form` before this runs.

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### writer

[`FormState`](#formstate)\<`Omit`\<`T`, `"__metadata"`\>\>

###### setError

[`SetError`](#seterror-1)

###### clearIsDirty

() => `void`

##### Returns

`void`
#### SuccessCallback

> **SuccessCallback**\<`T`\> = (`writer`, `setError`) => `void`

Invoked by validation methods when the form (or the validated paths) are valid.

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### writer

[`FormState`](#formstate)\<`T`\>

###### setError

[`SetError`](#seterror-1)

##### Returns

`void`
### Method Types

#### Check

> **Check**\<`T`\> = (`json`, `options?`) => [`ValidationError`](#validationerror)[] \| `undefined`

See [FormbitObject.check](#check-1).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### json

[`FormbitValues`](#formbitvalues)

###### options?

[`CheckFnOptions`](#checkfnoptions)\<`T`\>

##### Returns

[`ValidationError`](#validationerror)[] \| `undefined`
#### Initialize

> **Initialize**\<`T`\> = (`values`) => `void`

See [FormbitObject.initialize](#initialize).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### values

`Partial`\<`T`\>

##### Returns

`void`
#### Remove

> **Remove**\<`T`\> = (`path`, `options?`) => `void`

See [FormbitObject.remove](#remove).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### path

`string`

###### options?

[`WriteFnOptions`](#writefnoptions)\<`T`\>

##### Returns

`void`
#### RemoveAll

> **RemoveAll**\<`T`\> = (`arr`, `options?`) => `void`

See [FormbitObject.removeAll](#removeall).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### arr

`string`[]

###### options?

[`WriteFnOptions`](#writefnoptions)\<`T`\>

##### Returns

`void`
#### SetError

> **SetError** = (`path`, `value`) => `void`

See [FormbitObject.setError](#seterror).

##### Parameters

###### path

`string`

###### value

`string`

##### Returns

`void`
#### SetSchema

> **SetSchema**\<`T`\> = (`newSchema`) => `void`

See [FormbitObject.setSchema](#setschema).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### newSchema

[`ValidationSchema`](#validationschema)\<`T`\>

##### Returns

`void`
#### SubmitForm

> **SubmitForm**\<`T`\> = (`successCallback`, `errorCallback?`, `options?`) => `void`

See [FormbitObject.submitForm](#submitform).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### successCallback

[`SubmitSuccessCallback`](#submitsuccesscallback)\<`T`\>

###### errorCallback?

[`ErrorCallback`](#errorcallback-1)\<`Partial`\<`T`\>\>

###### options?

[`ValidateOptions`](#validateoptions)

##### Returns

`void`
#### Validate

> **Validate**\<`T`\> = (`path`, `options?`) => `void`

See [FormbitObject.validate](#validate).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### path

`string`

###### options?

[`ValidateFnOptions`](#validatefnoptions)\<`T`\>

##### Returns

`void`
#### ValidateAll

> **ValidateAll**\<`T`\> = (`paths`, `options?`) => `void`

See [FormbitObject.validateAll](#validateall).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### paths

`string`[]

###### options?

[`ValidateFnOptions`](#validatefnoptions)\<`T`\>

##### Returns

`void`
#### ValidateForm

> **ValidateForm**\<`T`\> = (`successCallback?`, `errorCallback?`, `options?`) => `void`

See [FormbitObject.validateForm](#validateform).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### successCallback?

[`SuccessCallback`](#successcallback-1)\<`T`\>

###### errorCallback?

[`ErrorCallback`](#errorcallback-1)\<`T`\>

###### options?

[`ValidateOptions`](#validateoptions)

##### Returns

`void`
#### Write

> **Write**\<`T`\> = (`path`, `value`, `options?`) => `void`

See [FormbitObject.write](#write).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### path

keyof `T` \| `string`

###### value

`unknown`

###### options?

[`WriteFnOptions`](#writefnoptions)\<`T`\>

##### Returns

`void`
#### WriteAll

> **WriteAll**\<`T`\> = (`arr`, `options?`) => `void`

See [FormbitObject.writeAll](#writeall).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Parameters

###### arr

[`WriteAllValue`](#writeallvalue)\<`T`\>[]

###### options?

[`WriteFnOptions`](#writefnoptions)\<`T`\>

##### Returns

`void`
### Options Types

#### CheckFnOptions

> **CheckFnOptions**\<`T`\> = `object`

Options accepted by `check()`.

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Properties

###### errorCallback?

> `optional` **errorCallback?**: [`CheckErrorCallback`](#checkerrorcallback)\<`T`\>

###### options?

> `optional` **options?**: [`ValidateOptions`](#validateoptions)

###### successCallback?

> `optional` **successCallback?**: [`CheckSuccessCallback`](#checksuccesscallback)\<`T`\>
#### ValidateFnOptions

> **ValidateFnOptions**\<`T`\> = `object`

Options accepted by the `validate` methods.

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)

##### Properties

###### errorCallback?

> `optional` **errorCallback?**: [`ErrorCallback`](#errorcallback-1)\<`Partial`\<`T`\>\>

###### options?

> `optional` **options?**: [`ValidateOptions`](#validateoptions)

###### successCallback?

> `optional` **successCallback?**: [`SuccessCallback`](#successcallback-1)\<`Partial`\<`T`\>\>
#### WriteAllValue

> **WriteAllValue**\<`T`\> = \[keyof `T` \| `string`, `unknown`\]

A single `[path, value]` pair accepted by `writeAll`.

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)
#### WriteFnOptions

> **WriteFnOptions**\<`T`\> = `object` & [`ValidateFnOptions`](#validatefnoptions)\<`T`\>

Options accepted by the `write`/`remove` methods (validate options plus path control).

##### Type Declaration

###### noLiveValidation?

> `optional` **noLiveValidation?**: `boolean`

###### pathsToValidate?

> `optional` **pathsToValidate?**: `string`[]

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)
### Yup Re-Exports

#### ValidateOptions

> **ValidateOptions** = `YupValidateOptions`

Options forwarded to yup's validation methods. See [https://github.com/jquense/yup](https://github.com/jquense/yup).
#### ValidationError

> **ValidationError** = `YupValidationError`

The error object yup throws when a validation fails. See [https://github.com/jquense/yup](https://github.com/jquense/yup).
#### ValidationSchema

> **ValidationSchema**\<`T`\> = `ObjectSchema`\<`T`\>

A validation schema built with `yup.object()`. See [https://github.com/jquense/yup](https://github.com/jquense/yup).

##### Type Parameters

###### T

`T` *extends* [`FormbitValues`](#formbitvalues)
<!-- END_TYPES_DOC -->

## License

MIT © [Radicalbit (https://github.com/radicalbit)]

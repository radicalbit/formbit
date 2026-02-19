# Formbit

Formbit is a **lightweight React state form library** designed to simplify form management within your applications. With **Formbit**, you can easily handle form state, validate user input, and submit data efficiently.

[![NPM](https://img.shields.io/npm/v/formbit.svg)](https://www.npmjs.com/package/formbit) [![license](https://badgen.net/badge/license/MIT)](./LICENSE)

## Table of contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Features](#features)
- [Abstract](#abstract)
- [Install](#install)
- [Getting started](#getting-started)
- [Local Development](#local-development)
- [Type Aliases](#type-aliases)
  - [Check](#check)
  - [CheckErrorCallback](#checkerrorcallback)
  - [CheckFnOptions](#checkfnoptions)
  - [CheckSuccessCallback](#checksuccesscallback)
  - [ClearIsDirty](#clearisdirty)
  - [ErrorCallback](#errorcallback)
  - [ErrorCheckCallback](#errorcheckcallback)
  - [ErrorFn](#errorfn)
  - [Errors](#errors)
  - [Form](#form)
  - [FormState](#formstate)
  - [FormbitObject](#formbitobject)
  - [FormbitRecord](#formbitrecord)
  - [FormbitValues](#formbitvalues)
  - [GenericCallback](#genericcallback)
  - [InitialValues](#initialvalues)
  - [Initialize](#initialize)
  - [IsDirty](#isdirty)
  - [IsFormInvalid](#isforminvalid)
  - [IsFormValid](#isformvalid)
  - [LiveValidation](#livevalidation)
  - [LiveValidationFn](#livevalidationfn)
  - [Object](#object)
  - [Remove](#remove)
  - [RemoveAll](#removeall)
  - [ResetForm](#resetform)
  - [SetError](#seterror)
  - [SetSchema](#setschema)
  - [SubmitForm](#submitform)
  - [SubmitSuccessCallback](#submitsuccesscallback)
  - [SuccessCallback](#successcallback)
  - [SuccessCheckCallback](#successcheckcallback)
  - [SuccessSubmitCallback](#successsubmitcallback)
  - [Validate](#validate)
  - [ValidateAll](#validateall)
  - [ValidateFnOptions](#validatefnoptions)
  - [ValidateForm](#validateform)
  - [ValidateOptions](#validateoptions)
  - [ValidationError](#validationerror)
  - [ValidationFormbitError](#validationformbiterror)
  - [ValidationSchema](#validationschema)
  - [Write](#write)
  - [WriteAll](#writeall)
  - [WriteAllValue](#writeallvalue)
  - [WriteFnOptions](#writefnoptions)
  - [Writer](#writer)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Features

- Intuitive and easy-to-use form state management.
- Out of the box support for validation with [yup](https://github.com/jquense/yup).
- Support for handling complex forms with dynamic and nested fields.
- Seamless and flexible integration with React.
- Full Typescript support.

## Abstract

The concept behind Formbit is to offer a lightweight library that assists you in managing all aspects of form state and error handling, while allowing you the flexibility to choose how to design the UI. It seamlessly integrates with various UI frameworks such as Antd, MaterialUI, or even plain HTML, as it provides solely a React hook that exposes methods to manage the form's React state. The responsibility of designing the UI remains entirely yours.

## Install

```bash
npm  install  --save  formbit
```

```bash
yarn  add  formbit
```

## Getting started

```jsx
import * as yup from 'yup';
import useFormbit from 'formbit';

const initialValues = { name: undefined, age: undefined };

const schema = yup.object().shape({
  name: yup
    .string()
    .max(25, 'Name max length is 25 characters')
    .required('Name is required'),

  age: yup
    .number()
    .max(120, 'Age must be between 0 and 120')
    .required('Age is required')
});

function Example() {
  const { form, submitForm, write, error, isFormInvalid } = useFormbit({
    initialValues,
    yup: schema
  });

  const handleChangeName = ({ target: { value } }) => { write('name', value); }
  const handleChangeAge = ({ target: { value } }) => { write('age', value); }
  const handleSubmit = () => {
    submitForm(
      (writer) => {
        console.log("Your validated form is: ", writer.form)
      }, 
      (writer) => {
        console.error("The validation errors are: ", writer.errors)
      });
    }

  return (
    <div>
      <label name="name">Name</label>
      <input
        name="name"
        onChange={handleChangeName}
        type="text"
        value={form.name}
      />
      <div>{error('name')}</div>

      <label name="age">Age</label>
      <input
        name="age"
        onChange={handleChangeAge}
        type="number"
        value={form.age}
      />
      <div>{error('age')}</div>

      <button disabled={isFormInvalid()} onClick={handleSubmit} type="button">
        Submit
      </button>
    </div>
  );
}

export default Example;
```

## Local Development
For local development we suggest using [Yalc](https://github.com/wclr/yalc) to test your local version of formbit in your projects.

<!-- START_TYPES_DOC -->
## Type Aliases

### Check

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

[index.ts:216](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L216)

___

### CheckErrorCallback

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

[index.ts:171](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L171)

___

### CheckFnOptions

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

[index.ts:271](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L271)

___

### CheckSuccessCallback

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

[index.ts:162](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L162)

___

### ClearIsDirty

Ƭ **ClearIsDirty**: () => `void`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[index.ts:202](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L202)

___

### ErrorCallback

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

[index.ts:157](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L157)

___

### ErrorCheckCallback

Ƭ **ErrorCheckCallback**\<`Values`\>: [`CheckErrorCallback`](#checkerrorcallback)\<`Values`\>

**`Deprecated`**

Use [CheckErrorCallback](#checkerrorcallback) instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:175](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L175)

___

### ErrorFn

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

[index.ts:193](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L193)

___

### Errors

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

[index.ts:78](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L78)

___

### Form

Ƭ **Form**: [`FormbitValues`](#formbitvalues)

Object containing the updated form.

#### Defined in

[index.ts:55](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L55)

___

### FormState

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

[index.ts:110](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L110)

___

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

[index.ts:300](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L300)

___

### FormbitRecord

Ƭ **FormbitRecord**: `Record`\<`string`, `unknown`\>

Generic object with string keys.

#### Defined in

[index.ts:16](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L16)

___

### FormbitValues

Ƭ **FormbitValues**: \{ `__metadata?`: [`FormbitRecord`](#formbitrecord)  } & [`FormbitRecord`](#formbitrecord)

Base type for form values: a record of string keys with an optional `__metadata` field.

#### Defined in

[index.ts:52](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L52)

___

### GenericCallback

Ƭ **GenericCallback**\<`Values`\>: [`SuccessCallback`](#successcallback)\<`Values`\> \| [`ErrorCallback`](#errorcallback)\<`Values`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:24](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L24)

___

### InitialValues

Ƭ **InitialValues**: [`FormbitValues`](#formbitvalues)

InitialValues used to set up formbit; also used to reset the form to its original version.

#### Defined in

[index.ts:58](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L58)

___

### Initialize

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

[index.ts:220](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L220)

___

### IsDirty

Ƭ **IsDirty**: `boolean`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Defined in

[index.ts:211](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L211)

___

### IsFormInvalid

Ƭ **IsFormInvalid**: () => `boolean`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (): `boolean`

##### Returns

`boolean`

#### Defined in

[index.ts:199](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L199)

___

### IsFormValid

Ƭ **IsFormValid**: () => `boolean`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (): `boolean`

##### Returns

`boolean`

#### Defined in

[index.ts:196](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L196)

___

### LiveValidation

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

[index.ts:103](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L103)

___

### LiveValidationFn

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

[index.ts:208](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L208)

___

### Object

Ƭ **Object**: [`FormbitRecord`](#formbitrecord)

**`Deprecated`**

Use [FormbitRecord](#formbitrecord) instead. Renamed to avoid shadowing the global `Object`.

#### Defined in

[index.ts:19](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L19)

___

### Remove

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

[index.ts:223](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L223)

___

### RemoveAll

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

[index.ts:258](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L258)

___

### ResetForm

Ƭ **ResetForm**: () => `void`

**`Deprecated`**

Inlined into [FormbitObject](#formbitobject).

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[index.ts:205](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L205)

___

### SetError

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

[index.ts:226](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L226)

___

### SetSchema

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

[index.ts:229](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L229)

___

### SubmitForm

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

[index.ts:232](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L232)

___

### SubmitSuccessCallback

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

[index.ts:181](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L181)

___

### SuccessCallback

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

[index.ts:152](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L152)

___

### SuccessCheckCallback

Ƭ **SuccessCheckCallback**\<`Values`\>: [`CheckSuccessCallback`](#checksuccesscallback)\<`Values`\>

**`Deprecated`**

Use [CheckSuccessCallback](#checksuccesscallback) instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:166](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L166)

___

### SuccessSubmitCallback

Ƭ **SuccessSubmitCallback**\<`Values`\>: [`SubmitSuccessCallback`](#submitsuccesscallback)\<`Values`\>

**`Deprecated`**

Use [SubmitSuccessCallback](#submitsuccesscallback) instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:188](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L188)

___

### Validate

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

[index.ts:238](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L238)

___

### ValidateAll

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

[index.ts:241](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L241)

___

### ValidateFnOptions

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

[index.ts:280](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L280)

___

### ValidateForm

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

[index.ts:244](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L244)

___

### ValidateOptions

Ƭ **ValidateOptions**: `YupValidateOptions`

Type imported from the yup library.
It represents the object with all the options that can be passed to the internal yup validation method.

Link to the Yup documentation [https://github.com/jquense/yup](https://github.com/jquense/yup)

#### Defined in

[index.ts:137](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L137)

___

### ValidationError

Ƭ **ValidationError**: `YupValidationError`

Type imported from the yup library.
It represents the error object returned when a validation fails.

Link to the Yup documentation [https://github.com/jquense/yup](https://github.com/jquense/yup)

#### Defined in

[index.ts:145](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L145)

___

### ValidationFormbitError

Ƭ **ValidationFormbitError**: `Pick`\<[`ValidationError`](#validationerror), ``"message"`` \| ``"path"``\>

#### Defined in

[index.ts:29](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L29)

___

### ValidationSchema

Ƭ **ValidationSchema**\<`Values`\>: `ObjectSchema`\<`Values`\>

Type imported from the yup library.
It represents any validation schema created with the yup.object() method.

Link to the Yup documentation [https://github.com/jquense/yup](https://github.com/jquense/yup)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:129](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L129)

___

### Write

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

[index.ts:250](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L250)

___

### WriteAll

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

[index.ts:254](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L254)

___

### WriteAllValue

Ƭ **WriteAllValue**\<`Values`\>: [keyof `Values` \| `string`, `unknown`]

Tuple of [key, value] pair.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:264](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L264)

___

### WriteFnOptions

Ƭ **WriteFnOptions**\<`Values`\>: \{ `noLiveValidation?`: `boolean` ; `pathsToValidate?`: `string`[]  } & [`ValidateFnOptions`](#validatefnoptions)\<`Values`\>

Options object to change the behavior of the write methods.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:289](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L289)

___

### Writer

Ƭ **Writer**\<`Values`\>: [`FormState`](#formstate)\<`Values`\>

**`Deprecated`**

Use [FormState](#formstate) instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:119](https://github.com/radicalbit/formbit/blob/676b526/src/types/index.ts#L119)

<!-- END_TYPES_DOC -->

## License

MIT © [Radicalbit (https://github.com/radicalbit)]

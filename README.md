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
  - [CheckFnOptions](#checkfnoptions)
  - [ClearIsDirty](#clearisdirty)
  - [ErrorCallback](#errorcallback)
  - [ErrorCheckCallback](#errorcheckcallback)
  - [ErrorFn](#errorfn)
  - [Errors](#errors)
  - [Form](#form)
  - [FormbitObject](#formbitobject)
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
  - [ResetForm](#resetform)
  - [SetError](#seterror)
  - [SetSchema](#setschema)
  - [SubmitForm](#submitform)
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

  const handleChangeName = ({ target: { value } }) => write('name', value);
  const handleChangeAge = ({ target: { value } }) => write('age', value);
  const onSubmit = () => console.log('Form Submitted!');
  const onError = () => console.error('Form is invalid');
  const handleSubmit = () => submitForm(onSubmit, onError);

  return (
    <>
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
    </>
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

Checks the given json against the form schema and returns and array of errors.
It returns undefined if the json is valid.

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

[index.ts:14](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L14)

___

### CheckFnOptions

Ƭ **CheckFnOptions**\<`Values`\>: `Object`

Options object to change the behavior of the check method

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorCallback?` | [`ErrorCheckCallback`](#errorcheckcallback)\<`Values`\> |
| `options?` | [`ValidateOptions`](#validateoptions) |
| `successCallback?` | [`SuccessCheckCallback`](#successcheckcallback)\<`Values`\> |

#### Defined in

[index.ts:302](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L302)

___

### ClearIsDirty

Ƭ **ClearIsDirty**: () => `void`

Reset isDirty value to false

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[index.ts:20](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L20)

___

### ErrorCallback

Ƭ **ErrorCallback**\<`Values`\>: (`writer`: [`Writer`](#writer)\<`Values`\>, `setError`: [`SetError`](#seterror)) => `void`

Invoked in case of errors raised by validation

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`writer`, `setError`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `writer` | [`Writer`](#writer)\<`Values`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:25](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L25)

___

### ErrorCheckCallback

Ƭ **ErrorCheckCallback**\<`Values`\>: (`json`: [`Form`](#form), `inner`: [`ValidationError`](#validationerror)[], `writer`: [`Writer`](#writer)\<`Values`\>, `setError`: [`SetError`](#seterror)) => `void`

Invoked in case of errors raised by validation of check method

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
| `writer` | [`Writer`](#writer)\<`Values`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:31](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L31)

___

### ErrorFn

Ƭ **ErrorFn**: (`path`: `string`) => `string` \| `undefined`

Returns the error message for the given path if any.
It doesn't trigger any validation

#### Type declaration

▸ (`path`): `string` \| `undefined`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`string` \| `undefined`

#### Defined in

[index.ts:39](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L39)

___

### Errors

Ƭ **Errors**: `Record`\<`string`, `string`\>

Object including all the registered errors messages since the last validation.
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

[index.ts:60](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L60)

___

### Form

Ƭ **Form**: \{ `__metadata?`: [`Object`](#object)  } & [`Object`](#object)

Object containing the updated form

#### Defined in

[index.ts:65](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L65)

___

### FormbitObject

Ƭ **FormbitObject**\<`Values`\>: `Object`

Object returned by useFormbit() and useFormbitContextHook()
It contains all the data and methods needed to handle the form.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `check` | [`Check`](#check)\<`Partial`\<`Values`\>\> | Checks the given json against the form schema and returns and array of errors. It returns undefined if the json is valid. |
| `error` | [`ErrorFn`](#errorfn) | Returns the error message for the given path if any. It doesn't trigger any validation |
| `errors` | [`Errors`](#errors) | Object including all the registered errors messages since the last validation. Errors are stored using the same path of the corresponding form values. **`Example`** If the form object has this structure: ```json { "age": 1 } ``` and age is a non valid field, errors object will look like this ```json { "age": "Age must be greater then 18" } ``` |
| `form` | `Partial`\<`Values`\> | Object containing the updated form |
| `initialize` | [`Initialize`](#initialize)\<`Values`\> | Initialize the form with new initial values |
| `isDirty` | `boolean` | Returns true if the form is Dirty (user already interacted with the form), false otherwise. |
| `isFormInvalid` | [`IsFormInvalid`](#isforminvalid) | Returns true if the form is NOT valid It doesn't perform any validation, it checks if any errors are present |
| `isFormValid` | [`IsFormValid`](#isformvalid) | Returns true id the form is valid It doesn't perform any validation, it checks if any errors are present |
| `liveValidation` | [`LiveValidationFn`](#livevalidationfn) | Returns true if live validation is active for the given path |
| `remove` | [`Remove`](#remove)\<`Values`\> | This method updates the form state deleting value, setting isDirty to true. After writing, it validates all the paths contained into pathsToValidate (if any) and all the fields that have the live validation active. |
| `resetForm` | [`ResetForm`](#resetform) | Reset form to the initial state. Errors and liveValidation are set back to empty objects. isDirty is set back to false |
| `setError` | [`SetError`](#seterror) | Set a message(value) to the given error path. |
| `setSchema` | [`SetSchema`](#setschema)\<`Values`\> | Override the current schema with the given one. |
| `submitForm` | [`SubmitForm`](#submitform)\<`Values`\> | Perform a validation against the current form object, and execute the successCallback if the validation pass otherwise it executes the errorCallback |
| `validate` | [`Validate`](#validate)\<`Values`\> | This method only validate the specified path. Do not check for fields that have the live validation active. |
| `validateAll` | [`ValidateAll`](#validateall)\<`Values`\> | This method only validate the specified paths. Do not check for fields that have the live validation active. |
| `validateForm` | [`ValidateForm`](#validateform)\<`Partial`\<`Values`\>\> | This method validates the entire form and set the corresponding errors if any. |
| `write` | [`Write`](#write)\<`Values`\> | This method update the form state writing $value into the $path, setting isDirty to true. After writing, it validates all the paths contained into $pathsToValidate (if any) and all the fields that have the live validation active. |
| `writeAll` | [`WriteAll`](#writeall)\<`Values`\> | This method takes an array of [path, value] and update the form state writing all those values into the specified paths. It set isDirty to true. After writing, it validate all the paths contained into $pathToValidate and all the fields that have the live validation active. |

#### Defined in

[index.ts:341](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L341)

___

### GenericCallback

Ƭ **GenericCallback**\<`Values`\>: [`SuccessCallback`](#successcallback)\<`Values`\> \| [`ErrorCallback`](#errorcallback)\<`Values`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:67](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L67)

___

### InitialValues

Ƭ **InitialValues**: \{ `__metadata?`: [`Object`](#object)  } & [`Object`](#object)

InitialValues used to setup formbit, used also to reset the form to the original version.

#### Defined in

[index.ts:77](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L77)

___

### Initialize

Ƭ **Initialize**\<`Values`\>: (`values`: `Partial`\<`Values`\>) => `void`

Initialize the form with new initial values

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

[index.ts:71](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L71)

___

### IsDirty

Ƭ **IsDirty**: `boolean`

Returns true if the form is Dirty (user already interacted with the form), false otherwise.

#### Defined in

[index.ts:83](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L83)

___

### IsFormInvalid

Ƭ **IsFormInvalid**: () => `boolean`

Returns true if the form is NOT valid
It doesn't perform any validation, it checks if any errors are present

#### Type declaration

▸ (): `boolean`

##### Returns

`boolean`

#### Defined in

[index.ts:89](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L89)

___

### IsFormValid

Ƭ **IsFormValid**: () => `boolean`

Returns true id the form is valid
It doesn't perform any validation, it checks if any errors are present

#### Type declaration

▸ (): `boolean`

##### Returns

`boolean`

#### Defined in

[index.ts:95](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L95)

___

### LiveValidation

Ƭ **LiveValidation**: `Record`\<`string`, ``true``\>

Object including all the values that are being live validated.
Usually fields that fail validation (using one of the method that triggers validation)
will automatically set to be live-validated.

A value/path is live-validated when validated at every change of the form.

By default no field is live-validated

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
  "age": "Age must be greater then 18"
}
```

#### Defined in

[index.ts:121](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L121)

___

### LiveValidationFn

Ƭ **LiveValidationFn**: (`path`: `string`) => ``true`` \| `undefined`

Returns true if live validation is active for the given path

#### Type declaration

▸ (`path`): ``true`` \| `undefined`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

``true`` \| `undefined`

#### Defined in

[index.ts:127](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L127)

___

### Object

Ƭ **Object**: `Record`\<`string`, `unknown`\>

Generic object with string as keys

#### Defined in

[index.ts:133](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L133)

___

### Remove

Ƭ **Remove**\<`Values`\>: (`path`: `string`, `options?`: [`WriteFnOptions`](#writefnoptions)\<`Values`\>) => `void`

This method updates the form state deleting value and set isDirty to true.

After writing, it validates all the paths contained into pathsToValidate (if any)
and all the fields that have the live validation active.

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

[index.ts:152](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L152)

___

### ResetForm

Ƭ **ResetForm**: () => `void`

Reset form to the initial state.
Errors and liveValidation are set back to empty objects.
isDirty is set back to false

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[index.ts:160](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L160)

___

### SetError

Ƭ **SetError**: (`path`: `string`, `value`: `string`) => `void`

Set a message(value) to the given error path.

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

[index.ts:175](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L175)

___

### SetSchema

Ƭ **SetSchema**\<`Values`\>: (`newSchema`: [`ValidationSchema`](#validationschema)\<`Values`\>) => `void`

Override the current schema with the given one.

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

[index.ts:181](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L181)

___

### SubmitForm

Ƭ **SubmitForm**\<`Values`\>: (`successCallback`: [`SuccessSubmitCallback`](#successsubmitcallback)\<`Values`\>, `errorCallback?`: [`ErrorCallback`](#errorcallback)\<`Partial`\<`Values`\>\>, `options?`: [`ValidateOptions`](#validateoptions)) => `void`

Perform a validation against the current form object, and execute the successCallback if the validation pass
otherwise it executes the errorCallback

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Type declaration

▸ (`successCallback`, `errorCallback?`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `successCallback` | [`SuccessSubmitCallback`](#successsubmitcallback)\<`Values`\> |
| `errorCallback?` | [`ErrorCallback`](#errorcallback)\<`Partial`\<`Values`\>\> |
| `options?` | [`ValidateOptions`](#validateoptions) |

##### Returns

`void`

#### Defined in

[index.ts:188](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L188)

___

### SuccessCallback

Ƭ **SuccessCallback**\<`Values`\>: (`writer`: [`Writer`](#writer)\<`Values`\>, `setError`: [`SetError`](#seterror)) => `void`

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
| `writer` | [`Writer`](#writer)\<`Values`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:197](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L197)

___

### SuccessCheckCallback

Ƭ **SuccessCheckCallback**\<`Values`\>: (`json`: [`Form`](#form), `writer`: [`Writer`](#writer)\<`Values`\>, `setError`: [`SetError`](#seterror)) => `void`

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
| `writer` | [`Writer`](#writer)\<`Values`\> |
| `setError` | [`SetError`](#seterror) |

##### Returns

`void`

#### Defined in

[index.ts:203](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L203)

___

### SuccessSubmitCallback

Ƭ **SuccessSubmitCallback**\<`Values`\>: (`writer`: [`Writer`](#writer)\<`Values` \| `Omit`\<`Values`, ``"__metadata"``\>\>, `setError`: [`SetError`](#seterror), `clearIsDirty`: [`ClearIsDirty`](#clearisdirty)) => `void`

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
| `writer` | [`Writer`](#writer)\<`Values` \| `Omit`\<`Values`, ``"__metadata"``\>\> |
| `setError` | [`SetError`](#seterror) |
| `clearIsDirty` | [`ClearIsDirty`](#clearisdirty) |

##### Returns

`void`

#### Defined in

[index.ts:211](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L211)

___

### Validate

Ƭ **Validate**\<`Values`\>: (`path`: `string`, `options?`: [`ValidateFnOptions`](#validatefnoptions)\<`Values`\>) => `void`

This method only validate the specified path. Do not check for fields that have the
live validation active.

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

[index.ts:222](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L222)

___

### ValidateAll

Ƭ **ValidateAll**\<`Values`\>: (`paths`: `string`[], `options?`: [`ValidateFnOptions`](#validatefnoptions)\<`Values`\>) => `void`

This method only validate the specified paths. Do not check for fields that have the
live validation active.

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

[index.ts:229](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L229)

___

### ValidateFnOptions

Ƭ **ValidateFnOptions**\<`Values`\>: `Object`

Options object to change the behavior of the validate methods

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

[index.ts:312](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L312)

___

### ValidateForm

Ƭ **ValidateForm**\<`Values`\>: (`successCallback?`: [`SuccessCallback`](#successcallback)\<`Values`\>, `errorCallback?`: [`ErrorCallback`](#errorcallback)\<`Values`\>, `options?`: [`ValidateOptions`](#validateoptions)) => `void`

This method validates the entire form and set the corresponding errors if any.

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

[index.ts:235](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L235)

___

### ValidateOptions

Ƭ **ValidateOptions**: `YupValidateOptions`

Type imported from the yup library.
It represents the object with all the options that can be passed to the internal yup validation method,

Link to the Yup documentation [https://github.com/jquense/yup](https://github.com/jquense/yup)

#### Defined in

[index.ts:249](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L249)

___

### ValidationError

Ƭ **ValidationError**: `YupValidationError`

Type imported from the yup library.
It represents the error object returned when a validation fails

Link to the Yup documentation [https://github.com/jquense/yup](https://github.com/jquense/yup)

#### Defined in

[index.ts:325](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L325)

___

### ValidationFormbitError

Ƭ **ValidationFormbitError**: `Pick`\<[`ValidationError`](#validationerror), ``"message"`` \| ``"path"``\>

#### Defined in

[index.ts:240](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L240)

___

### ValidationSchema

Ƭ **ValidationSchema**\<`Values`\>: `ObjectSchema`\<`Values`\>

Type imported from the yup library.
It represents any validation schema created with the yup.object() method

Link to the Yup documentation [https://github.com/jquense/yup](https://github.com/jquense/yup)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:169](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L169)

___

### Write

Ƭ **Write**\<`Values`\>: (`path`: keyof `Values` \| `string`, `value`: `unknown`, `options?`: [`WriteFnOptions`](#writefnoptions)\<`Values`\>) => `void`

This method update the form state writing $value into the $path, setting isDirty to true.

After writing, it validates all the paths contained into $pathsToValidate (if any)
and all the fields that have the live validation active.

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

[index.ts:258](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L258)

___

### WriteAll

Ƭ **WriteAll**\<`Values`\>: (`arr`: [`WriteAllValue`](#writeallvalue)\<`Values`\>[], `options?`: [`WriteFnOptions`](#writefnoptions)\<`Values`\>) => `void`

This method takes an array of [path, value] and update the form state writing
all those values into the specified paths.

It set isDirty to true.

After writing, it validate all the paths contained into $pathToValidate and all
the fields that have the live validation active.

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

[index.ts:271](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L271)

___

### WriteAllValue

Ƭ **WriteAllValue**\<`Values`\>: [keyof `Values` \| `string`, `unknown`]

Tuple of [key, value] pair.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:278](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L278)

___

### WriteFnOptions

Ƭ **WriteFnOptions**\<`Values`\>: \{ `noLiveValidation?`: `boolean` ; `pathsToValidate?`: `string`[]  } & [`ValidateFnOptions`](#validatefnoptions)\<`Values`\>

Options object to change the behavior of the write methods

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends [`InitialValues`](#initialvalues) |

#### Defined in

[index.ts:331](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L331)

___

### Writer

Ƭ **Writer**\<`Values`\>: `Object`

Internal form state storing all the data of the form (except the validation schema)

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
| `isDirty` | [`IsDirty`](#isdirty) |
| `liveValidation` | [`LiveValidation`](#livevalidation) |

#### Defined in

[index.ts:290](https://github.com/radicalbit/formbit/blob/b189a1d/src/types/index.ts#L290)

<!-- END_TYPES_DOC -->

## License

MIT © [Radicalbit (https://github.com/radicalbit)]

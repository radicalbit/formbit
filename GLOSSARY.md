# Formbit

Formbit is a lightweight React form-state library: it holds what the user has entered, validates it against a yup schema, and tracks which errors to show.

## Language

### Values

**Form values**:
What the user has entered so far, exposed as `form`. May be incomplete until the form is valid.
_Avoid_: data, model, form data

**Initial values**:
The form values the form starts from and that a reset returns to; replaced by `initialize`.
_Avoid_: defaults

**Metadata**:
Data that travels with the form under `__metadata` — e.g. the current step of a multi-step form. It survives `initialize` and is never submitted.
_Avoid_: hidden fields, extra state

**Form state**:
Everything formbit tracks for one form: form values, initial values, errors, live validation and the dirty flag. Callbacks receive it as their `writer` argument.
_Avoid_: writer (outside the callback parameter name), store

**Dirty**:
True once the form values have been changed by a write or remove since the last `initialize`, `resetForm` or `clearIsDirty`.
_Avoid_: touched, modified

### Validation

**Validate**:
Run the schema on some paths of the form values (or on all of them) and record the resulting errors in the form state.
_Avoid_: check (it means something else here)

**Check**:
Run the schema on any JSON and return the errors without recording anything in the form state.
_Avoid_: validate, dry run

**Live validation**:
The state of a path that failed a validation once and is therefore re-validated on every write. It is tied to the path, not to the value or the array item at that path.
_Avoid_: on-change validation, eager validation

**Error**:
A message recorded under a path of the form values, coming from the schema or set by hand.

**Silent error**:
An error recorded under the reserved `silent` key — typically a backend message. It is shown to the user but never produced by the schema, does not make the form invalid, and is cleared by every whole-form validation, submit, reset and initialize.
_Avoid_: server error, global error, backend error (as a term)

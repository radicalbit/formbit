// Checks that the built package can be loaded with import in plain Node.
// The default import of a CJS build is the whole exports object in Node, so
// the hook is checked through its named export.
import assert from 'node:assert'
import { useFormbit, FormbitContextProvider, useFormbitContext } from '../dist/index.js'

assert.strictEqual(typeof useFormbit, 'function', 'useFormbit is not a function')
assert.strictEqual(typeof FormbitContextProvider, 'function', 'FormbitContextProvider is not a function')
assert.strictEqual(typeof useFormbitContext, 'function', 'useFormbitContext is not a function')

console.log('smoke-dist.mjs: ok')

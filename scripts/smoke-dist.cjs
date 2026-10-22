// Checks that the built package can be loaded with require() in plain Node.
const assert = require('node:assert')
const formbit = require('../dist/index.js')

assert.strictEqual(typeof formbit.default, 'function', 'default export (useFormbit) is not a function')
assert.strictEqual(typeof formbit.useFormbit, 'function', 'useFormbit is not a function')
assert.strictEqual(typeof formbit.FormbitContextProvider, 'function', 'FormbitContextProvider is not a function')
assert.strictEqual(typeof formbit.useFormbitContext, 'function', 'useFormbitContext is not a function')

console.log('smoke-dist.cjs: ok')

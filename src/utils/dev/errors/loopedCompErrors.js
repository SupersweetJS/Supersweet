import { createError } from '../utils/createError'
import { angularCompName } from '../utils/angularName'
import { toJSON } from '../utils/toJSON'
import { getCodeWithError } from '../utils/code'

/**
 * called when looped components are given non-unique key attribute
 * @param {Comp} comp
 * @param {string[]} keys
 * @returns {Error}
 */

export const keys_not_unique = (comp, keys) => {

  const nonUniqueKeys = keys.filter((key, i) => {
    return keys.indexOf(key, i) !== keys.lastIndexOf(key)
  })

  const _keys = keys.map(toJSON).join(', ')
  const nonUniqueKeysJoin = nonUniqueKeys.map(toJSON).join(', ')
  const _s = nonUniqueKeys.length > 1 ? 's' : ''

  const issue = `\
non-unique key${_s} used in ${angularCompName(comp)}

keys used: \n${_keys}

non-unique key${_s}: ${nonUniqueKeysJoin}`

  const fix = 'make sure that all keys are unique'

  console.log('keys: ', keys)
  console.log('non unique Keys: ', nonUniqueKeys)

  const errorCode = getCodeWithError(comp, /\*key=/)

  // @TODO improve the regex
  return createError(issue, fix, comp, errorCode, keys_not_unique.name)
}

/**
 * called when a key attribute is not a placeholder on a looped component
 * @param {Comp} comp
 * @param {Comp} parentComp
 * @returns {Error}
 */
export const hardcoded_keys = (comp, parentComp) => {

  const issue = `"*key" attribute on ${angularCompName(comp)} in ${angularCompName(parentComp)} is hard-coded`

  const fix = `\
make sure you are using a placeholder on "*key" attribute's value.

Example:

✔ *key='[foo]'
✖ *key='foo'`

  const errorCode = getCodeWithError(comp, /\*key=/)
  return createError(issue, fix, comp, errorCode, hardcoded_keys.name)
}

/**
 * called when key attribute is not specified on looped component
 * @param {Comp} comp
 * @param {Comp} parentComp
 * @returns {Error}
 */
export const missing_key_attribute = (comp, parentComp) => {

  const issue = `"*key" attribute is missing on looped component ${angularCompName(comp)} in ${angularCompName(parentComp)}`

  const fix = '*key attribute is required on a looped component for efficient and correct updates'

  const errorCode = getCodeWithError(parentComp, new RegExp(`<${comp._compFnName}`))

  return createError(issue, fix, comp, errorCode, missing_key_attribute.name)
}

/**
 * called when looping attribute *for is given invalid value
 * @param {Comp} comp
 * @param {Comp} parentComp
 * @returns {Error}
 */
export const invalid_for_attribute = (comp, parentComp) => {

  const issue = `Invalid for attribute value on ${angularCompName(comp)} in ${angularCompName(parentComp)}`

  const fix = `\
make sure you are following this pattern:
*for='(item, index) in items'
or
*for='item in items'`

  const errorCode = getCodeWithError(parentComp, /\*for=/)

  return createError(issue, fix, comp, errorCode, invalid_for_attribute.name)
}

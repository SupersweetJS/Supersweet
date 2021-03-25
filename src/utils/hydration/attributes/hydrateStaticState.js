/**
 * add attribute on target element in context of comp
 * @param {import('types/dom').Comp} target
 * @param {import('types/parsed').Attribute_ParseInfo} attribute
 */

export const hydrateStaticState = (target, attribute) => {
  target.$[attribute._name] = /** @type {string}*/(attribute._placeholder)
}

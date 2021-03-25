/**
 * add reference to element on comp.refs
 * @param {import('types/dom').Parsed_HTMLElement} element
 * @param {import('types/parsed').Attribute_ParseInfo} attribute
 * @param {import('types/dom').Comp} comp
 */
export const hydrateRef = (element, attribute, comp) => {
  const refName = /** @type {string}*/(attribute._placeholder)
  comp.refs[refName] = element
}

import { data } from '../data'
import { flushArray } from '../others'
import { parse } from '../parse/parseNode'
import { dashifyComponentNames } from '../string/dashify'

/**
 * create template and parse it
 * @param {CompDef} compDef
 */

export const createCompTemplate = (compDef) => {

  const { components, html, css, _template } = compDef

  // replace compName with elName in html
  const dashHtml = components
    ? dashifyComponentNames(html, components)
    : html

  // fill template innerHTML with html and css
  const { defaultStyle } = data._config

  const defaultStyleTag = defaultStyle ? style(defaultStyle, 'default') : ''
  const scopedStyleTag = css ? style(css, 'scoped') : ''

  _template.innerHTML = dashHtml + defaultStyleTag + scopedStyleTag

  /** @type {Function[]} */
  const deferredParsingWork = []

  parse(_template.content, compDef, deferredParsingWork)

  flushArray(deferredParsingWork)

}

/**
   * return a inline style
   * @param {string} s
   * @param {string} name
   */
const style = (s, name) => `<style ${name}>${s}</style>`
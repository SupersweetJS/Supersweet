import { createError } from '../utils/createError'

/**
 * called when root element <app> is not added in html
 * @param {string} elName
 * @returns {Error}
 */

export const root_not_found_in_html = (elName) => {
  const element = `<${elName}> </${elName}>`
  const issue = `Missing root element ${element} in document`

  const fix = `make sure that ${element} is present in html document`

  return createError(issue, fix, null, '', root_not_found_in_html.name)
}
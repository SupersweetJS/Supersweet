import { data } from '../data'

/**
 * call this function to show that given node is updated
 * @param {ParsedDOMElement} node
 */
export const nodeUpdated = (node) => {
  if (data._onNodeUpdate) data._onNodeUpdate(node)
}
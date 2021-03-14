import { PARSED, TEXT } from '../constants.js'
import split from '../string/split.js'

/** @typedef {import('../types').parsedText} parsedText */

/**
 *
 * @param {Text} node
 * @param {Array<Function>} deferred
 * @returns
 */
const parseTextNode = (node, deferred) => {
  const text = node.textContent || ''
  const trimmedText = text.trim()

  // if the node is only empty string, it will be normalized by DOM, so remove it
  if (!trimmedText) {
    deferred.push(() => node.remove())
    return
  }

  const parts = split(text)

  /** @type {Array<parsedText>} */
  const textNodes = []

  // for each part create a text node
  // if it's not TEXT type, save the part info in parsed.placeholder
  parts.forEach(part => {
    /** @type {parsedText} */
    const textNode = document.createTextNode(part.content)
    if (part.type !== TEXT) textNode[PARSED] = { placeholder: part }
    textNodes.push(textNode)
  })

  // replace the original node with new textNodes
  deferred.push(() => {
    textNodes.forEach(textNode => node.before(textNode))
    node.remove()
  })
}

export default parseTextNode

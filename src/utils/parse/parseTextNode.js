import { split } from '../string/split.js'

/**
 * parse text node
 * @param {Text} node
 * @param {Function[]} deferred
 * @param {Comp} comp
 */
export const parseTextNode = (node, deferred, comp) => {
  const text = node.textContent || ''
  const trimmedText = text.trim()

  // if the node is only empty string, it will be normalized by DOM, so remove it
  if (!trimmedText) {
    deferred.push(() => node.remove())
    return
  }

  const parts = split(comp, text)

  /** @type {Parsed_Text[]} */
  const textNodes = []

  // for each part create a text node
  // if it's not TEXT type, save the part info in parsed.placeholder
  parts.forEach(part => {

    let textNode
    if (typeof part === 'string') {
      textNode = document.createTextNode(part)
    } else {
      textNode = document.createTextNode(part._content);
      /** @type {Parsed_Text} */(textNode)._parsedInfo = {
        _placeholder: part
      }
    }

    // @ts-expect-error
    textNodes.push(textNode)
  })

  // replace the original node with new textNodes
  deferred.push(() => {
    textNodes.forEach(textNode => node.before(textNode))
    node.remove()
  })
}

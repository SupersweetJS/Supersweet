import { TEXT } from '../constants.js'
import split from '../string/split.js'

function sweetifyTextNode (comp, node) {
  const placeholders = split(comp, node.textContent.trim())
  const textNodes = []

  placeholders.forEach(placeholder => {
    let textNode

    if (placeholder.type === TEXT) {
      textNode = document.createTextNode(placeholder.text)
    } else {
      textNode = document.createTextNode('')
      textNode.sweet = { placeholder }
    }

    textNodes.push(textNode)
  })

  // after all memoization is done, replace the node with textNodes
  comp.delayedPreprocesses.push(() => {
    textNodes.forEach(t => node.before(t))
    node.remove()
  })
}

export default sweetifyTextNode

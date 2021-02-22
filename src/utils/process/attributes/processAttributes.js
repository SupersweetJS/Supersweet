import bindInput from './bindInput.js'
import addAttribute from './addAttribute.js'
import addEvent from './addEvent.js'
import { EVENT, BIND } from '../../constants.js'

function processAttributes (nue, node) {
  // refs API
  if (node.hasAttribute('ref')) {
    nue.refs[node.getAttribute('ref')] = node
    node.removeAttribute('ref')
  }

  const { parsed } = node

  // if no attributes memo available for node
  if (!parsed.attributes) return

  parsed.attributes.forEach(attribute => {
    const { type } = attribute
    if (type === EVENT) addEvent(nue, node, attribute)

    // bind placeholder
    else if (type === BIND) bindInput(nue, node, attribute)

    // placeholder attribute on non-component
    else addAttribute(nue, node, attribute)
  })
}

export default processAttributes

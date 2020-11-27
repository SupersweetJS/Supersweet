import getValue, { getSlice } from '../value.js'
import onStateChange from '../state/onStateChange.js'
import addContextDependency from '../context.js'

// get the value from context / state
// if the value is taken from context - save the context dependency
// if the value is taken from state - add state dependency
function bindAttribute (node, atrName, atrKey, context) {
  const [value, isStateKey] = getValue.call(this, atrKey, context)
  // if value is taken from context
  node.setAttribute(atrName, value)
  if (isStateKey) {
    onStateChange.call(this, atrKey, () => {
      node.setAttribute(atrName, getSlice.call(this, atrKey))
    })
  } else {
    addContextDependency(node, {
      type: 'attribute',
      name: atrName,
      key: atrKey
    })
  }
}
export default bindAttribute
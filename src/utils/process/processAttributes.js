// import attrs from '../attrs.js'
import bindInput from '../bind/bindInput.js'
import bindAttribute from '../bind/bindAttribute.js'
import bindState from '../bind/bindState.js'

function processEventAttributes (node, attribute) {
  const action = this.actions[attribute.eventName]
  const handler = this.handle[attribute.handler]

  // @customEvent=[handler] action API
  if (action) {
    const cleanup = action(node, handler)
    node.onRemove = cleanup
    this.on.remove(cleanup)
  }

  // @nativeEvent=[handler]
  else {
    node.addEventListener(attribute.eventName, handler)
    const cleanup = () => node.removeEventListener(attribute.eventName, handler)
    this.on.remove(cleanup)
    // node.onRemove(cleanup)
  }
}

function processAttributes (node, savedOn) {
  // console.log(node.nodeName, node.getAttribute)
  const ref = node.getAttribute('ref')
  if (ref) {
    this.config.refs[ref] = node
  }

  const info = savedOn
  if (!(info && info.attributes)) return

  info.attributes.forEach(attribute => {
    // @eventName={handler}
    if (attribute.eventName) {
      processEventAttributes.call(this, node, attribute)
    }
    // bind value on input nodes or bind a prop to custom component
    else if (attribute.bindProp) {
      if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') {
        bindInput.call(this, node, attribute.bindProp, attribute.stateChain)
      }

      // bind:bindProp={key} on custom component
      else {
        bindState.call(this, node, attribute.bindProp, true, attribute.stateChain, true)
      }
    }

    // :name={var} or :name=value set the state of component
    else if (attribute.propName) {
      bindState.call(this, node, attribute.propName, attribute.isVar, attribute.stateChain)
    }

    // set value of simple attributes to state
    else {
      bindAttribute.call(this, node, attribute.name, attribute.stateChain)
    }
  })
}

export default processAttributes

import { mutate } from '../../reactivity/mutate.js'
import wire from '../../connection/wire.js'

// ex: :value=[count]
const bindInput = (nue, node, attribute) => {
  const isNumber = node.type === 'number' || node.type === 'range'
  const { getValue, deps } = attribute.value
  const { name } = attribute

  const setProp = () => {
    node[name] = getValue(nue, node)
  }

  const setText = () => {
    node.textContent = getValue(nue, node)
  }

  const addHandler = (handler) => {
    const { onMount, onDestroy } = nue.events
    onMount(() => node.addEventListener('input', handler))
    onDestroy(() => node.removeEventListener('input', handler))
  }

  if (node.matches('[contenteditable]')) {
    const handler = () => mutate(nue.$, deps[0], node.textContent)
    addHandler(handler)
    wire(nue, node, deps, setText)
    return // must return
  }

  if (node.matches('input, textarea')) {
    const handler = () => {
      let value = node[name]
      value = isNumber ? Number(value) : value
      mutate(nue.$, deps[0], value)
    }

    addHandler(handler)
  }

  wire(nue, node, deps, setProp)
}

export default bindInput

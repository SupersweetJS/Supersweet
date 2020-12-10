import { mutate } from '../../reactivity/mutate.js'
import add_slice_dependency from '../../slice/add_slice_dependency.js'
import slice from '../../slice/slice.js'

// bind:value=[path], bind:checked=[path] etc
// set the value from state
// when input's value change set the value in state
function process_bind_attribute (node, info) {
  const isNumber = node.type === 'number' || node.type === 'range'
  const { path } = info.placeholder
  const { name } = info
  const value = slice(this.$, path)
  if (value === undefined) return
  node[name] = value

  // when input's value is changed, save the value in state
  // convert the value from string to number if needed
  const handler = e => {
    const value = e.currentTarget[name]
    const converted = isNumber ? Number(value) : value
    mutate(this.$, path, converted, 'set')
  }

  // set the value of input from state
  add_slice_dependency.call(this, path, () => {
    node[name] = slice(this.$, path)
  })

  // adding event listener
  node.addEventListener('input', handler)

  // cleanup on node or component removal
  const cleanup = () => node.removeEventListener('input', handler)
  this.on.remove(cleanup)
  node.onRemove = cleanup
}

export default process_bind_attribute
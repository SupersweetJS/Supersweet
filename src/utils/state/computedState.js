import { mutate } from '../reactivity/mutate.js'
import addDep, { addDeps } from './addDep.js'
import detectStateUsage from './detectStateUsage.js'

// when initializing the state, if a function is given
// call that function, detect the state keys it depends on, get the initial value
// update its value whenever its deps changes

function computedState (comp, fn, k) {
  const [initValue, paths] = detectStateUsage(fn)

  const compute = () => {
    const value = fn()
    mutate(comp.$, [k], value)
  }

  // when root of path changes value, recompute
  const deps = paths.map(path => [path[0]])
  addDeps(comp, deps, compute, 'computed')
  // paths.forEach(path => addDep(comp, [path[0]], compute, 'computed'))

  return initValue
}

export default computedState

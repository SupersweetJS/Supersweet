import { subscribeMultiple } from '../subscription/subscribe.js'
import { errors } from '../dev/errors/index.js'

/**
 * add lifecycle hooks to comp
 * @param {Comp} comp
 */
export const addHooks = (comp) => {
  comp._hookCbs = {
    _onMount: [],
    _onDestroy: [],
    _beforeUpdate: [],
    _afterUpdate: []
  }

  comp.hooks = {
    onMount: (cb) => comp._hookCbs._onMount.push(cb),
    onDestroy: (cb) => comp._hookCbs._onDestroy.push(cb),
    beforeUpdate: (cb) => comp._hookCbs._beforeUpdate.push(cb),
    afterUpdate: (cb) => comp._hookCbs._afterUpdate.push(cb),

    onMutate: (cb, slices) => {
      if (_DEV_ && !slices.length) throw errors.missing_dependency_array_in_onMutate(comp)

      comp._hookCbs._onMount.push(() => {
        const stateDeps = slices.map(slice => slice.split('.'))
        return subscribeMultiple(comp, stateDeps, cb, 0)
      })
    }
  }
}

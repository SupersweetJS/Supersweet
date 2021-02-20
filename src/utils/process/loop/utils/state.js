import DEV from '../../../dev/DEV'
import checkUniquenessOfKeys from '../dev/checkUniquenessOfKeys'
import arrayDiff from '../diff/arrayDiff'

export const getNewState = (blob) => {
  const { comp, getArray, getKeys } = blob
  // get new array from state
  const values = getArray()
  // using the new array, re-compute the keys for each item
  const keys = getKeys()
  if (DEV) checkUniquenessOfKeys(comp, keys)
  return {
    keys,
    values
  }
}

// @todo - do not update index - we need to update props now
export const updateCompState = (newState, blob) => {
  const { comps, attributes, oldState, initialized, comp, getArray, getClosure } = blob
  if (!comps.length || !initialized) return

  const diffIndexes = arrayDiff(newState.values, oldState.values)
  diffIndexes.forEach(i => {
    attributes.forEach(attribute => {
      const arr = getArray()
      const closure = getClosure(arr[i], i)
      comps[i].nue.$[attribute.name] = attribute.placeholder.getValue(comp.$, closure)
    })
  })
}

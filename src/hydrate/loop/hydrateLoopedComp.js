import { createComment } from '../../dom/create.js'
import { handleArrayChange } from './utils/handleArrayChange.js'
import { getArrayMutationInfo } from './utils/getArrayMutationInfo.js'
import { zeroToNArray } from './utils/zeroToNArray.js'
import { subscribe } from '../../subscription/subscribe.js'
import { batches } from '../../enums.js'
import { arraysAreShallowEqual } from '../../utils/array.js'

/** @typedef {(value: any, index: number) => Record<string, any>} getClosure */
/** @typedef {(value: any, index: number) => any } getKey */

/**
 * hydrate looped comp
 * @param {LoopedComp} loopedComp
 * @param {Comp} parentComp
 */
export const hydrateLoopedComp = (loopedComp, parentComp) => {
  const parsed = loopedComp._parsedInfo
  const loopAttributes = parsed._loopAttributes
  const { _itemArray, _itemIndex, _item, _key } = loopAttributes

  const arrayPath = _itemArray._statePaths[0]
  const arrayPathString = arrayPath.join('.')
  const anchor = createComment('loop/')

  const oldState = {
    _values: [],
    _keys: [],
    _keyHash: {}
  }

  /** @type {getClosure} */
  const getClosure = (value, index) => {
    const closure = {
      [_item]: value
    }

    if (_itemIndex) closure[_itemIndex] = index
    return closure
  }

  /** @returns {Array<any>} */
  const getArray = () => _itemArray._getValue(parentComp)

  // @todo current key can only be from closure, add support for state too
  /** @type {getKey} */
  const getKey = (value, index) => {
    const pseudoComp = {
      $: getClosure(value, index),
      _compName: loopedComp._compName
    }

    return _key._getValue(
      // @ts-expect-error
      pseudoComp
    )
  }

  const getKeys = () => getArray().map(getKey)

  /** @type {LoopInfo} */
  const loopInfo = {
    _loopedCompInstances: [],
    _anchor: anchor,
    _loopedComp: loopedComp,
    _getArray: getArray,
    _getClosure: getClosure,
    _getKeys: getKeys,
    _parentComp: parentComp,
    _instanciated: false,
    _loopAttributes: loopAttributes,
    _animation: parsed._animationAttributes
  }

  const fullReconcile = () => {
    const n = getArray().length
    handleArrayChange(loopInfo, zeroToNArray(n), {}, oldState)
  }

  parentComp._deferredWork.push(() => {
    loopedComp.before(anchor)
    loopedComp.before(createComment('/loop'))
    loopedComp.remove()
    fullReconcile()
    loopInfo._instanciated = true
  })

  /** @type {BatchCallBack} */
  const onDepsChange = (mutations) => {
    // if some mutation in batch assigned a new array
    const newArrayAssigned = mutations.some(batchInfo => arraysAreShallowEqual(batchInfo.path, arrayPath))

    if (newArrayAssigned) fullReconcile()

    else {
      // partial reconciliation
      const [dirtyIndexes, stateUpdatePaths] = getArrayMutationInfo(mutations, arrayPathString, arrayPath)
      handleArrayChange(loopInfo, dirtyIndexes, stateUpdatePaths, oldState)
    }

  }

  subscribe(arrayPath, parentComp, onDepsChange, batches._DOM)
}

import { conditionAttributes, loopAttributes } from '../constants'
import { getAttr } from '../dom/attributes'
import { parseConditionComp } from './parseConditionComp'
import { parseIfComp } from './parseIfComp'
import { parseLoopedComp } from './parseLoopedComp'

const { _else, _if, _elseIf } = conditionAttributes

/**
 * parse component node
 * @param {Comp} comp
 * @param {string} compName
 * @param {string} parentCompName
 * @param {Function[]} deferredParsingWork
 */
export const parseComp = (comp, compName, parentCompName, deferredParsingWork) => {

  comp._parsedInfo = {
    _isComp: true,
    _compName: compName,
    _attributes: []
  }

  const forAttribute = getAttr(comp, loopAttributes._for)

  // if the component has FOR_ATTRIBUTE on it, it is looped component
  if (forAttribute) {
    parseLoopedComp(
      /** @type {LoopedComp} */(comp),
      forAttribute,
      parentCompName
    )
  }

  else {
    const typeAndValue = usesConditionalAttribute(comp)

    if (typeAndValue) {
      const [type, value] = typeAndValue
      parseConditionComp(/** @type {ConditionalComp}*/(comp), type, value)

      if (type === _if) {
        deferredParsingWork.push(() => parseIfComp(/** @type {IfComp} */(comp)))
      }
    }
  }
}

/**
 * if the comp has conditional Attribute, return [attributeName, value] else false
 * @param {Comp} conditionComp
 * @returns {[ConditionAttribute, string] | false}
 */
const usesConditionalAttribute = conditionComp => {
  const conditionalAttributes = /** @type {ConditionAttribute[]}*/(
    [_else, _if, _elseIf]
  )

  for (const attributeName of conditionalAttributes) {
    const value = getAttr(conditionComp, attributeName)
    if (value !== null) return [attributeName, value]
  }

  return false
}

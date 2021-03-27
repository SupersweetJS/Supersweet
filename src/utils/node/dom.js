import { animationAttributes } from '../../constants'

/**
 * get name attribute from element
 * @param {HTMLElement} element
 * @param {string} name
 */
export const getAttr = (element, name) => element.getAttribute(name)

/**
 * remove name attribute from element
 * @param {HTMLElement} element
 * @param {string} name
 */
export const removeAttr = (element, name) => element.removeAttribute(name)

/**
 * remove name attribute from element
 * @param {HTMLElement} element
 * @param {string} name
 * @param {string} value
 */
export const setAttr = (element, name, value) => element.setAttribute(name, value)

/**
 * remove name attribute from element
 * @param {HTMLElement} element
 * @param {string} name
 * @param {boolean} [clearAnimation]
 * @param {Function} [cb]
 */
export const animate = (element, name, clearAnimation = false, cb) => {
  element.style.animation = name
  if (clearAnimation) {
    onAnimationEnd(element, () => {
      element.style.animation = ''
      if (cb) cb()
    })
  }
}

/**
 * when animation ends on element run callback
 * @param {HTMLElement} element
 * @param {() => any} cb
 */
export const onAnimationEnd = (element, cb) => {
  element.addEventListener('animationend', cb, { once: true })
}

/**
 * returns newly created element of given tag name
 * @param {string} tagName
 * @returns {Element}
 */
export const createElement = (tagName) => document.createElement(tagName)

/**
 * returns a comment node with given text
 * @param {string} data
 * @returns {Comment}
 */
export const createComment = (data) => document.createComment(data)

/**
 * call disconnectedCallback and then play remove animation
 * @param {Comp} comp
 * @param {string} animation
 */
export const animatedRemove = (comp, animation) => {
  comp.disconnectedCallback()
  comp._manuallyDisconnected = true
  animate(comp, animation, true, () => comp.remove())
}

/**
 * run animation on all elements, and call onAnimationEnd when last animation is completed
 * @param {HTMLElement[]} elements
 * @param {string} cssAnimation
 * @param {Function} onLastAnimationEnd
 */
export const animateAll = (elements, cssAnimation, onLastAnimationEnd) => {
  const lastIndex = elements.length - 1
  elements.forEach((comp, i) => {
    animate(comp, cssAnimation, true, () => {
      if (i === lastIndex) onLastAnimationEnd()
    })
  })
}

/**
 * return object containing enter and exit animation info
 * @param {HTMLElement} element
 * @returns {AnimationAttributes_ParseInfo}
 */
export const getAnimationAttributes = (element) => ({
  _enter: getAttr(element, animationAttributes._enter),
  _exit: getAttr(element, animationAttributes._exit),
  _move: getAttr(element, animationAttributes._move)
})

const node = /*#__PURE__*/ document.createElement('div')

/**
 * convert dash case to camel case
 * @param {string} name
 * @returns {string}
 */
export const dashCaseToCamelCase = (name) => {
  const attributeName = 'data-' + name
  setAttr(node, attributeName, '')
  const camelCaseName = Object.keys(node.dataset)[0]
  removeAttr(node, attributeName)
  return camelCaseName
}

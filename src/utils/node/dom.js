import { ENTER_ANIMATION, EXIT_ANIMATION, IGNORE_DISCONNECT } from '../constants'

export const getAttr = (node, name) => node.getAttribute(name)
export const removeAttr = (node, name) => node.removeAttribute(name)
export const setAttr = (node, name, value) => node.setAttribute(name, value)

export const animate = (node, name, clearAnimation = false, cb) => {
  node.style.animation = name
  if (clearAnimation) {
    onAnimationEnd(node, () => {
      node.style.animation = null
      if (cb) cb()
    })
  }
}

export const onAnimationEnd = (node, cb) => {
  node.addEventListener('animationend', cb, { once: true })
}

export const createElement = (name) => document.createElement(name)
export const createComment = (text) => document.createComment(text)

export const animatedRemove = (comp, animation) => {
  comp.disconnectedCallback()
  comp[IGNORE_DISCONNECT] = true
  animate(comp, animation, true, () => comp.remove())
}

// run animation on all nodes
// and call onAnimationEnd when last animation is completed
export const animateAll = (nodes, cssAnimation, onLastAnimationEnd) => {
  const lastIndex = nodes.length - 1
  nodes.forEach((comp, i) => {
    animate(comp, cssAnimation, true, () => {
      if (i === lastIndex) onLastAnimationEnd()
    })
  })
}

export const getAnimationAttributes = (node) => ({
  enter: getAttr(node, ENTER_ANIMATION),
  exit: getAttr(node, EXIT_ANIMATION)
})

const node = /*#__PURE__*/ document.createElement('div')

export const dashCaseToCamelCase = (name) => {
  const attributeName = 'data-' + name
  setAttr(node, attributeName, '')
  const camelCaseName = Object.keys(node.dataset)[0]
  removeAttr(node, attributeName)
  return camelCaseName
}

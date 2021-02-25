import { connectTree, disconnectTree } from '../connection/recursive.js'
import runScript from './runScript.js'
import addLifecycles, { runEvent } from './lifecycle.js'
import buildShadowDOM from './buildShadowDOM.js'
import processNode from '../process/processNode.js'
import stats from '../stats'
import { upper } from '../others.js'
import { createElement } from '../node/dom.js'
import parseTemplate from '../parse/parseTemplate'
import initNue from './initNue.js'
import setupNue from './setupNue.js'

const defineCustomElement = (component) => {
  const { name, template = '', script, style = '', children } = component
  // return if already defined
  const { components, config } = stats
  if (components[name]) return
  else components[name] = true

  // create hash from component.children array for constant time checking to decide if the node is a component or not
  const childrenHash = {}
  if (children) {
    children.forEach(childComp => {
      childrenHash[upper(childComp.name)] = true
    })
  }

  component.childrenHash = childrenHash

  // create templateNode using template, style, and defaultStyle
  const templateNode = createElement('template')
  templateNode.innerHTML = template + `<style default> ${config.defaultStyle} </style>` + '<style scoped >' + style + '</style>'

  // parse the template and create templateNode which has all the parsed info
  parseTemplate(templateNode, component)

  // node object contains the data that is common for all instances
  const common = { templateNode, component }

  class Nue extends HTMLElement {
    // construct basic nue structure
    constructor () {
      super()
      const nue = this.nue = initNue(this, common)
      addLifecycles(nue)
    }

    connectedCallback () {
      const node = this
      const nue = node.nue
      // if the connection change is due to reordering, ignore
      if (node.reordering) return

      // node check is added to make sure, processing only happens once
      // and not again when component is disconnected and connected back
      if (!node.shadowRoot) {
        setupNue(node)
        if (script) runScript(nue, script)
        // process childNodes (DOM) and shadow DOM
        node.childNodes.forEach(n => processNode(nue, n))
        buildShadowDOM(nue)
      }

      // run mount callbacks first and then connectTree the DOM to state
      // node allows state to set by onMount callbacks to be used directly by the DOM without having to initialize with null values

      runEvent(nue, 'onMount')
      // connectTree shadow DOM and slots to the component state
      connectTree(node.shadowRoot, true)
      connectTree(node)

      node.ignoreDisconnect = false
    }

    disconnectedCallback () {
      const node = this
      const nue = node.nue
      // if disconnectedCallback was manually called earlier, no need to call it again when node is removed
      if (node.ignoreDisconnect) return
      // do nothing, if the connection change is due to reordering
      if (node.reordering) return
      // run onDestroy callbacks
      runEvent(nue, 'onDestroy')
      // disconnectTree the shadow DOM and slots from component state
      disconnectTree(node.shadowRoot, true)
      disconnectTree(node, true)
    }
  }

  // define current component and then it's children
  customElements.define(name, Nue)
  if (children) children.forEach(defineCustomElement)
}

export default defineCustomElement

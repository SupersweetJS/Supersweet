import copyParsed from './node/copyParsed.js'
import processNode from './process/processNode.js'

const buildShadowDOM = (comp) => {
  const { template } = comp.memo

  // create clone of template
  const fragment = template.content.cloneNode(true)

  // add parsed property on fragment
  copyParsed(template.content, fragment)

  // process nodes using parsed property
  processNode(comp, fragment)
  // console.log('deferred is ', comp.deferred)
  comp.deferred.forEach(p => p())
  comp.deferred = []

  // add fragment to shadow DOM
  comp.node.attachShadow({ mode: 'open' });

  // must use spread here even though childNodes is an array
  // because, appending node to shadowRoot, removes it from childNodes array
  [...fragment.childNodes].forEach(node => comp.node.shadowRoot.append(node))
}

export default buildShadowDOM

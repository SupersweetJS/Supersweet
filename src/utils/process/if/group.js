import { reverseForEach } from '../../others.js'
import { connect, disconnect } from '../../node/connections.js'
import processNode from '../processNode.js'
import settings from '../../../settings.js'
import DEV from '../../dev/DEV.js'

const updateAnchor = (anchorNode, c) => {
  const len = anchorNode.textContent.length - c.length
  anchorNode.textContent = anchorNode.textContent.substr(0, len) + c
}

export function addGroup (group) {
  const { anchorNode } = group
  reverseForEach(group.nodes, node => {
    anchorNode.after(node)

    if (DEV) {
      if (settings.showUpdates) {
        settings.onNodeUpdate(node)
      }
    }

    if (group.animate) node.setAttribute('enter', '')
    connect(node)
  })

  group.isRendered = true

  if (DEV) {
    updateAnchor(anchorNode, ' ✅ ')
  }
}

export function removeGroup (group) {
  const { anchorNode } = group

  group.nodes.forEach(node => {
    node.removeAttribute('exit')
    disconnect(node)
    node.remove()
  })

  group.isRendered = false
  if (DEV) {
    updateAnchor(anchorNode, ' ❌ ')
  }
}

export function processGroup (comp, group) {
  group.nodes.forEach(node => {
    if (node.sweet) node.sweet.isProcessed = false
    processNode(comp, node)
  })
  group.isProcessed = true
}

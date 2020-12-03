// import onStateChange from '../reactivity/onStateChange.js'
import { spaceSplitter, uncurl } from '../str.js'
import getSlice from '../value.js'
import processNode from './processNode.js'
import { addTree, removeTree } from '../node/tree.js'
import { reverseForEach } from '../others.js'

/**
 * process if, else-if, else-if, else conditional rendering
 * @param {Node} commentNode
 * @param {Array<string>} commentSplit
 */
function commentIf (commentNode, memo) {
  // console.log('found comment at', memo)
  const conditional = []
  const stateDeps = []
  let node = commentNode.nextSibling
  // const ifStateChain = uncurl(commentSplit[1]).split('.')
  let cIndex = 0
  conditional.push({ nodes: [], path: memo.path, commentNode, type: 'if' })
  stateDeps.push(memo.path)

  while (true) {
    if (node.nodeName === '#comment') {
      const textSplit = spaceSplitter(node.textContent)
      // console.log({ textSplit })
      if (textSplit[0] === 'else-if') {
        const path = uncurl(textSplit[1]).split('.')
        conditional.push({ nodes: [], path, commentNode: node, type: 'else-if' })
        stateDeps.push(path)
        cIndex++
      } else if (textSplit[0] === 'else') {
        conditional.push({ nodes: [], commentNode: node, type: 'else' })
        cIndex++
      } else if (textSplit[0] === 'end-if') {
        // console.log('break')
        break
      }
    } else {
      conditional[cIndex].nodes.push(node)
    }

    processNode.call(this, node)
    // console.log({ node })
    node = node.nextSibling
    if (node === null) {
      this.showError('missing end-if comment')
    }
  }

  const onConditionChange = () => {
    let trueFound = false
    conditional.forEach((group, i) => {
      const conditionValue = group.type !== 'else' ? getSlice(this.$, group.path) : true

      // console.log(conditionValue, this.$.count, group.path)
      // if condition becomes truthy and another one before it is not truthy
      // then show this if not already
      if (conditionValue && !trueFound) {
        trueFound = true
        if (group.isRemoved) {
          reverseForEach(group.nodes, (n) => {
            addTree(n, group.commentNode)
          })
          group.isRemoved = false
        }
      } else {
        if (!group.isRemoved) {
          group.nodes.forEach(n => removeTree(n))
          group.isRemoved = true
        }
      }
    })
  }

  const deps = stateDeps.map(d => d.join('.'))
  // console.log({ deps })
  onConditionChange()

  this.on.beforeUpdate(onConditionChange, deps)
  // stateDeps.forEach(path => {
  //   this.on.beforeUpdate()
  //   onStateChange.call(this, path, onConditionChange)
  // })
}

export default commentIf

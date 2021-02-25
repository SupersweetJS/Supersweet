import devtools from '../apis/devtools'
import DEV from './dev/DEV'

// return function which when called adds the cb to given batch
export const batchify = (cb, batch) => () => batch.add(cb)

// @todo reduce the amount of functions in this file - they all are very similar
export const runBatch = (batch) => {
  batch.forEach(cb => {
    const { node } = cb
    // if cb is for updating a node, only call cb if node is subscribed
    if ((node && node.isSubscribed) || !node) {
      cb()
      if (DEV && node && devtools.showUpdates) devtools.onNodeUpdate(node)
    }
  })
  // once all callbacks are run clear the batch
  batch.clear()
}

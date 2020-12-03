// import fetchComponents from './fetchComponents.js'
import reactify from './reactivity/reactify.js'
import processTemplate from './process/processTemplate.js'

function htmlTemplate (strings, ...exprs) {
  let str = ''
  let value
  for (let i = 0; i < strings.length; i++) {
    value = exprs[i]
    // value = typeof value === 'function' ? value() : value
    str += strings[i] + (value === undefined ? '' : value)
  }

  this.memo.template.innerHTML = str
}

function buildTemplate (component) {
  const $ = reactify.call(this, this.props || {})
  const handle = this.handle
  const on = this.on
  const refs = this.memo.refs
  const actions = this.actions

  const initialize = (processHTML) => {
    $.__setDisableOnChange__(true)
    $.__setInitiateMode__(true)
    const html = processHTML ? htmlTemplate.bind(this) : () => {}
    component({ $, handle, on, refs, html, actions })
    $.__setInitiateMode__(false)
    $.__setDisableOnChange__(false)
  }

  if (this.memo.template) {
    initialize(false)
  } else {
    this.memo.template = document.createElement('template')
    initialize(true)
    processTemplate.call(this)
  }

  this.$ = $
}

export default buildTemplate

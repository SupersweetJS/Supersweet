import getRS from './getRS.js'

// state is created from this.props, fallback values are given in options.state

function addState () {
  const state = this.options.state || {}
  if (this.props) {
    for (const prop in this.props) {
      const propValue = this.props[prop]
      if (propValue !== undefined) state[prop] = propValue
    }
  }

  this.state = getRS.call(this, state, this.onChange.bind(this))
}

export default addState

import defineCustomElement from '../utils/component/defineCustomElement'
import showError from '../utils/dev/error-overlay/showError.js'
import data from '../utils/data'
import { dashify } from '../utils/string/dashify'

/**
 * define the custom targetElement of given name
 * @param {Function} component
 * @param {HTMLElement} targetElement
 * @param {import('types/others').Config} [config]
 */
const render = (component, targetElement, config) => {
  // attach error-overlay
  if (__DEV__) {
    // @ts-ignore
    window.data = data
    window.onerror = (message, filename, lineno, colno, error) => {
      // @ts-ignore
      showError(error)
    }
  }

  // override config with default config
  if (config) data.__config = { ...data.__config, ...config }

  defineCustomElement(component)

  // replace the targetElement with customElement
  const customElement = document.createElement(dashify(component.name))
  targetElement.replaceWith(customElement)
}

export default render

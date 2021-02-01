
import { TEXT } from '../constants.js'
import processPlaceholder from './placeholder/processPlaceholder.js'
import DEV from '../dev/DEV.js'
import err from '../dev/error.js'

const varEnds = (text, i) => text[i] === '}' && text[i + 1] === '}'
const varStarts = (text, i) => text[i] === '{' && text[i + 1] === '{'

// take the string text and split it into placeholders and strings
// returns array of parts
// [ part, part, part ... ]
function split (comp, text) {
  const parts = []
  let collectingVar = false
  let collectedString = ''
  let i = 0

  // reset string and set the collectingVar value and jump over the next character
  const reset = (cv) => {
    collectedString = ''
    collectingVar = cv
    // jump over the next '}' or '{' character
    i += 2
  }

  while (i < text.length) {
    if (varStarts(text, i)) {
      // save previously collected string, if not null
      if (collectedString) {
        parts.push({ text: collectedString, type: TEXT })
      }

      reset(true)
    }

    else if (varEnds(text, i)) {
      if (DEV && !collectingVar) {
        err({
          message: 'invalid use of }}',
          comp
        })
      }

      // process variable and save it in parts
      const part = processPlaceholder(collectedString, true)
      parts.push(part)
      reset(false)
    }

    // keep collecting
    else {
      collectedString += text[i]
      i++
    }
  }

  // add the remaining text
  if (collectedString) parts.push({ text: collectedString, type: TEXT })
  return parts
}

export default split

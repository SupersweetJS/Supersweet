import { targetProp } from './slice'

const mutate = (obj, path, value, trap = 'set') => {
  const [target, prop] = targetProp(obj, path)
  return Reflect[trap](target, prop, value)
}

export default mutate
import { transit } from './transit'

/**
 * animateMove comps at indexes
 * @param {import('types/loop').LoopInfo} loopInfo
 * @param {Array<number>} indexes
 */

// @todo second arg should be comps instead of indexes
export const animateMove = (loopInfo, indexes) => {
  const moveAnimation = loopInfo._animation._move
  const loopedCompInstances = loopInfo._loopedCompInstances

  for (const index of indexes) {
    const comp = loopedCompInstances[index]

    transit(
      comp,
      /** @type {import('types/others').Offset}  */(comp._prevOffset),
      /** @type {string}*/(moveAnimation)
    )
  }
}

export default animateMove
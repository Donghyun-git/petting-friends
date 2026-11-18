/**
 * Turns horizontal hand movement into pets.
 *
 * One pet = the hand turning around after a real swipe. Holding still, or
 * dragging in one direction only, never counts.
 */
export type StrokeDetector = {
  /** Feed the horizontal distance moved since the last call; true when that completed a pet. */
  move(dx: number): boolean
  /** Forget the current swipe (the hand lifted). */
  reset(): void
}

/** `minRun` is how far (px) a swipe must travel before turning around counts. */
export function createStrokeDetector(minRun = 14): StrokeDetector {
  let dir = 0
  let run = 0
  return {
    move(dx) {
      const distance = Math.abs(dx)
      if (distance < 0.5) return false
      const d = Math.sign(dx)
      if (d === dir) {
        run += distance
        return false
      }
      const petted = run >= minRun
      dir = d
      run = distance
      return petted
    },
    reset() {
      dir = 0
      run = 0
    }
  }
}

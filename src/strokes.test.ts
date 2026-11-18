import { assert, test } from 'orca/testing'
import { createStrokeDetector } from './strokes'

function feed(moves: number[]): number {
  const detector = createStrokeDetector()
  return moves.filter((dx) => detector.move(dx)).length
}

const swipe = (dx: number, steps: number) => Array<number>(steps).fill(dx)

test('dragging one way never counts', () => {
  assert.equal(feed(swipe(10, 30)), 0)
})

test('holding still never counts', () => {
  assert.equal(feed(swipe(0, 30)), 0)
  assert.equal(feed(swipe(0.2, 30)), 0)
})

test('each turn-around after a real swipe is one pet', () => {
  const rub = [...swipe(10, 5), ...swipe(-10, 5), ...swipe(10, 5), ...swipe(-10, 5)]
  assert.equal(feed(rub), 3)
})

test('tiny jitters are not pets', () => {
  assert.equal(feed([3, -3, 3, -3, 3, -3]), 0)
})

test('reset forgets the swipe in progress', () => {
  const detector = createStrokeDetector()
  for (const dx of swipe(10, 5)) detector.move(dx)
  detector.reset()
  assert.equal(detector.move(-10), false)
})

import { expect } from '@jest/globals'

export const assert = {
  deepEqual(actual: unknown, expected: unknown) {
    expect(actual).toEqual(expected)
  },
  doesNotMatch(actual: string, expected: RegExp) {
    expect(actual).not.toMatch(expected)
  },
  doesNotThrow(callback: () => unknown) {
    expect(callback).not.toThrow()
  },
  equal(actual: unknown, expected: unknown) {
    expect(actual).toBe(expected)
  },
  match(actual: string, expected: RegExp) {
    expect(actual).toMatch(expected)
  },
  notEqual(actual: unknown, expected: unknown) {
    expect(actual).not.toBe(expected)
  },
  ok(actual: unknown) {
    expect(actual).toBeTruthy()
  },
}

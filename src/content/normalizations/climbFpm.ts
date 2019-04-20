
/**
 * Returns current rate of climb / descend.
 *
 * @param value Feet per second
 * @return Angle the needle should be rotated by
 */
export function climbFpm (value: number) : number {
  return Math.max(-180, Math.min(180, 90 * value / 1000)) - 90
}

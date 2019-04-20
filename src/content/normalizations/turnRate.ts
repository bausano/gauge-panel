
/**
 * Normalizes angle of turn rate.
 *
 * @param value Current angle of turn rate
 * @return Normalized angle
 */
export function turnRate (value: number) : number {
  return Math.max(-70, Math.min(70, value))
}

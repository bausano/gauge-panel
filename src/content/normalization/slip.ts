
/**
 * Slip indication.
 *
 * @param value Current deviation of ball from center
 * @return Pixels for translation
 */
export function slip (value: number) : number {
  return Math.max(-8, Math.min(8, -value)) * 9
}

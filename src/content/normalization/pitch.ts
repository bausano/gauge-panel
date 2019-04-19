
/**
 * Normalizes pitch into pixels for translation.
 *
 * @param value Current pitch
 * @return How many pixels should be the gauge be translated by
 */
export function pitch (value: number) : number {
  return value * 1.5
}

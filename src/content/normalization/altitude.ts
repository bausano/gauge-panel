
/**
 * Calculates degrees of turn for the small needle.
 *
 * @param value Current altitude
 * @return Degrees needle should be rotated by
 */
export function altitudeInThousands (value: number) : number {
  return 36 * value / 1000
}

/**
 * Calculates turn for the large needle.
 *
 * @param value Current altitude
 * @return Degrees needle should be rotated by
 */
export function altitudeInHundreds (value: number) : number {
  return 36 * (value % 1000) / 100
}

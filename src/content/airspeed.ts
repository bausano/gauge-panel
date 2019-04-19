
/**
 * From the current airspeed value computes degrees of turn of the needle.
 *
 * @param value Current airspeed
 * @return Degrees
 */
export function airspeed (value: number) : number {
  const degree: number = 90

  if (value >= 0 && value <= 50) {
    return normalize(value, 0, 50, -90, -45) + degree
  }

  if (value > 50 && value <= 70) {
    return normalize(value, 50, 70, -45, 0) + degree
  }

  if (value > 70 && value <= 90) {
    return normalize(value, 70, 90.5, 0, 45) + degree
  }

  if (value > 90 && value <= 107.5) {
    return normalize(value, 90, 107.5, 45, 90) + degree
  }

  if (value > 107.5 && value <= 130) {
    return normalize(value, 107.5, 130, 90, 135) + degree
  }

  if (value > 130 && value <= 160) {
    return normalize(value, 130, 160, 135, 180) + degree
  }

  if (value > 160 && value <= 200) {
    return normalize(value, 160, 200, 180, 225) + degree
  }

  return 225 + degree
}

/**
 * Normalizes the angle.
 *
 * @param valueIn Current airspeed
 * @param baseMin Smallest value
 * @param baseMax Maximum value
 * @param limitMin Min restriction
 * @param limitMax Max restriction
 */
function normalize (
  valueIn: number,
  baseMin: number,
  baseMax: number,
  limitMin: number,
  limitMax: number,
) : number {
  return (
    (limitMax - limitMin) *
    (valueIn - baseMin) / (baseMax - baseMin)
  ) + limitMin
}

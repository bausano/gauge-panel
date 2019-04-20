import { Topic } from './Topic'
import { Gauges, gaugesFactory } from './gauges'
import {
  airspeed,
  altitudeInHundreds,
  altitudeInThousands,
  climbFpm,
  pitch,
  slip,
  turnRate,
} from './normalizations'

export type transformer = (value: number) => void

/**
 * Element references for each gauge.
 *
 * @var gauges
 */
const gauges: Gauges = gaugesFactory(document)

/**
 * Changes given element's transform attribute to given value.
 *
 * @param element Target DOM element to change its transform attribute
 * @param to Value of the transform attribute
 */
function transform (element: Element, to: string) : void {
  element.setAttribute('style', `transform: ${to}`)
}

/**
 * Binds transform functions to topics.
 */
export const transformers: { [key: string]: transformer } = {
  [Topic.ALTITUDE]: (value) => {
    transform(gauges.altimeter.needle, `rotate(${altitudeInHundreds(value)}deg)`)
    transform(gauges.altimeter.needleSmall, `rotate(${altitudeInThousands(value)}deg)`)
  },

  [Topic.AIRSPEED]: value => transform(gauges.asi, `rotate(${airspeed(value)}deg)`),

  [Topic.HEADING]: value => transform(gauges.heading, `transform: rotate(${-value}deg)`),

  [Topic.PITCH]: value => transform(gauges.fdai.pitch, `translate(0px, ${pitch(value)}px)`),

  [Topic.ROLL]: value => transform(gauges.fdai.yaw, `rotate(${-value}deg)`),

  [Topic.SLIP]: value => transform(gauges.turnCoordinator.dot, `translate(${slip(value)}px, 0px)`),

  [Topic.TURN_RATE]: value => transform(
    gauges.turnCoordinator.plane,
    `rotate(${turnRate(value)}deg)`,
  ),

  [Topic.VVI_FPM]: value => transform(gauges.variometer, `rotate(${climbFpm(value)}deg)`),
}

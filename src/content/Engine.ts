import { Gauges } from './Gauges'

const engine: any = {
  airSpeed: 80,
  pitch: 0,
  yaw: 0,
}

/**
 * Starts the key event listeners.
 *
 * @param gauges
 */
export function start (gauges: Gauges) : void {
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 38) {
      engine.airSpeed++
      engine.pitch++
    } else if (e.keyCode === 40) {
      engine.airSpeed--
      engine.pitch--
    } else if (e.keyCode === 37) {
      engine.yaw--
    } else if (e.keyCode === 39) {
      engine.yaw++
    }

    // Updates needle rotation.
    gauges.asi.setAttribute('style', `transform: rotate(${engine.airSpeed}deg)`)

    // Updates the gauge rotation.
    gauges.fdai.yaw.setAttribute('style', `transform: rotate(${engine.yaw}deg)`)

    // Updates the gauge translation.
    gauges.fdai.pitch.setAttribute('style', `transform: translate(0px, ${engine.pitch}px)`)

  })
}

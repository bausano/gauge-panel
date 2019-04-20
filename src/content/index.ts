import { Gauges } from './Gauges'
import { ipcRenderer } from 'electron'
import { slip } from './normalization/slip'
import { pitch } from './normalization/pitch'
import { airspeed } from './normalization/airspeed'
import { turnRate } from './normalization/turnRate'
import { climbFpm } from './normalization/climbFpm'
import { altitudeInHundreds, altitudeInThousands } from './normalization/altitude'

/**
 * @notImplemented
 *
 * Receives new message with properties it should update for each gauge.
 *
 * TODO: Document channel communication standards.
 */

ipcRenderer.on('app.booted', () => console.log(`[${new Date}] App booted.`))

/**
 * Element references to gauges.
 */
const gauges: Gauges = {
  altimeter: {
    needle: document.querySelector('.is-altimeter .needle'),
    needleSmall: document.querySelector('.is-altimeter .needle-small'),
  },
  asi: document.querySelector('.is-air-speed-indicator .needle'),
  fdai: {
    pitch: document.querySelector('.is-attitude-indicator .pitch'),
    yaw: document.querySelector('.is-attitude-indicator .yaw-wrapper'),
  },
  heading: document.querySelector('.is-heading-indicator .frame'),
  turnCoordinator: {
    dot: document.querySelector('.is-turn-coordinator .dot'),
    plane: document.querySelector('.is-turn-coordinator .plane'),
  },
  variometer: document.querySelector('.is-variometer .needle'),
}

ipcRenderer.on('gauge.airspeed', (_, value) => {
  gauges.asi.setAttribute('style', `transform: rotate(${airspeed(value)}deg)`)
})

ipcRenderer.on('gauge.turn_rate', (_, value) => {
  gauges.turnCoordinator.plane.setAttribute(
    'style',
    `transform: rotate(${turnRate(value)}deg)`,
  )
})

ipcRenderer.on('gauge.pitch', (_, value) => {
  gauges.fdai.pitch.setAttribute(
    'style',
    `transform: translate(0px, ${pitch(value)}px)`,
  )
})

ipcRenderer.on('gauge.altitude', (_, value) => {
  gauges.altimeter.needle.setAttribute(
    'style',
    `transform: rotate(${altitudeInHundreds(value)}deg)`,
  )

  gauges.altimeter.needleSmall.setAttribute(
    'style',
    `transform: rotate(${altitudeInThousands(value)}deg)`,
  )
})

ipcRenderer.on('gauge.vvi_fpm', (_, value) => {
  gauges.variometer.setAttribute(
    'style',
    `transform: rotate(${climbFpm(value)}deg)`,
  )
})

ipcRenderer.on('gauge.heading', (_, value) => {
  gauges.heading.setAttribute(
    'style',
    `transform: rotate(${-value}deg)`,
  )
})

ipcRenderer.on('gauge.slip', (_, value) => {
  gauges.turnCoordinator.dot.setAttribute(
    'style',
    `transform: translate(${slip(value)}px, 0px)`,
  )
})

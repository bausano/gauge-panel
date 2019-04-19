import { Gauges } from './Gauges'
import { ipcRenderer } from 'electron'
import { pitch } from './normalization/pitch'
import { airspeed } from './normalization/airspeed'
import { turnRate } from './normalization/turnRate'

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
  asi: document.querySelector('.is-air-speed-indicator .needle'),
  fdai: {
    pitch: document.querySelector('.is-attitude-indicator .pitch'),
    yaw: document.querySelector('.is-attitude-indicator .yaw-wrapper'),
  },
}

// Updates needle rotation.
ipcRenderer.on('gauge.airspeed', (_, value) => {
  gauges.asi.setAttribute('style', `transform: rotate(${airspeed(value)}deg)`)
})

// Updates the gauge rotation.
ipcRenderer.on('gauge.turn_rate', (_, value) => {
  gauges.fdai.yaw.setAttribute('style', `transform: rotate(${turnRate(value)}deg)`)
})

// Updates the gauge translation.
ipcRenderer.on('gauge.pitch', (_, value) => {
  gauges.fdai.pitch.setAttribute(
    'style',
    `transform: translate(0px, ${pitch(value)}px)`,
  )
})

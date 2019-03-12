import { start } from './Engine'
import { Gauges } from './Gauges'
import { ipcRenderer } from 'electron'

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
ipcRenderer.on('gauge.asi', (_, deg) => {
  gauges.asi.setAttribute('style', `transform: rotate(${deg}deg)`)
})

// Updates the gauge rotation.
ipcRenderer.on('gauge.fdai.yaw', (_, deg) => {
  gauges.fdai.yaw.setAttribute('style', `transform: rotate(${deg}deg)`)
})

// Updates the gauge translation.
ipcRenderer.on('gauge.fdai.pitch', (_, px) => {
  gauges.fdai.pitch.setAttribute('style', `transform: translate(0px, ${px}px)`)
})

// start(gauges)

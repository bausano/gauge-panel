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
  asi: document.querySelector('.is-asi .needle'),
}

// Updates needle rotation.
ipcRenderer.on('gauge.asi.updated', (_, deg) => {
  gauges.asi.setAttribute('style', `transform: rotate(${deg}deg)`)
})

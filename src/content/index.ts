import { env } from '@internal/config'
import { ipcRenderer } from 'electron'
import { transformers } from './transformers'

/**
 * Initial message should be app booted.
 */

ipcRenderer.on('app.booted', () => {
  if (env('DEBUG')) {
    console.log(`[${new Date}] App booted.`)
  }

  // Registers listeners for all gauges.
  for (const topic in transformers) {
    ipcRenderer.on(`gauge.${topic}`, (_, value) => transformers[topic](value))
  }

})

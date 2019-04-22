import { IpcRenderer } from 'electron'
import { env } from '@internal/config'
import { transformers } from './transformers'

/**
 * Register listener for messages.
 *
 * @param tab Can listen to messages
 */
export const listen: (tab: IpcRenderer) => void = (tab) => {
  tab.on('app.booted', () => {
    if (env('DEBUG')) {
      console.log(`[${new Date}] App booted.`)
    }

    // Registers listeners for all gauges.
    for (const topic in transformers) {
      tab.on(`gauge.${topic}`, (_, value) => transformers[topic](value))
    }
  })
}

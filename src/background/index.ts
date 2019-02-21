import { App } from './App'
import * as path from 'path'
import { env } from '../config'
import { app as electron, BrowserWindow } from 'electron'
import { WebSocketsListener } from './listeners/WebSocketsListener'

// Boots the UI.
electron.on('ready', () => {
  // Create the browser window.
  const window: Electron.BrowserWindow = new BrowserWindow({
    height: 600,
    width: 800,
  })

  // Boots the app with listener and messaging object.
  const app: App = new App(
    window.webContents,
    new WebSocketsListener,
  )

  // Load the UI with gauges.
  window.loadFile(path.join(__dirname, `../../${env('INDEX_FILE')}`))

  // Open the DevTools in dev enviroment.
  if (env('DEBUG')) {
    window.webContents.openDevTools()
  }

  // Once the window is ready, it boots the app.
  window.webContents.on('did-finish-load', () => app.boot())
})

// Quit when all windows are closed.
electron.on('window-all-closed', () => electron.quit())

export default electron

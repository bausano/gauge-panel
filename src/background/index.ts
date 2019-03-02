import { App } from './App'
import * as path from 'path'
import * as WebSocket from 'ws'
import { env } from '../config'
import { ListenerBag } from './listeners/ListenerBag'
import { app as electron, BrowserWindow } from 'electron'
import { WebSocketsListener } from './listeners/WebSocketsListener'

// Boots the UI.
electron.on('ready', () => {
  // Create the browser window.
  const window: Electron.BrowserWindow = new BrowserWindow({
    height: 600,
    width: 800,
  })

  // Prepares websocket client.
  // TODO: WebSocketProvider
  const client: WebSocket = new WebSocket(env('SERVER_URL'))

  // Creates listener bag that is hooked to parser that sends it to content.
  const bag: ListenerBag<any> = new ListenerBag

  // Boots the app with listener and messaging object.
  const app: App = new App(
    window.webContents,
    new WebSocketsListener(client, bag),
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

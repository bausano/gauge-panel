import { listen } from './listen'
import { ipcRenderer } from 'electron'

// Attaches the listeners to the render object.
listen(ipcRenderer)

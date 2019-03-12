import { WebContents } from 'electron'
import { Client } from './clients/Client'

export class App {

  /**
   * @param content Communication object with content script
   * @param client Communication object with the engine
   */
  constructor (
    private content: WebContents,
    private client: Client,
  ) {
    //
  }

  /**
   * Boots the app's listeners.
   */
  public boot () : void {
    this.content.send('app.booted')

    let degrees: number = 0
    let pitch: number = 0

    setInterval(() => {
      degrees += Math.floor(Math.random() * 3) - 1
      degrees = degrees < 0 ? 5 : degrees > 360 ? 355 : degrees

      pitch -= Math.floor(Math.random() * 3) - 1
      pitch = pitch < -20 ? -20 : pitch > 20 ? 20 : pitch

      // Simulate asi gauge.
      this.content.send('gauge.asi', degrees * 3)

      // Simulate fdai yaw.
      this.content.send('gauge.fdai.yaw', degrees)

      // Simulate fdai pitch.
      this.content.send('gauge.fdai.pitch', pitch)
    }, 750)

  }

}

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

    let last: number = 30

    // Simulate asi gauge.
    setInterval(() => {
      last += Math.floor(Math.random() * 6) - 3

      last = last < 0 ? 5 : last > 360 ? 355 : last

      this.content.send('gauge.asi.updated', last)
    }, 750)

  }

}

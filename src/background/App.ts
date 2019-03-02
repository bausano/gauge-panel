import { WebContents } from 'electron'
import { Listener } from './listeners/Listener'

export class App {

  /**
   * @param content Communication object with content script
   * @param listener Communication object with the engine
   */
  constructor (
    private content: WebContents,
    private listener: Listener,
  ) {
    //
  }

  /**
   * Boots the app's listener.
   */
  public boot () : void {
    this.content.send('app.booted')

    let last: number = 30

    // Simulate asi gauge.
    setInterval(() => {
      last += Math.floor(Math.random() * 10) - 3

      last = last < 0 ? 5 : last

      this.content.send('gauge.asi.updated', last)
    }, 750)

  }

}

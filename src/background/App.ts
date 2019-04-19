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
    this.client.bag.addListener(({ reference, value }) => {
      this.content.send(`gauge.${reference}`, value)
    })

    this.client.listen()

    this.content.send('app.booted')
  }

}

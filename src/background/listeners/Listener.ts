
export interface Listener {

  /**
   * Starts listening to messages.
   */
  listen () : void

  /**
   * Resets pong timeout and sends a ping message.
   */
  ping () : void

}

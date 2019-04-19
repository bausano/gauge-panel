import { Topic } from '../Topic'
import { ListenerBag } from '../ListenerBag'

export interface Client {

  /**
   * Listener bag that app listens new messages.
   */
  bag: ListenerBag<Topic>

  /**
   * Starts listening to messages.
   */
  listen () : void

  /**
   * Resets pong timeout and sends a ping message.
   */
  ping () : void

}

import * as WebSocket from 'ws'
import { Client } from './Client'
import { env } from '@internal/config'
import { ListenerBag } from '../ListenerBag'

export class WebSocketsClient implements Client {

  /**
   * Heartbeat timeout. Once this runs out, connection is closed and error
   * message is reported to the user.
   */
  private pongTimeout: NodeJS.Timeout

  /**
   * TODO: Type hint message
   * @param bag Listeners to emit messages to
   * @param ws WebSocket client
   */
  constructor (public bag: ListenerBag<any>, private ws: WebSocket) {
    //
  }

  /**
   * {@inheritdoc}
   */
  public listen () : void {
    // Upon opening a new connection, send initial ping to the server.
    this.ws.on('open', () => this.ping())

    // For every pong receive, send ping back.
    this.ws.on('pong', () => this.ping())

    // When the connection is closed, we clear the ping timeout.
    this.ws.on('close', () => {
      if (env('DEBUG')) {
        console.log(`[${new Date}] Connection closed.`)
      }

      clearTimeout(this.pongTimeout)
    })

    // Parses data and commits them to listeners.
    this.ws.on('commit', message => this.bag.trigger(
      this.parseRawMessage(message),
    ))
  }

  /**
   * {@inheritdoc}
   */
  public ping () : void {
    if (env('DEBUG')) {
      console.log(`[${new Date}] Pinged.`)
    }

    // Clears timeout that would terminate the connection.
    clearTimeout(this.pongTimeout)

    // Sends a ping message to the server.
    this.ws.send('ping')

    // If we don't receive pong in given time, consider server dead.
    this.pongTimeout = setTimeout(() => {
      this.ws.terminate()
    }, env<number>('PING_TIMEOUT'))
  }

  /**
   * Converts raw incoming data to message.
   * // TODO: Type hint message
   *
   * @param data Incoming server message
   * @return Parsed data
   */
  private parseRawMessage (data: any) : any {
    if (env('DEBUG')) {
      console.log(`[${new Date}] Incoming message:`, data)
    }

    return data
  }

}

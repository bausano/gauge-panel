import * as dgram from 'dgram'
import { Client } from './Client'
import { env } from '@internal/config'
import { ListenerBag } from '../ListenerBag'

export class UserDatagramProtocolClient implements Client {

  /**
   * Heartbeat timeout. Once this runs out, connection is closed and error
   * message is reported to the user.
   */
  private pongTimeout: NodeJS.Timeout

  /**
   * TODO: Type hint message
   * @param bag Listeners to emit messages to
   * @param udp UDP client
   */
  constructor (public bag: ListenerBag<any>, private udp: dgram.Socket) {
    //
  }

  /**
   * {@inheritdoc}
   */
  public listen () : void {
    // Upon opening a new connection, send initial ping to the server.
    this.udp.on('listening', () => this.ping())

    // TODO: For every pong receive, send ping back.

    // When the connection is closed, we clear the ping timeout.
    const onClosed: (error?: any) => void = (error = 'Without error.') => {
      if (env('DEBUG')) {
        console.log(`[${new Date}] Connection closed.`, error)
      }

      clearTimeout(this.pongTimeout)
    }

    this.udp.on('error', onClosed)
    this.udp.on('close', onClosed)

    // Parses data and commits them to listeners.
    this.udp.on('message', message => this.bag.trigger(
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
    this.send(Buffer.from('ping'))

    // If we don't receive pong in given time, consider server dead.
    this.pongTimeout = setTimeout(() => {
      this.udp.close()
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

  /**
   * Sends a message to the server.
   *
   * @param data Message to be send to the server
   * @return Resolves if the data were sent without error, otherwise rejects
   */
  private send (data: Buffer|Buffer[]) : Promise<void> {
    const port: number = env<number>('UDP_PORT')
    const address: string = env<string>('UDP_ADDRESS')

    return new Promise((resolve, reject) => {
      this.udp.send(data, port, address, e => e ? reject(e) : resolve())
    })
  }

}

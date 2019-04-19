import * as utf8 from 'utf8'
import * as dgram from 'dgram'
import { Topic } from '../Topic'
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
    this.udp.on('listening', ()  => {
      console.log(`[${new Date}] Listening:`, this.udp.address())

      this.ping()
    })

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

    // Boots the server.
    this.udp.bind(
      env('UDP_CLIENT_PORT'),
      env('UDP_AGGREGATOR_ADDRESS'),
    )
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
      // this.udp.close()
    }, env<number>('PING_TIMEOUT'))
  }

  /**
   * Converts raw incoming data to message.
   *
   * @param data Incoming server message
   * @return Parsed data
   */
  private parseRawMessage (data: Buffer) : Topic {
    // First five bytes have to equal certain string to check the type of the
    // message.
    if (data.slice(0, 5).toString() !== 'DREF0') {
      return
    }

    try {
      // The next 4 bytes create the float value of topic.
      const value: number = data.slice(5, 9).readFloatLE(0)
      // Reference so that we know what topic should we update.
      const reference: string = data
        .slice(9)
        .filter(byte => byte !== 0)
        .toString().trim().toLowerCase()

      return { reference, value }
    } catch (error) {
      console.log(`[${new Date}] Invalid message format.`, error, data)
    }
  }

  /**
   * Sends a message to the server.
   *
   * @param data Message to be send to the server
   * @return Resolves if the data were sent without error, otherwise rejects
   */
  private send (data: Buffer|Buffer[]) : Promise<void> {
    const port: number = env<number>('UDP_AGGREGATOR_PORT')
    const address: string = env<string>('UDP_AGGREGATOR_ADDRESS')

    return new Promise((resolve, reject) => {
      this.udp.send(data, port, address, e => e ? reject(e) : resolve())
    })
  }

}

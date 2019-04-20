import * as dgram from 'dgram'
import { Topic } from '../Topic'
import { Client } from './Client'
import { env } from '@internal/config'
import { ListenerBag } from '../ListenerBag'
import { PongException } from './PongException';

export class UserDatagramProtocolClient implements Client {

  /**
   * Heartbeat timeout. Once this runs out, connection is closed and error
   * message is reported to the user.
   */
  private pongTimeout: NodeJS.Timeout

  /**
   * @param bag Listeners to emit messages to
   * @param udp UDP client
   */
  constructor (public bag: ListenerBag<Topic>, private udp: dgram.Socket) {
    // Upon opening a new connection, send initial ping to the server.
    this.udp.on('listening', ()  => {
      console.log(`[${new Date}] Listening:`, this.udp.address())

      this.ping()
    })

    // When the connection is closed, we clear the ping timeout.
    const onClosed: (error?: any) => void = (error = 'Without error.') => {
      if (env('DEBUG')) {
        console.log(`[${new Date}] Connection closed.`, error)
      }

      clearTimeout(this.pongTimeout)
    }

    this.udp.on('error', onClosed)
    this.udp.on('close', onClosed)
  }

  /**
   * {@inheritdoc}
   */
  public listen () : void {
    // Parses data and commits them to listeners.
    this.udp.on('message', (message) => {
      try {
        this.bag.trigger(this.parseRawMessage(message))
      } catch (error) {
        if (error instanceof PongException) {
          if (env('DEBUG')) {
            console.log(`[${new Date}] Pong message received.`)
          }

          return this.ping()
        }

        console.log(`[${new Date}] Invalid message format.`, error, message)
      }
    })

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
      if (env('DEBUG')) {
        console.log(`[${new Date}]
          Did not receive response from server in
          ${env<number>('PING_TIMEOUT')} sec.
          Terminating application.`)
      }

      // this.udp.close(_ => process.exit(1))
    }, env<number>('PING_TIMEOUT'))
  }

  /**
   * Converts raw incoming data to message.
   *
   * @param data Incoming server message
   * @return Parsed data
   */
  private parseRawMessage (data: Buffer) : Topic {
    if (data.slice(0, 4).toString() === 'PONG') {
      throw new PongException
    }

    // First five bytes have to equal certain string to check the type of the
    // message.
    if (data.slice(0, 5).toString() !== 'DREF0') {
      throw new Error
    }

    // The next 4 bytes create the float value of topic.
    const value: number = data.slice(5, 9).readFloatLE(0)
    // Reference so that we know what topic should we update.
    const reference: string = data
      .slice(9)
      .filter(byte => byte !== 0)
      .toString().trim().toLowerCase()

    return { reference, value }
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

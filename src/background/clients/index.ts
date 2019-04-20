import * as dgram from 'dgram'
import * as WebSocket from 'ws'
import { Client } from './Client'
import { env } from '@internal/config'
import { ListenerBag } from '../ListenerBag'
import { UserDatagramProtocolClient } from './UserDatagramProtocolClient'

/**
 * Boots new udp sockets connection.
 *
 * @param bag Listener bag to dispatch messages with
 * @return Client connected to udp server
 */
export function bootUserDatagramProtocolClient () : Client {
  const client: dgram.Socket = dgram.createSocket('udp4')

  return new UserDatagramProtocolClient(new ListenerBag, client)
}

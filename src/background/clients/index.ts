import * as dgram from 'dgram'
import * as WebSocket from 'ws'
import { Client } from './Client'
import { env } from '@internal/config'
import { ListenerBag } from '../ListenerBag'
import { WebSocketsClient } from './WebSocketsClient'
import { UserDatagramProtocolClient } from './UserDatagramProtocolClient'

/**
 * Boots new web sockets connection.
 *
 * @param bag Listener bag to dispatch messages with
 * @return Client connected to websocket server
 */
export function bootWebSocketsClient () : Client {
  // Prepares websocket client.
  const client: WebSocket = new WebSocket(env('WS_ADDRESS'))

  return new WebSocketsClient(new ListenerBag, client)
}

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

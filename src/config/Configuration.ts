
export interface Configuration {

  /**
   * Whether the enviroment should use debug utils such as dev console.
   */
  DEBUG: boolean

  /**
   * The name of the index file relative to repository root.
   */
  INDEX_FILE: string

  /**
   * Maximum delay for ping messages. If the client does not hear from the
   * server in given time, it shuts down informing the pilot about failure.
   */
  PING_TIMEOUT: number

  /**
   * The url of the WebSocket server to connect to.
   * @example {wss://echo.websocket.org/}
   */
  WS_ADDRESS: string

  /**
   * The address of data aggregator that sends messages with value updates.
   */
  UDP_AGGREGATOR_ADDRESS: string

  /**
   * Aggregator UDP port. The default value should be 49005.
   */
  UDP_AGGREGATOR_PORT: number

  /**
   * The address of gauge panel client.
   */
  UDP_CLIENT_ADDRESS: string

  /**
   * Gauge panel udp port with default value 49006.
   */
  UDP_CLIENT_PORT: number

}

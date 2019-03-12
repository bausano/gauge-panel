
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

}

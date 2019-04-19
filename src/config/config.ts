import { config as loadEnv } from 'dotenv'
import { Configuration } from './Configuration'
import { EnviromentVariableEmptyException } from './EnviromentVariableEmptyException'

/**
 * Gets process env variable or defaults it.
 *
 * @param key Key to look for
 * @param def Default value if any
 * @return Value of the enviroment variable
 * @throws {EnviromentVariableEmptyException}
 */
function env (key: string, def?: string) : string {
  // Retrives desired value from enviroment variables.
  const value: string = process.env[key]

  if (value === undefined && def === undefined) {
    throw new EnviromentVariableEmptyException
  }

  return value || def
}

// Loads enviroment variables from .env file.
loadEnv()

export const config: Configuration = {
  DEBUG: env('ENV', 'DEV') === 'DEV',
  INDEX_FILE: 'static/index.html',
  PING_TIMEOUT: Number(env('PING_TIMEOUT')),
  UDP_AGGREGATOR_ADDRESS: env('UDP_AGGREGATOR_ADDRESS'),
  UDP_AGGREGATOR_PORT: Number(env('UDP_AGGREGATOR_PORT', '49005')),
  UDP_CLIENT_ADDRESS: env('UDP_CLIENT_ADDRESS'),
  UDP_CLIENT_PORT: Number(env('UDP_CLIENT_PORT', '49006')),
  WS_ADDRESS: env('WS_ADDRESS'),
}

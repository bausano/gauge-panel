import { config } from './config'
import { EnvironmentVariableEmptyException } from './EnvironmentVariableEmptyException'

/**
 * Retrieves environment variable from process.
 *
 * @param key Which environment variable to return
 * @param def If the variable is not in the environment, default it
 * @return Value of the variable or default
 * @throws {EnvironmentVariableEmptyException}
 */
export function env<T> (key: string, def?: T) : T {
  // Retrieves desired value from environment variables.
  const value: T = config[key]

  if (value === undefined && def === undefined) {
    throw new EnvironmentVariableEmptyException
  }

  return value || def
}

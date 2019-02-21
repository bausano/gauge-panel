import { config } from './config'
import { EnviromentVariableEmptyException } from './EnviromentVariableEmptyException'

/**
 * Retrieves enviroment variable from process.
 *
 * @param key Which enviroment variable to return
 * @param def If the variable is not in the enviroment, default it
 * @return Value of the variable or default
 * @throws {EnviromentVariableEmptyException}
 */
export function env<T> (key: string, def?: T) : T {
  // Retrives desired value from enviroment variables.
  const value: T = config[key]

  if (value === undefined && def === undefined) {
    throw new EnviromentVariableEmptyException
  }

  return value || def
}

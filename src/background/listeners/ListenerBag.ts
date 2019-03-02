
export class ListenerBag<T> {

  /**
   * Listener hooks.
   */
  private listeners: Array<(message: T) => void> = []

  /**
   * Adds listener to the bag.
   *
   * @param listener Closure that receives a message and handles it
   */
  public addListener (listener: (message: T) => void) : void {
    this.listeners.push(listener)
  }

  /**
   * Emits message to all listeners.
   *
   * @param message Message to emit to listeners
   */
  public trigger (message: T) : void {
    this.listeners.forEach (listener => listener(message))
  }

}

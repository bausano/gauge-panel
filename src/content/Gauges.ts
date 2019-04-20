
export interface Gauges {

  /**
   * References airspeed indicator element.
   */
  asi: Element

  /**
   * Flight director attitude indicator elements.
   */
  fdai: {
    /**
     * Whether the nose is left or right and by how much.
     */
    yaw: Element,

    /**
     * Whether the nose is up or down and by how much.
     */
    pitch: Element,
  }

  /**
   * Needles for indicating altitude.
   */
  altimeter: {

    /**
     * Shows hundreds of feet.
     */
    needle: Element,

    /**
     * Shows thousands of feet.
     */
    needleSmall: Element,

  }

  /**
   * Rate of climb and descent indicator.
   */
  variometer: Element

  /**
   * Shows rate or turn and standard rate of turn approximation.
   */
  turnCoordinator: {

    /**
     * Shows rate of turn.
     */
    plane: Element,

  },

  /**
   * Towards which pole is the airplane heading.
   */
  heading: Element

}

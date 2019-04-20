
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
     * Shows slip.
     */
    dot: Element,

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

/**
 * Returns object that holds all references to gauge elements.
 *
 * @param document DOM reference
 * @return Object with gauge elements
 */
export const gaugesFactory: (document: Document) => Gauges = (document) => {
  return {
    altimeter: {
      needle: document.querySelector('.is-altimeter .needle'),
      needleSmall: document.querySelector('.is-altimeter .needle-small'),
    },
    asi: document.querySelector('.is-air-speed-indicator .needle'),
    fdai: {
      pitch: document.querySelector('.is-attitude-indicator .pitch'),
      yaw: document.querySelector('.is-attitude-indicator .yaw-wrapper'),
    },
    heading: document.querySelector('.is-heading-indicator .frame'),
    turnCoordinator: {
      dot: document.querySelector('.is-turn-coordinator .dot'),
      plane: document.querySelector('.is-turn-coordinator .plane'),
    },
    variometer: document.querySelector('.is-variometer .needle'),
  }
}

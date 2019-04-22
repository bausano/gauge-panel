/**
 * Prepares global document stub.
 *
 * Var elements stubs HTML elements and stores their style attribute.
 */
const elements = {}
;(global as any).document = { querySelector: el => ({
  setAttribute: (_, v) => elements[el] = v
})}

import { expect } from 'chai'
import { Topic } from '@internal/content/Topic'
import { listen } from '@internal/content/listen'

describe('Transformers', () => {

  const tab: any = {}

  before(() => {
    listen({
      on: (topic, callback) => tab[topic] = callback
    } as any)
  })

  it('attaches listeners to the content script', () => {
    tab['app.booted']()

    expect(tab).to.have.property(`gauge.${Topic.AIRSPEED}`)
    expect(tab).to.have.property(`gauge.${Topic.ALTITUDE}`)
    expect(tab).to.have.property(`gauge.${Topic.HEADING}`)
    expect(tab).to.have.property(`gauge.${Topic.PITCH}`)
    expect(tab).to.have.property(`gauge.${Topic.ROLL}`)
    expect(tab).to.have.property(`gauge.${Topic.SLIP}`)
    expect(tab).to.have.property(`gauge.${Topic.TURN_RATE}`)
    expect(tab).to.have.property(`gauge.${Topic.VVI_FPM}`)
  })

  it('transforms altitude', () => {
    tab[`gauge.${Topic.ALTITUDE}`]('', 15300)

    expect(elements['.is-altimeter .needle'])
      .to.equal('transform: rotate(108deg)')
    expect(elements['.is-altimeter .needle-small'])
      .to.equal('transform: rotate(550.8deg)')
  })

  it('transforms airspeed', () => {
    tab[`gauge.${Topic.AIRSPEED}`]('', 130)

    expect(elements['.is-air-speed-indicator .needle'])
      .to.equal('transform: rotate(225deg)')
  })

  it('transforms climb', () => {
    tab[`gauge.${Topic.VVI_FPM}`]('', 500)

    expect(elements['.is-variometer .needle'])
      .to.equal('transform: rotate(-45deg)')
  })

  it('transforms pitch', () => {
    tab[`gauge.${Topic.PITCH}`]('', 10)

    expect(elements['.is-attitude-indicator .pitch'])
      .to.equal('transform: translate(0px, 15px)')
  })

  it('transforms slip', () => {
    tab[`gauge.${Topic.SLIP}`]('', 3)

    expect(elements['.is-turn-coordinator .dot'])
      .to.equal('transform: translate(-27px, 0px)')
  })

  it('transforms turn rate', () => {
    tab[`gauge.${Topic.TURN_RATE}`]('', 10)

    expect(elements['.is-turn-coordinator .plane'])
      .to.equal('transform: rotate(10deg)')
  })

})

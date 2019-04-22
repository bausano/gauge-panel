import { expect } from 'chai'

import {
  airspeed, altitudeInThousands, altitudeInHundreds, climbFpm, pitch, slip, turnRate
} from '@internal/content/normalizations'

describe('Value normalizations', () => {

  it('normalizes the airspeed', () => {
    expect(airspeed(50)).to.equal(45)
    expect(airspeed(70)).to.equal(90)
    expect(airspeed(90)).to.equal(133.90243902439025)
    expect(airspeed(107.5)).to.equal(180)
    expect(airspeed(130)).to.equal(225)
    expect(airspeed(160)).to.equal(270)
    expect(airspeed(200)).to.equal(315)
    expect(airspeed(210)).to.equal(315)
  })

  it('normalizes the altitude in thousands', () => {
    expect(altitudeInThousands(15000)).to.equal(540)
  })

  it('normalizes the altitude in hundreds', () => {
    expect(altitudeInHundreds(15300)).to.equal(108)
  })

  it('normalizes the climb feet per minute', () => {
    expect(climbFpm(10000)).to.equal(90)
    expect(climbFpm(-10000)).to.equal(-270)
    expect(climbFpm(500)).to.equal(-45)
    expect(climbFpm(0)).to.equal(-90)
  })

  it('normalizes the pitch', () => {
    expect(pitch(100)).to.equal(38)
    expect(pitch(-100)).to.equal(-38)
    expect(pitch(10)).to.equal(15)
  })

  it('normalizes the slip', () => {
    expect(slip(10)).to.equal(-72)
    expect(slip(-10)).to.equal(72)
    expect(slip(3)).to.equal(-27)
  })

  it('normalizes the turn rate', () => {
    expect(turnRate(75)).to.equal(70)
    expect(turnRate(-75)).to.equal(-70)
    expect(turnRate(10)).to.equal(10)
  })

})

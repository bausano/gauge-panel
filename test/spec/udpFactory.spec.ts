import { expect } from 'chai'
import { bootUserDatagramProtocolClient } from '@internal/background/clients'
import { UserDatagramProtocolClient } from '@internal/background/clients/UserDatagramProtocolClient'

describe('UDP Factory', () => {

  it('returns a new client', () => {
    const client = bootUserDatagramProtocolClient()

    expect(client).to.be.instanceOf(UserDatagramProtocolClient)
  })

})

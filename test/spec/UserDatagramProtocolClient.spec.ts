import { spy } from 'sinon'
import { expect } from 'chai'
import { Topic } from '@internal/background/Topic'
import { ListenerBag } from '@internal/background/ListenerBag'
import { PongException } from '@internal/background/clients/PongException'
import { UserDatagramProtocolClient } from '@internal/background/clients/UserDatagramProtocolClient'

describe('UserDatagramProtocolClient', () => {

  const log = global.console.log

  let messages: any[] = []
  let udp: any
  let client: any
  let bag: ListenerBag<Topic>

  beforeEach(() => {
    messages = []
    udp = {
      bind: () => {},
      address: () => 'test',
      on (message, payload) {
        messages.push({ message, payload })
      },
    }
    bag = new ListenerBag
    client = new UserDatagramProtocolClient(bag, udp)
    //global.console.log = () => {}
  })

  after(() => {
    global.console.log = log
  })

  it('registers listening message', () => {
    client.ping = spy()

    expect(messages[0]).to.have.property('message').equal('listening')
    expect(messages[0].payload).to.be.a('function')

    messages[0].payload()

    expect(client.ping.calledOnce).to.be.ok
  })

  it('registers on closed callbacks', () => {
    const sinonSpy = spy()
    const storedClearTimeout = global.clearTimeout

    global.clearTimeout = sinonSpy

    messages[1].payload()
    messages[2].payload()

    global.clearTimeout = storedClearTimeout

    expect(sinonSpy.calledTwice).to.be.ok
  })

  it('starts the udp', (done) => {
    udp.bind = (port, address) => {
      try {
        expect(port).to.be.a('number')
        expect(address).to.be.a('string')
        done()
      } catch (error) {
        done(error)
      }
    }

    client.listen()
  })

  it('triggers a message', (done) => {
    bag.addListener((value) => {
      try {
        expect(value).to.equal('test')
        done()
      } catch (error) {
        done(error)
      }
    })

    client.parseRawMessage = m => m

    client.listen()

    messages.pop().payload('test')
  })

  it('triggers a ping pong chain', (done) => {
    client.ping = done

    client.parseRawMessage = () => {
      throw new PongException
    }

    client.listen()

    messages.pop().payload('test')
  })

  it('pings', (done) => {
    udp.close = () => {}
    client.send = (buffer) => {
      try {
        expect(buffer.toString()).to.equal('000000000ping/gauge_panel')
        done()
      } catch (error) {
        done(error)
      }

      return Promise.resolve()
    }

    client.ping()
  })

  it('parses raw message with error on gibberish', () => {
    try {
      client.parseRawMessage(Buffer.from('test'))
      expect(false).to.be.ok
    } catch (error) {
      expect(error).not.to.be.instanceOf(PongException)
    }
  })

  it('parses raw pong message', () => {
    try {
      client.parseRawMessage(Buffer.from('DREF00000ping_gauge_panel'))
      expect(false).to.be.ok
    } catch (error) {
      expect(error).to.be.instanceOf(PongException)
    }
  })

  it('parses raw reference message', () => {
    const topic: Topic = client.parseRawMessage(Buffer.from('DREF09536test'))

    expect(topic.reference).to.be.equal('test')
    expect(topic.value).to.be.a('number')
  })

  it('sends a message', (done) => {
    udp.send = (data, port, address, callback) => {
      try {
        expect(data).to.be.equal('test')
        expect(port).to.be.a('number')
        expect(address).to.be.a('string')
        callback()
        done()
      } catch (error) {
        done(error)
      }
    }

    client.send('test')
  })

  it('sends a message with error', async () => {
    udp.send = (_data, _port, _address, callback) => {
      callback(new Error('test'))
    }

    expect(
      await client.send('test').catch(e => e.message)
    ).to.be.equal('test')
  })

})


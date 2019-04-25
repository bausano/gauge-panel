import { expect } from 'chai'
import { App } from '@internal/background/App'
import { Topic } from '@internal/background/Topic'
import { ListenerBag } from '@internal/background/ListenerBag'

describe('App', () => {

  it('adds listener to messages', () => {
    const bag: ListenerBag<Topic> = new ListenerBag

    const app: App = new App(
      {
        send: () => {}
      } as any,
      {
        bag,
        listen: () => {},
      } as any,
    )

    app.boot()

    expect((bag as any).listeners).to.have.lengthOf(1)
  })

  it('boots client', (done) => {
    const app: App = new App(
      {
        send: () => {}
      } as any,
      {
        bag: new ListenerBag,
        listen: done,
      } as any,
    )

    app.boot()
  })

  it('boots content', (done) => {
    const app: App = new App(
      {
        send (topic) {
          try {
            expect(topic).to.be.equal('app.booted')
            done()
          } catch (error) {
            done(error)
          }
        }
      } as any,
      {
        bag: new ListenerBag,
        listen: () => {},
      } as any,
    )

    app.boot()
  })

  it('sends messages to content', () => {
    const bag: ListenerBag<Topic> = new ListenerBag
    let topicStored: Topic = null
    let valueStored: number = null

    const app: App = new App(
      {
        send: (topic, value) => {
          topicStored = topic
          valueStored = value
        }
      } as any,
      {
        bag,
        listen: () => {},
      } as any,
    )

    app.boot()

    bag.trigger({ reference: 'test', value: 1, })

    expect(valueStored).to.equal(1)
    expect(topicStored).to.equal('gauge.test')
  })

})

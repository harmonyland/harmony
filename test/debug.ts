import { Client, event } from '../mod.ts'
import { TOKEN } from './config.ts'

class MyClient extends Client {
  constructor() {
    super({
      token: TOKEN,
      intents: []
    })
  }

  @event()
  ready(): void {
    console.log('Connected!')
  }

  debug(title: string, msg: string): void {
    console.log(`[${title}] ${msg}`)
  }
}

const client = new MyClient()
client.connect()

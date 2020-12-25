import { Webhook } from '../mod.ts'
import { WEBHOOK } from './config.ts'

const webhook = await Webhook.fromURL(WEBHOOK)
console.log('Fetched webhook!')

webhook
  .send('Hello World', {
    name: 'OwO'
  })
  .then(() => 'Sent message!')

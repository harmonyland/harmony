import * as discord from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new discord.Client({
  intents: ['GUILDS'],
  token: TOKEN,
  shardCount: 20
})

// eslint-disable-next-line prefer-const
let started: number

client.on('shardReady', (shard) => {
  console.log(`Shard ${shard} ready!`)
})

client.once('ready', (shards) => {
  console.log(`Launched ${shards} shards! Time: ${performance.now() - started}`)
})

console.log('Connecting...')

started = performance.now()
client.connect()

import {
  startBot,
  ws
} from 'https://raw.githubusercontent.com/discordeno/discordeno/main/mod.ts'
import { TOKEN2 } from './config.ts'

const started = Date.now()
let shardTime = Date.now()

ws.lastShardId = 4
ws.maxShards = 5

startBot({
  token: TOKEN2,
  intents: ['Guilds'],
  eventHandlers: {
    shardReady(shardId: number) {
      const shard = ws.shards.get(shardId)!
      console.log(`[SHARD_READY] ${shard.id}`, (Date.now() - shardTime) / 1000)
      shardTime = Date.now()
    },
    shardFailedToLoad(shardId) {
      const shard = ws.shards.get(shardId)!
      console.log(`[SHARD_FAILED_TO_LOAD]`, shard.id, shard.unavailableGuildIds)
    },
    ready() {
      console.log(
        '[READY] The bot is connected and responsvie, took',
        (Date.now() - started) / 1000
      )
    }
  }
})

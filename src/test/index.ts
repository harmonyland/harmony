import { Client } from '../models/client.ts'
import { GatewayIntents } from '../types/gatewayTypes.ts'
import { TOKEN } from './config.ts'

const bot = new Client()

bot.connect(TOKEN, [GatewayIntents.GUILD_MESSAGES])

import { Client } from '../models/client.ts'
import { GatewayIntents } from '../types/gatewayTypes.ts'

const bot = new Client()

bot.connect('NDMzMjc2NDAyOTM1MjY3MzI4.WszOGA.KlnMe_LImd1DxcurGvj_x0HOEmc', [
  GatewayIntents.GUILD_MESSAGES
])

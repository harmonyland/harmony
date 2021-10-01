/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { CommandClient, CommandContext, Command } from '../mod.ts'
import { Keydb } from 'https://deno.land/x/keydb@1.0.0/sqlite.ts'
import { TOKEN } from './config.ts'

const client = new CommandClient({
  prefix: '.',
  owners: ['422957901716652033'],
  token: TOKEN,
  intents: ['GUILDS', 'GUILD_MESSAGES']
})

interface CustomContext extends CommandContext {
  coins: number
}

const db = new Keydb('sqlite://./test/data/db.sqlite')

// client.use(async (ctx: CustomContext, next) => {
//   if (client.owners.includes(ctx.author.id)) return next()
// })

client.use(async (ctx: CustomContext, next) => {
  ctx.coins = (await db.get<number>(`coins_${ctx.author.id}`)) ?? 0
  return next()
})

client.commands.add(
  class extends Command {
    name = 'balance'
    aliases = ['bal', 'wallet']

    async execute(ctx: CustomContext): Promise<void> {
      await ctx.message.reply(`Your have ${ctx.coins} coins.`)
    }
  }
)

client.commands.add(
  class extends Command {
    name = 'setbalance'
    aliases = ['setbal']
    usage = ['<coins>', '[@user]']
    ownerOnly = true

    async execute(ctx: CustomContext): Promise<void> {
      const bal = parseInt(ctx.rawArgs[0].replaceAll(/\D/g, ''))
      const user = ctx.message.mentions.users.first() ?? ctx.message.author

      await db.set(`coins_${user.id}`, bal)

      await ctx.message.reply(`Set \`${user.tag}\`'s balance to ${bal}.`)
    }
  }
)

await client.connect()
console.log('Connected!')

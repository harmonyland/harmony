import {
  CommandClient,
  Command,
  CommandContext,
  GatewayIntents
} from '../mod.ts'

const client = new CommandClient({
  prefix: '!'
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

console.log('Harmony - Command Example')

class Ping extends Command {
  name = 'ping'

  // There're beforeExecute and afterExecute too
  execute(ctx: CommandContext): void {
    console.log('Command Used: Ping')
    ctx.message.reply('Pong!')
  }
}

class Pong extends Command {
  name = 'pong'
  aliases = ['pong', 'pongpingpong'] // Bot will respond for !pong and !pongpingpong

  execute(ctx: CommandContext): void {
    console.log('Command Used: Pong')
    ctx.message.reply('Ping!')
  }
}

client.commands.add(new Ping())
client.commands.add(Pong)

const token = prompt('Input Bot Token:')
if (token === null) {
  console.log('No token provided')
  Deno.exit()
}

// You can also use Intents.None (all intents without priviliged ones, Intents.All has all of them)
// to not have to specify intents manually, but it is recommended to specify intents only which are needed!
// It makes your bot more memory efficient and uses less bandwidth.
client.connect(token, [
  GatewayIntents.GUILD_MESSAGES,
  GatewayIntents.GUILDS,
  GatewayIntents.DIRECT_MESSAGES
])

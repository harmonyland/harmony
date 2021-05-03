import { CommandClient, Command, CommandContext, Intents } from '../mod.ts'

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

client.connect(token, Intents.None)

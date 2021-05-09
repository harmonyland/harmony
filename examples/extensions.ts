import {
  CommandClient,
  Command,
  CommandContext,
  Message,
  Extension,
  GatewayIntents
} from '../mod.ts'

const client = new CommandClient({
  prefix: '!'
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

console.log('Harmony - Extension Example')

class Ping extends Command {
  name = 'ping'

  // There're beforeExecute and afterExecute too
  execute(ctx: CommandContext): void {
    console.log('Command Used: Ping')
    ctx.message.reply('Pong!')
  }
}

class FancyExtension extends Extension {
  constructor(client: CommandClient) {
    super(client)
    this.listen('messageDelete', (_, msg: Message) => {
      console.log(
        `Message Deleted: ${msg.id}, ${msg.author.tag}, ${msg.content}`
      )
    })

    this.commands.add(Ping)
  }
}

client.extensions.load(FancyExtension)

const token = prompt('Input Bot Token:')
if (token === null) {
  console.log('No token provided')
  Deno.exit()
}

// You can also use Intents.None (all intents without priviliged ones, Intents.All has all of them)
// to not have to specify intents manually, but it is recommended to specify intents only which are needed!
// It makes your bot more memory efficient and uses less bandwidth.
client.connect(token, [
  GatewayIntents.GUILDS,
  GatewayIntents.GUILD_MESSAGES,
  GatewayIntents.DIRECT_MESSAGES
])

import {
  CommandClient,
  Command,
  CommandContext,
  Message,
  Extension,
  Intents
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
    this.client.on('messageDelete', (msg: Message) => {
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

client.connect(token, Intents.None)

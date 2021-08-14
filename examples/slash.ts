import {
  Client,
  GatewayIntents,
  event,
  slash,
  ApplicationCommandInteraction,
  ApplicationCommandOptionType
} from '../mod.ts'

export class MyClient extends Client {
  @event()
  async ready(): Promise<void> {
    console.log(`Logged in as ${this.user?.tag}!`)
    // Run this only when you're running this first time
    const commands = await this.slash.commands.all()
    if (commands.size !== 1) {
      this.slash.commands.bulkEdit([
        {
          name: 'ping',
          description: "It's literally ping command. What did you expect?",
          options: [
            {
              name: 'pingarg',
              description: 'Again literally pingArg',
              required: false,
              type: ApplicationCommandOptionType.STRING
            }
          ]
        }
      ])
    }
  }

  @slash()
  ping(d: ApplicationCommandInteraction): void {
    const arg = d.option<string | undefined>('pingarg')
    d.reply(`Pong! You typed: ${arg !== undefined ? arg : 'nothing'}`)
  }
}

console.log('Harmony - Slash Command Example')

const client = new MyClient()

const token = prompt('Input Bot Token:')
if (token === null) {
  console.log('No token provided')
  Deno.exit()
}

// You can also use Intents.None (all intents without priviliged ones, Intents.All has all of them)
// to not have to specify intents manually, but it is recommended to specify intents only which are needed!
// It makes your bot more memory efficient and uses less bandwidth.
client.connect(token, [GatewayIntents.GUILDS])

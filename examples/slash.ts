import {
  Client,
  Intents,
  event,
  slash,
  SlashCommandInteraction,
  SlashCommandOptionType
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
              type: SlashCommandOptionType.STRING
            }
          ]
        }
      ])
    }
  }

  @slash()
  ping(d: SlashCommandInteraction): void {
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

client.connect(token, Intents.None)

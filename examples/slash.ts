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
  ready(): void {
    console.log(`Logged in as ${this.user?.tag}!`)
    // Run this only when you're running this first time
    // this.slash.commands.create({
    //   name: 'test',
    //   description: "It's literally test command. What did you expect?",
    //   options: [
    //     {
    //       name: 'testArg',
    //       description: 'Again literally arg for testing',
    //       required: false,
    //       type: SlashCommandOptionType.STRING
    //     }
    //   ]
    // })
  }

  @slash()
  test(d: SlashCommandInteraction): void {
    console.log(d.resolved)
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

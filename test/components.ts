import {
  CommandClient,
  Command,
  CommandContext,
  ButtonStyle,
  MessageComponentType,
  isMessageComponentInteraction,
  MessageComponentInteraction,
  Message
} from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new CommandClient({
  prefix: '.',
  spacesAfterPrefix: true
})

enum Choice {
  Rock,
  Paper,
  Scissor
}

const games = new Map<
  string,
  { user: number; bot: number; msg: Message; txt: string }
>()
const components = [
  {
    type: MessageComponentType.ActionRow,
    components: [
      {
        type: MessageComponentType.Button,
        style: ButtonStyle.PRIMARY,
        label: 'Rock',
        customID: 'rps::Rock'
      },
      {
        type: MessageComponentType.Button,
        style: ButtonStyle.PRIMARY,
        label: 'Paper',
        customID: 'rps::Paper'
      },
      {
        type: MessageComponentType.Button,
        style: ButtonStyle.PRIMARY,
        label: 'Scissor',
        customID: 'rps::Scissor'
      }
    ]
  }
]

client.once('ready', () => {
  console.log('Ready!')
})

client.commands.add(
  class extends Command {
    name = 'button'

    execute(ctx: CommandContext): void {
      ctx.channel.send('Test Buttons', {
        components: [
          {
            type: MessageComponentType.ActionRow,
            components: [
              {
                type: MessageComponentType.Button,
                label: 'Primary',
                style: ButtonStyle.PRIMARY,
                customID: '1'
              },
              {
                type: MessageComponentType.Button,
                label: 'Secondary',
                style: ButtonStyle.SECONDARY,
                customID: '2'
              },
              {
                type: MessageComponentType.Button,
                label: 'Destructive',
                style: ButtonStyle.DESTRUCTIVE,
                customID: '3'
              },
              {
                type: MessageComponentType.Button,
                label: 'Success',
                style: ButtonStyle.SUCCESS,
                customID: '4'
              },
              {
                type: MessageComponentType.Button,
                label: 'Link',
                style: ButtonStyle.LINK,
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              }
            ]
          }
        ]
      })
    }
  }
)

client.commands.add(
  class extends Command {
    name = 'select'

    execute(ctx: CommandContext): void {
      ctx.channel.send('Test Select', {
        components: [
          {
            type: MessageComponentType.ActionRow,
            components: [
              {
                type: MessageComponentType.Select,
                customID: 'null',
                options: [
                  {
                    label: 'Hello',
                    value: 'World'
                  },
                  {
                    label: 'World',
                    value: 'Hello'
                  }
                ]
              }
            ]
          }
        ]
      })
    }
  }
)

client.commands.add(
  class extends Command {
    name = 'play'

    execute(ctx: CommandContext): any {
      if (games.has(ctx.author.id))
        return ctx.message.reply('You are already playing!')
      ctx.channel
        .send('Game starts now!', {
          components
        })
        .then((msg) => {
          games.set(ctx.author.id, {
            user: 0,
            bot: 0,
            msg,
            txt: 'Game starts now!'
          })
        })
    }
  }
)

// client.on('raw', (e, d) => {
//   if (e === 'INTERACTION_CREATE') console.log(e, d)
// })

client.on('interactionCreate', (i) => {
  if (isMessageComponentInteraction(i) === true) {
    const d = i as MessageComponentInteraction

    if (d.customID.startsWith('rps::') === true) {
      const game = games.get(d.user.id)
      if (game === undefined) return
      const choice = d.customID.split('::')[1]
      const c: number = Number(Choice[choice as any])
      const rand = Math.floor(Math.random() * 2)

      game.txt += '\n\n'
      game.txt += `You: ${choice}, Bot: ${Choice[rand]}`
      let msg
      if (rand === c) {
        msg = 'Both chose ' + Choice[rand] + '!'
      } else if (
        (rand === 0 && c === 2) ||
        (rand === 1 && c === 0) ||
        (rand === 2 && c === 1)
      ) {
        msg = 'Bot got one point!'
        game.bot++
      } else {
        msg = 'You got one point!'
        game.user++
      }
      game.txt += '\nInfo: ' + msg

      if (game.bot === 5 || game.user === 5) {
        const won = game.bot === 5 ? 'Bot' : 'You'
        game.msg.edit(
          `${won} won!\n\n**Points:** You: ${game.user} | Bot: ${game.bot}`,
          {
            components: []
          }
        )
        games.delete(d.user.id)
      } else {
        game.msg.edit(
          `${game.txt}\n\n**Points:** You: ${game.user} | Bot: ${game.bot}`,
          {
            components
          }
        )
      }
    }
  }
})

console.log('Connecting...')
client.connect(TOKEN, ['GUILDS', 'GUILD_MESSAGES'])

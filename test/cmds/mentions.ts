import { Command, Embed, CommandContext } from '../../mod.ts'

export default class PingCommand extends Command {
  name = 'mentions'
  aliases = ['m']

  execute(ctx: CommandContext): void {
    const embed = new Embed()
      .setTitle('Mentions')
      .addField(
        'Users',
        `${
          ctx.message.mentions.users.size === 0 ? `None` : ''
        }${ctx.message.mentions.users.map((u) => u.toString()).join(', ')}`
      )
      .addField(
        'Channels',
        `${
          ctx.message.mentions.channels.size === 0 ? `None` : ''
        }${ctx.message.mentions.channels.map((u) => u.toString()).join(', ')}`
      )
      .addField(
        'Roles',
        `${
          ctx.message.mentions.roles.size === 0 ? `None` : ''
        }${ctx.message.mentions.roles.map((u) => u.toString()).join(', ')}`
      )
      .addField(
        'Everyone?',
        ctx.message.mentions.everyone === true ? 'Yes' : 'No'
      )
      .setColor(0xff0000)
    ctx.message.channel.send(embed)
  }
}

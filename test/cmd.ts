import {
  Command,
  CommandClient,
  Intents,
  CommandContext,
  Extension,
  GuildChannels,
  Invite
} from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new CommandClient({
  prefix: ['pls', '!'],
  spacesAfterPrefix: true,
  mentionPrefix: true,
  owners: ['422957901716652033']
})

client.on('debug', console.log)

client.on('ready', () => {
  console.log(`[Login] Logged in as ${client.user?.tag}!`)
})

client.on('messageDelete', (msg) => {
  console.log(`Message Deleted: ${msg.id}, ${msg.author.tag}, ${msg.content}`)
})

client.on('messageUpdate', (before, after) => {
  console.log('Message Update')
  console.log(`Before: ${before.author.tag}: ${before.content}`)
  console.log(`After: ${after.author.tag}: ${after.content}`)
})

client.on('guildMemberAdd', (member) => {
  console.log(`Member Join: ${member.user.tag}`)
})

client.on('guildMemberRemove', (member) => {
  console.log(`Member Leave: ${member.user.tag}`)
})

client.on('guildRoleCreate', (role) => {
  console.log(`Role Create: ${role.name}`)
})

client.on('guildRoleDelete', (role) => {
  console.log(`Role Delete: ${role.name}`)
})

client.on('guildRoleUpdate', (role, after) => {
  console.log(`Role Update: ${role.name}, ${after.name}`)
})

client.on('guildIntegrationsUpdate', (guild) => {
  console.log(`Guild Integrations Update: ${guild.name}`)
})

client.on('webhooksUpdate', (guild, channel) => {
  console.log(`Webhooks Updated in #${channel.name} from ${guild.name}`)
})

client.on('commandError', console.error)
client.on('inviteCreate', (invite: Invite) => {
  console.log(`Invite Create: ${invite.code}`)
})

client.on('inviteDelete', (invite: Invite) => {
  console.log(`Invite Delete: ${invite.code}`)
})

client.on('inviteDeleteUncached', (invite) => {
  console.log(invite)
})

client.on('commandError', console.error)

class ChannelLog extends Extension {
  onChannelCreate(ext: Extension, channel: GuildChannels): void {
    console.log(`Channel Created: ${channel.name}`)
  }

  load(): void {
    this.listen('channelCreate', this.onChannelCreate)

    class Pong extends Command {
      name = 'Pong'

      execute(ctx: CommandContext): void {
        ctx.message.reply('Ping!')
      }
    }

    this.commands.add(Pong)
  }
}

client.extensions.load(ChannelLog)

client.on('messageDeleteBulk', (channel, messages, uncached) => {
  console.log(
    `=== Message Delete Bulk ===\nMessages: ${messages
      .map((m) => m.id)
      .join(', ')}\nUncached: ${[...uncached.values()].join(', ')}`
  )
})

client.on('channelUpdate', (before, after) => {
  console.log(
    `Channel Update: ${(before as GuildChannels).name}, ${
      (after as GuildChannels).name
    }`
  )
})

client.on('voiceStateAdd', (state) => {
  console.log('VC Join', state.user.tag)
})

client.on('voiceStateRemove', (state) => {
  console.log('VC Leave', state.user.tag)
})

client.on('messageReactionAdd', (reaction, user) => {
  console.log(`${user.tag} reacted with ${reaction.emoji.name}`)
})

client.on('messageReactionRemove', (reaction, user) => {
  console.log(`${user.tag} removed reaction ${reaction.emoji.name}`)
})

client.on('messageReactionRemoveEmoji', (message, emoji) => {
  console.log(`All ${emoji.name} emoji reactions removed from ${message.id}`)
})

client.on('messageReactionRemoveAll', (message) => {
  console.log(`All reactions remove from Message: ${message.id}`)
})

// client.on('raw', (evt: string) => console.log(`EVENT: ${evt}`))

const files = Deno.readDirSync('cmds')

for (const file of files) {
  const module = await import(`./cmds/${file.name}`)
  // eslint-disable-next-line new-cap
  const cmd = new module.default()
  client.commands.add(cmd)
  console.log(`Loaded command ${cmd.name}!`)
}

console.log(`Loaded ${client.commands.count} commands!`)

client.connect(TOKEN, Intents.create(['GUILD_MEMBERS', 'GUILD_PRESENCES']))

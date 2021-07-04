import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildPayload } from '../../types/guild.ts'
import { GuildChannelPayload } from '../../types/channel.ts'

export const guildCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildPayload
) => {
  const hasGuild: Guild | undefined = await gateway.client.guilds.get(d.id)
  await gateway.client.guilds.set(d.id, d)
  const guild = (await gateway.client.guilds.get(d.id)) as unknown as Guild

  if (d.members !== undefined) await guild.members.fromPayload(d.members)

  if (d.channels !== undefined) {
    for (const ch of d.channels as GuildChannelPayload[]) {
      ch.guild_id = d.id
      await gateway.client.channels.set(ch.id, ch)
    }
  }

  if (d.threads !== undefined) {
    for (const data of d.threads) {
      await guild.threads.set(data.id, data)
    }
  }

  await guild.roles.fromPayload(d.roles)

  if (d.presences !== undefined) await guild.presences.fromPayload(d.presences)

  if (d.voice_states !== undefined)
    await guild.voiceStates.fromPayload(d.voice_states)

  for (const emojiPayload of d.emojis) {
    if (emojiPayload.id === null) continue
    if (emojiPayload.user !== undefined) {
      await gateway.client.users.set(emojiPayload.user.id, emojiPayload.user)
    }
    await gateway.client.emojis.set(emojiPayload.id, emojiPayload)
  }

  if (hasGuild === undefined) {
    // It wasn't lazy load, so emit event
    gateway.client.emit('guildCreate', guild)
  } else {
    if (gateway._guildsLoaded !== undefined) {
      gateway._guildsLoaded++
      gateway._checkGuildsLoaded()
    }
    gateway.client.emit('guildLoaded', guild)
  }
}

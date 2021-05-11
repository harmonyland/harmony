import {
  Client,
  Intents
  // Verification
  // PermissionFlags,
  // ChannelTypes,
  // GuildCreateOptions
} from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client()

// client.on('guildLoaded', async (guild) => {
//   if (guild.name === 'OH WOW') {
//     guild.delete()
//   }
// })

// client.on('ready', async () => {
//   await new Promise((resolve, reject) => setTimeout(resolve, 1000))
//   const body: GuildCreateOptions = {
//     name: 'OH WOW',
//     icon: 'https://helloyunho.xyz/_dist_/images/avatar.png',
//     verificationLevel: Verification.NONE,
//     roles: [
//       {
//         id: '1',
//         name: 'a role',
//         color: 0x103021,
//         hoist: false,
//         permissions: PermissionFlags.ADMINISTRATOR.toString(),
//         mentionable: true
//       }
//     ],
//     channels: [
//       {
//         name: 'fucking-awesome',
//         type: ChannelTypes.GUILD_TEXT,
//         id: '1'
//       }
//     ],
//     systemChannelID: '1'
//   }
//   const guild = await client.guilds.create(body)

//   const channels = await guild.channels.array()
//   console.log(channels.length)
//   const invite = await guild.invites.create(channels[0].id)
//   console.log(invite.link)
// })

// client.on('guildLoaded', async (guild) => {
//   if (guild.id === 'GUILD_ID') {
//     // const roles = await guild.roles.array()
//     // if (roles.length > 0) {
//     //   roles.forEach(async (role) => {
//     //     if (role.name !== '@everyone') {
//     //       role.addTo('USER_ID')
//     //     }
//     //   })
//     // }

//     // guild.edit({
//     //   name: 'OH BOI',
//     //   verificationLevel: Verification.MEDIUM
//     // })

//     // const role1 = await guild.roles.create({
//     //   name: 'IDK1'
//     // })
//     // const role2 = await guild.roles.create({
//     //   name: 'IDK2'
//     // })

//     // alert()

//     // await guild.roles.editPositions(
//     //   {
//     //     id: role1.id,
//     //     position: 1
//     //   },
//     //   {
//     //     id: role2.id,
//     //     position: 2
//     //   }
//     // )

//     // alert()

//     // role1.delete()
//     // role2.delete()

//     // const role = await guild.roles.create({
//     //   name: 'IDK'
//     // })

//     // alert()

//     // await role.edit({
//     //   name: 'DUMB'
//     // })

//     // alert()

//     // console.log(
//     //   await guild.getPruneCount({
//     //     days: 7,
//     //     includeRoles: ['ROLE_ID']
//     //   })
//     // )

//     // console.log(
//     //   await guild.prune({
//     //     days: 7,
//     //     includeRoles: ['ROLE_ID']
//     //   })
//     // )
//     // console.log(
//     //   await guild.prune({
//     //     days: 7,
//     //     computePruneCount: false,
//     //     includeRoles: ['ROLE_ID']
//     //   })
//     // )

//     // await guild.editWidget({
//     //   enabled: true,
//     //   channel: 'CHANNEL_ID'
//     // })

//     // console.log(await guild.getWidget())
//     // console.log(await guild.getVanity())
//     // console.log(await guild.getWidgetImageURL())
//   }
// })

client.connect(TOKEN, Intents.All)

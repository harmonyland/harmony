import { InteractionsClient, SlashCommand } from '../mod.ts'
import { TOKEN } from './config.ts'

export const slash = new InteractionsClient({ token: TOKEN })

let c: SlashCommand
slash.commands
  .create(
    {
      name: 'kick',
      description: 'Kicks a user',
      defaultPermission: false,
      options: [
        {
          type: 'USER',
          name: 'user',
          description: 'User to kick.'
        }
      ]
    },
    '783319033205751809'
  )
  .then((cmd) => {
    c = cmd
    cmd.setPermissions([
      {
        type: 'ROLE',
        id: '783319568512057386',
        permission: true
      },
      {
        type: 'ROLE',
        id: '783319460626956308',
        permission: true
      }
    ])
  })
  .then(() => {
    c.getPermissions().then(console.log)
  })

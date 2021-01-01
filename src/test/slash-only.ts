import { SlashClient } from '../models/slashClient.ts'
import { SlashCommandPartial } from '../types/slash.ts'
import { TOKEN } from './config.ts'

export const slash = new SlashClient({ token: TOKEN })

console.log(slash.modules)

// Cmd objects come here
const commands: SlashCommandPartial[] = []

console.log('Creating...')
commands.forEach((cmd) => {
  slash.commands
    .create(cmd, '!! Your testing guild ID comes here !!')
    .then((c) => console.log(`Created command ${c.name}!`))
    .catch((e) => `Failed to create ${cmd.name} - ${e.message}`)
})

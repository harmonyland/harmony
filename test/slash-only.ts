import { SlashClient } from '../src/interactions/slashClient.ts'
import { SlashCommandPartial } from '../src/types/slashCommands.ts'
import { TOKEN, GUILD } from './config.ts'

export const slash = new SlashClient({ token: TOKEN })

console.log(slash.modules)

// Cmd objects come here
const commands: SlashCommandPartial[] = []

console.log('Creating...')
commands.forEach((cmd) => {
  slash.commands
    .create(cmd, GUILD)
    .then((c) => console.log(`Created command ${c.name}!`))
    .catch((e) => `Failed to create ${cmd.name} - ${e.message}`)
})

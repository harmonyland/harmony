import { SlashClient } from '../models/slashClient.ts'
import { TOKEN } from './config.ts'

const slash = new SlashClient({ token: TOKEN })

slash.commands.all().then(console.log)

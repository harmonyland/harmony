import { SlashClient, SlashBuilder } from '../models/slashClient.ts'
import { TOKEN } from './config.ts'

const slash = new SlashClient({ token: TOKEN })

slash.commands.all().then(console.log)

const cmd = new SlashBuilder()
  .name('searchmusic')
  .description('Search for music.')
  .option((o) =>
    o.string({ name: 'query', description: 'Query to search with.' })
  )
  .option((o) =>
    o.string({
      name: 'engine',
      description: 'Search engine to use.',
      choices: [{ name: 'YouTube', value: 'youtube' }, 'Spotify']
    })
  )
  .options({
    query: {
      description: 'Query UWU',
      type: 3
    },
    engine: {
      description: 'Engine UWU',
      type: 3,
      choices: [
        { name: 'YouTube', value: 'youtube' },
        { name: 'Spotify', value: 'spotify' }
      ]
    }
  })

console.log(JSON.stringify(cmd.export()))

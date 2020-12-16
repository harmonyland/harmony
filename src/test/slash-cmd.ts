import { TOKEN } from './config.ts'

export const CMD = {
  name: 'blep',
  description: 'Send a random adorable animal photo',
  options: [
    {
      name: 'animal',
      description: 'The type of animal',
      type: 3,
      required: true,
      choices: [
        {
          name: 'Dog',
          value: 'animal_dog'
        },
        {
          name: 'Cat',
          value: 'animal_dog'
        },
        {
          name: 'Penguin',
          value: 'animal_penguin'
        }
      ]
    },
    {
      name: 'only_smol',
      description: 'Whether to show only baby animals',
      type: 5,
      required: false
    }
  ]
}

// fetch('https://discord.com/api/v8/applications/783937840752099332/commands', {
fetch(
  'https://discord.com/api/v8/applications/783937840752099332/guilds/783319033205751809/commands',
  {
    method: 'POST',
    body: JSON.stringify(CMD),
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        'Bot ' + TOKEN
    }
  }
)
  .then((r) => r.json())
  .then(console.log)

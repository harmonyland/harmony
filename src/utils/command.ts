interface MentionToRegex {
  [key: string]: RegExp
  mentionUser: RegExp
  mentionRole: RegExp
  mentionChannel: RegExp
}

const mentionToRegex: MentionToRegex = {
  mentionUser: /<@!?(\d{17,19})>|(\d{17,19})/,
  mentionRole: /<@&(\d{17,19})>|(\d{17,19})/,
  mentionChannel: /<#(\d{17,19})>|(\d{17,19})/
}

export type CommandArgumentMatchTypes =
  | 'flag'
  | 'mentionUser'
  | 'mentionRole'
  | 'mentionChannel'
  | 'content'
  | 'rest'

export interface Args<T = unknown> {
  name: string
  match: CommandArgumentMatchTypes
  defaultValue?: T
  flag?: string
}

export function parseArgs(
  commandArgs: Args[] | undefined,
  messageArgs: string[]
): Record<string, unknown> | null {
  if (commandArgs === undefined) return null

  const messageArgsNullableCopy: Array<string | null> = [...messageArgs]
  const args: Record<string, unknown> = {}

  for (const entry of commandArgs) {
    switch (entry.match) {
      case 'flag':
        parseFlags(args, entry, messageArgsNullableCopy)
        break
      case 'mentionUser':
      case 'mentionRole':
      case 'mentionChannel':
        parseMention(args, entry, messageArgsNullableCopy)
        break
      case 'content':
        parseContent(args, entry, messageArgs)
        break
      case 'rest':
        parseRest(args, entry, messageArgsNullableCopy)
        break
    }
  }
  return args
}

function parseFlags(
  args: Record<string, unknown>,
  entry: Args,
  argsNullable: Array<string | null>
): void {
  for (let i = 0; i < argsNullable.length; i++) {
    if (entry.flag === argsNullable[i]) {
      argsNullable[i] = null
      args[entry.name] = true
      break
    } else args[entry.name] = entry.defaultValue ?? false
  }
}

function parseMention(
  args: Record<string, unknown>,
  entry: Args,
  argsNullable: Array<string | null>
): void {
  const regex = mentionToRegex[entry.match]
  const index = argsNullable.findIndex(
    (x) => typeof x === 'string' && regex.test(x)
  )
  const regexMatches = regex.exec(argsNullable[index]!)
  args[entry.name] =
    regexMatches !== null
      ? regexMatches[0].replace(regex, '$1')
      : entry.defaultValue
  argsNullable[index] = null
}

function parseContent(
  args: Record<string, unknown>,
  entry: Args,
  argsNonNullable: Array<string | null>
): void {
  args[entry.name] =
    argsNonNullable.length > 0 ? argsNonNullable : entry.defaultValue
}

function parseRest(
  args: Record<string, unknown>,
  entry: Args,
  argsNullable: Array<string | null>
): void {
  const restValues = argsNullable.filter((x) => typeof x === 'string')
  args[entry.name] =
    restValues.length > 0 ? restValues?.join(' ') : entry.defaultValue
}

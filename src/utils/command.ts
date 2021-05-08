interface MentionToRegex {
  [key: string]: RegExp
  user: RegExp
  role: RegExp
  channel: RegExp
}

const mentionToRegex: MentionToRegex = {
  user: /<@!?(\d{17,19})>|(\d{17,19})/,
  role: /<@&(\d{17,19})>|(\d{17,19})/,
  channel: /<#(\d{17,19})>|(\d{17,19})/
}

interface ArgumentBase {
  name: string
}

export interface FlagArgument extends ArgumentBase {
  match: 'flag'
  flag: string
  defaultValue?: boolean
}

export interface MentionArgument extends ArgumentBase {
  match: 'user' | 'role' | 'channel'
  defaultValue?: string
}

export interface ContentArgument extends ArgumentBase {
  match: 'content'
  defaultValue?: string | number
  contentFilter?: (value: string, index: number, array: string[]) => boolean
}

export interface RestArgument extends ArgumentBase {
  match: 'rest'
  defaultValue?: string
}

export type Args =
  | FlagArgument
  | MentionArgument
  | ContentArgument
  | RestArgument

export function parseArgs(
  commandArgs: Args[] | undefined,
  messageArgs: string[]
): Record<string, string | number | boolean> | null {
  if (commandArgs === undefined) return null

  const messageArgsNullableCopy: Array<string | null> = [...messageArgs]
  const args: Record<string, string | number | boolean> = {}

  for (const entry of commandArgs) {
    switch (entry.match) {
      case 'flag':
        parseFlags(args, entry, messageArgsNullableCopy)
        break
      case 'user':
      case 'role':
      case 'channel':
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
  entry: FlagArgument,
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
  entry: MentionArgument,
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
  entry: ContentArgument,
  argsNonNullable: string[]
): void {
  args[entry.name] =
    argsNonNullable.length > 0
      ? entry.contentFilter !== undefined
        ? argsNonNullable.filter(entry.contentFilter)
        : argsNonNullable
      : entry.defaultValue
}

function parseRest(
  args: Record<string, unknown>,
  entry: RestArgument,
  argsNullable: Array<string | null>
): void {
  const restValues = argsNullable.filter((x) => typeof x === 'string')
  args[entry.name] =
    restValues.length > 0 ? restValues?.join(' ') : entry.defaultValue
}

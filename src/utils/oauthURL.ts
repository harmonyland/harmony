import { Constants } from '../types/constants.ts'
import type { OAuthScope } from '../types/oauth.ts'
import { Permissions } from './permissions.ts'

export interface OAuthURLOptions {
  clientID: string
  scopes: OAuthScope[]
  permissions?: string | bigint | Permissions
  redirectURI?: string
}

export function createOAuthURL(options: OAuthURLOptions): string {
  if (options.scopes.length < 1)
    throw new Error('Must provide at least one scope')

  return `${Constants.DISCORD_API_URL}/${
    Constants.DISCORD_API_VERSION
  }/oauth2/authorize?client_id=${options.clientID}&scopes=${[
    ...new Set(options.scopes)
  ]
    .map((e) => encodeURIComponent(e))
    .join('%20')}${
    options.permissions !== undefined || options.scopes.includes('bot')
      ? `&permissions=${
          typeof options.permissions === 'string'
            ? options.permissions
            : typeof options.permissions === 'bigint'
            ? options.permissions.toString()
            : typeof options.permissions === 'object' &&
              options.permissions !== null &&
              options.permissions instanceof Permissions
            ? options.permissions.bitfield.toString()
            : '0'
        }`
      : ''
  }${
    options.redirectURI !== undefined
      ? `&redirct_uri=${options.redirectURI}`
      : ''
  }`
}

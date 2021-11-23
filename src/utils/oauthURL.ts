import { PermissionFlags } from '../../mod.ts'
import { Constants } from '../types/constants.ts'
import type { OAuthScope } from '../types/oauth.ts'
import { Permissions } from './permissions.ts'

export interface OAuthURLOptions {
  clientID: string
  scopes: OAuthScope[]
  permissions?:
    | string
    | bigint
    | Permissions
    | Array<keyof typeof PermissionFlags | bigint>
  redirectURI?: string
}

export function createOAuthURL(options: OAuthURLOptions): string {
  if (options.scopes.length < 1)
    throw new Error('Must provide at least one scope')

  const params = new URLSearchParams({
    client_id: options.clientID,
    scopes: [...new Set(options.scopes)].join(' ')
  })

  if (options.permissions !== undefined) {
    let perms: string

    if (
      typeof options.permissions === 'string' ||
      typeof options.permissions === 'bigint'
    ) {
      perms = String(options.permissions)
    } else if (
      typeof options.permissions === 'object' &&
      options.permissions !== null &&
      options.permissions instanceof Permissions
    ) {
      perms = String(options.permissions.bitfield)
    } else if (Array.isArray(options.permissions)) {
      let acum = 0n
      for (const perm of options.permissions) {
        if (typeof perm === 'string') {
          const flag = PermissionFlags[perm]
          if (typeof flag !== 'number')
            throw new TypeError(`Invalid Permission Flag: ${flag}`)
          acum |= flag
        } else if (typeof perm === 'bigint') {
          acum |= perm
        } else throw new TypeError('Unexpected value in permissions array')
      }
      perms = String(acum)
    } else throw new TypeError(`Unexpected value for permissions`)
    params.set('permissions', perms)
  }

  if (options.permissions === undefined && options.scopes.includes('bot')) {
    params.set('permissions', '0')
  }

  if (typeof options.redirectURI === 'string') {
    params.set('redirect_uri', options.redirectURI)
  }

  return `${Constants.DISCORD_API_URL}/v${
    Constants.DISCORD_API_VERSION
  }/oauth2/authorize?${params.toString()}`
}

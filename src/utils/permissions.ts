// Ported from https://github.com/discordjs/discord.js/blob/master/src/util/Permissions.js
import { PermissionFlags } from '../types/permissionFlags.ts'
import { BitField, BitFieldResolvable } from './bitfield.ts'

export type PermissionResolvable =
  | string
  | string[]
  | number
  | number[]
  | Permissions
  | PermissionResolvable[]

/** Manages Discord's Bit-based Permissions */
export class Permissions extends BitField {
  static DEFAULT = 104324673
  static ALL = Object.values(PermissionFlags).reduce((all, p) => all | p, 0)

  constructor(bits: BitFieldResolvable) {
    super(PermissionFlags, bits)
  }

  any(permission: PermissionResolvable, checkAdmin = true): boolean {
    return (
      (checkAdmin && super.has(this.flags.ADMINISTRATOR)) ||
      super.any(permission as any)
    )
  }

  has(permission: PermissionResolvable, checkAdmin = true): boolean {
    return (
      (checkAdmin && super.has(this.flags.ADMINISTRATOR)) ||
      super.has(permission as any)
    )
  }
}

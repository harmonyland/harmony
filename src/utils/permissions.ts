// Ported from https://github.com/discordjs/discord.js/blob/master/src/util/Permissions.js
import { PermissionFlags } from '../types/permissionFlags.ts'
import { BitField, BitFieldResolvable } from './bitfield.ts'

export type PermissionResolvable = BitFieldResolvable

/** Manages Discord's Bit-based Permissions (updates only locally) */
export class Permissions extends BitField {
  static DEFAULT = 104324673n
  static ALL = Object.values(PermissionFlags).reduce(
    (all, p) => BigInt(all) | BigInt(p),
    0n
  )

  constructor(bits: BitFieldResolvable) {
    super(PermissionFlags, bits)
  }

  any(permission: PermissionResolvable, checkAdmin = true): boolean {
    return (
      (checkAdmin && super.has(this.flags().ADMINISTRATOR)) ||
      super.any(permission)
    )
  }

  has(permission: PermissionResolvable, checkAdmin = true): boolean {
    return (
      (checkAdmin && super.has(this.flags().ADMINISTRATOR)) ||
      super.has(permission)
    )
  }
}

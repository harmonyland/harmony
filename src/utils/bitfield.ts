// Ported from https://github.com/discordjs/discord.js/blob/master/src/util/BitField.js
export type BitFieldResolvable = number | BitField | string | BitField[]

export class BitField {
  flags: { [name: string]: number } = {}
  bitfield: number

  constructor(flags: { [name: string]: number }, bits: any) {
    this.flags = flags
    this.bitfield = BitField.resolve(this.flags, bits)
  }

  any(bit: BitFieldResolvable): boolean {
    return (this.bitfield & BitField.resolve(this.flags, bit)) !== 0
  }

  equals(bit: BitFieldResolvable): boolean {
    return this.bitfield === BitField.resolve(this.flags, bit)
  }

  has(bit: BitFieldResolvable, ...args: any[]): boolean {
    if (Array.isArray(bit)) return bit.every((p) => this.has(p))
    return (this.bitfield & BitField.resolve(this.flags, bit)) === bit
  }

  missing(bits: any, ...hasParams: any[]): string[] {
    if (!Array.isArray(bits)) {
      bits = new BitField(this.flags, bits).toArray(false)
    }
    return bits.filter((p: any) => !this.has(p, ...hasParams))
  }

  freeze(): Readonly<BitField> {
    return Object.freeze(this)
  }

  add(...bits: BitFieldResolvable[]): BitField {
    let total = 0
    for (const bit of bits) {
      total |= BitField.resolve(this.flags, bit)
    }
    if (Object.isFrozen(this)) {
      return new BitField(this.flags, this.bitfield | total)
    }
    this.bitfield |= total
    return this
  }

  remove(...bits: BitFieldResolvable[]): BitField {
    let total = 0
    for (const bit of bits) {
      total |= BitField.resolve(this.flags, bit)
    }
    if (Object.isFrozen(this)) {
      return new BitField(this.flags, this.bitfield & ~total)
    }
    this.bitfield &= ~total
    return this
  }

  serialize(...hasParams: any[]): { [key: string]: any } {
    const serialized: { [key: string]: any } = {}
    for (const [flag, bit] of Object.entries(this.flags)) {
      serialized[flag] = this.has(
        BitField.resolve(this.flags, bit),
        ...hasParams
      )
    }
    return serialized
  }

  toArray(...hasParams: any[]): string[] {
    return Object.keys(this.flags).filter((bit) =>
      this.has(BitField.resolve(this.flags, bit), ...hasParams)
    )
  }

  toJSON(): number {
    return this.bitfield
  }

  valueOf(): number {
    return this.bitfield
  }

  *[Symbol.iterator](): Iterator<string> {
    yield* this.toArray()
  }

  static resolve(flags: any, bit: BitFieldResolvable = 0): number {
    if (typeof bit === 'string' && !isNaN(parseInt(bit))) return parseInt(bit)
    if (typeof bit === 'number' && bit >= 0) return bit
    if (bit instanceof BitField) return this.resolve(flags, bit.bitfield)
    if (Array.isArray(bit)) {
      return bit
        .map((p) => this.resolve(flags, p))
        .reduce((prev, p) => prev | p, 0)
    }
    if (typeof bit === 'string' && typeof flags[bit] !== 'undefined') {
      return flags[bit]
    }
    const error = new RangeError('BITFIELD_INVALID')
    throw error
  }
}

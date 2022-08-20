// Ported from https://github.com/discordjs/discord.js/blob/master/src/util/BitField.js
export type BitFieldResolvable =
  | number
  | number[]
  | BitField
  | string
  | string[]
  | BitField[]
  | bigint
  | bigint[]

/** Bit Field utility to work with Bits and Flags */
export class BitField {
  #flags: { [name: string]: number | bigint } = {}
  bitfield: bigint

  constructor(
    flags: { [name: string]: number | bigint },
    bits: BitFieldResolvable
  ) {
    this.#flags = flags
    this.bitfield = BitField.resolve(this.#flags, bits)
  }

  any(bit: BitFieldResolvable): boolean {
    return (this.bitfield & BitField.resolve(this.#flags, bit)) !== 0n
  }

  equals(bit: BitFieldResolvable): boolean {
    return this.bitfield === BitField.resolve(this.#flags, bit)
  }

  has(bit: BitFieldResolvable, ..._: unknown[]): boolean {
    if (Array.isArray(bit))
      return (bit.every as unknown[]['every'])((p) =>
        this.has(p as BitFieldResolvable)
      )
    bit = BitField.resolve(this.#flags, bit)
    return (this.bitfield & bit) === bit
  }

  missing(
    bits: BitFieldResolvable,
    ...hasParams: unknown[]
  ): BitFieldResolvable[] {
    if (!Array.isArray(bits))
      bits = new BitField(this.#flags, bits).toArray(false)
    return (bits as unknown[]).filter(
      (p) => !this.has(p as BitFieldResolvable, ...hasParams)
    ) as BitFieldResolvable[]
  }

  freeze(): Readonly<BitField> {
    return Object.freeze(this)
  }

  add(...bits: BitFieldResolvable[]): BitField {
    let total = 0n
    for (const bit of bits) {
      total |= BitField.resolve(this.#flags, bit)
    }
    if (Object.isFrozen(this))
      return new BitField(this.#flags, this.bitfield | total)
    this.bitfield |= total
    return this
  }

  remove(...bits: BitFieldResolvable[]): BitField {
    let total = 0n
    for (const bit of bits) {
      total |= BitField.resolve(this.#flags, bit)
    }
    if (Object.isFrozen(this))
      return new BitField(this.#flags, this.bitfield & ~total)
    this.bitfield &= ~total
    return this
  }

  flags(): { [name: string]: bigint | number } {
    return this.#flags
  }

  serialize(...hasParams: unknown[]): { [key: string]: boolean } {
    const serialized: { [key: string]: boolean } = {}
    for (const [flag, bit] of Object.entries(this.#flags))
      serialized[flag] = this.has(
        BitField.resolve(this.#flags, bit),
        ...hasParams
      )
    return serialized
  }

  toArray(...hasParams: unknown[]): string[] {
    return Object.keys(this.#flags).filter((bit) =>
      this.has(BitField.resolve(this.#flags, bit), ...hasParams)
    )
  }

  toJSON(): string {
    return this.bitfield.toString()
  }

  valueOf(): bigint {
    return this.bitfield
  }

  *[Symbol.iterator](): Iterator<string> {
    yield* this.toArray()
  }

  static resolve(
    flags: Record<string, bigint | number>,
    bit: BitFieldResolvable = 0n
  ): bigint {
    if (typeof bit === 'bigint') return bit
    if (typeof bit === 'string' && !isNaN(parseInt(bit))) return BigInt(bit)
    if (typeof bit === 'number' && bit >= 0) return BigInt(bit)
    if (bit instanceof BitField) return this.resolve(flags, bit.bitfield)
    if (Array.isArray(bit))
      return (bit.map as unknown[]['map'])((p) =>
        this.resolve(flags, p as BitFieldResolvable)
      ).reduce((prev: bigint, p: bigint) => prev | p, 0n)
    if (typeof bit === 'string' && typeof flags[bit] !== 'undefined')
      return BigInt(flags[bit])
    const error = new RangeError('BITFIELD_INVALID')
    throw error
  }
}

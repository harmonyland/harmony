/** Utility class to extract data from a Snowflake (Discord ID) */
export class Snowflake {
  id: string

  constructor(id: string) {
    this.id = id
  }

  get snowflake(): bigint {
    return BigInt.asUintN(64, BigInt(this.id))
  }

  get timestamp(): number {
    return Number(((this.snowflake >> 22n) + 1420070400000n).toString())
  }

  get workerID(): number {
    return Number(((this.snowflake & 0x3e0000n) >> 17n).toString())
  }

  get processID(): number {
    return Number(((this.snowflake & 0x1f00n) >> 12n).toString())
  }

  get increment(): number {
    return Number((this.snowflake & 0xfffn).toString())
  }

  get toString(): string {
    return this.id
  }
}

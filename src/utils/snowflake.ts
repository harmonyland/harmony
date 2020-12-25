export class Snowflake {
  id: string

  constructor(id: string) {
    this.id = id
  }

  get snowflake(): bigint {
    return BigInt.asUintN(64, BigInt(this.id))
  }

  get timestamp(): string {
    return ((this.snowflake >> 22n) + 1420070400000n).toString()
  }

  get workerID(): string {
    return ((this.snowflake & 0x3e0000n) >> 17n).toString()
  }

  get processID(): string {
    return ((this.snowflake & 0x1f00n) >> 12n).toString()
  }

  get increment(): string {
    return (this.snowflake & 0xfffn).toString()
  }
}

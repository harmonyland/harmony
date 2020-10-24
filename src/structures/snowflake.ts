export class Snowflake {
  snowflake: bigint
  constructor (id: string) {
    this.snowflake = BigInt.asUintN(64, BigInt(id))
  }

  get timestamp () {
    return ((this.snowflake >> BigInt(22)) + BigInt(1420070400000)).toString()
  }

  get workerID () {
    return ((this.snowflake & BigInt(0x3e0000)) >> BigInt(17)).toString()
  }

  get processID () {
    return ((this.snowflake & BigInt(0x1f000)) >> BigInt(12)).toString()
  }

  get increment () {
    return (this.snowflake & BigInt(0xfff)).toString()
  }
}

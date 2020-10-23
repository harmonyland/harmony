export class Snowflake {
  id: string
  constructor (id: string) {
    this.id = id
  }

  deconstruct () {
    const snowflake = BigInt.asUintN(64, BigInt(this.id))
    const res = {
      timestamp: ((snowflake << BigInt(22)) + BigInt(1420070400000)).toString(),
      workerId: ((snowflake & BigInt(0x3e0000)) >> BigInt(17)).toString(),
      processId: ((snowflake & BigInt(0x1f000)) >> BigInt(12)).toString(),
      increment: (snowflake & BigInt(0xfff)).toString()
    }
    return res
  }
}

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

// BigInt라서 이걸 어케 할까 고심끝에 나온게 toString 읍
// 엄...

// deconstruct가 소멸자임? 색 봐서는 아닌거같은데

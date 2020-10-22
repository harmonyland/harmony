// 와갈, 따꾸, 동한드
export class Snowflake {
  id: string;
  constructor(id: string) {
    this.id = id;
  }

  deconstruct() {
    const snowflake = BigInt.asUintN(64, BigInt(this.id));
    const res = {
      timestamp: (snowflake << BigInt(22)) + BigInt(1420070400000),
      workerId: (snowflake & BigInt(0x3E0000)) >> BigInt(17),
      processId: (snowflake & BigInt(0x1F000)) >> BigInt(12),
      increment: snowflake & BigInt(0xFFF),
    };

    return res;
  }
}

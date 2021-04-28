import { parseArgs, Args } from "../src/utils/command.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts"

const commandArgs: Args[] = [{
    name: "permaban",
    match: "flag",
    flag: "--permanent",
  }, {
    name: "user",
    match: "mention",
  }, {
    name: "reason",
    match: "rest",
  }];
const messageArgs: string[] = ["<@!708544768342229012>","--permanent","bye","bye","Skyler"];
const expectedResult = {
  permaban: true,
  user: "708544768342229012",
  reason: ["bye","bye","Skyler"]
}
Deno.test({
  name: "parse Args",
  fn: () => {
    const result = parseArgs(commandArgs,messageArgs);
    assertEquals(result, expectedResult)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true,
})
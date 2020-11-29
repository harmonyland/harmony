import { UserFlags } from "../types/userFlags.ts";
import { BitField } from "./bitfield.ts";

export class UserFlagsManager extends BitField {
    constructor(bits: any) {
        super(UserFlags, bits)
    }
}
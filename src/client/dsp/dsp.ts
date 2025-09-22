import { Writer } from "../buffer";
import DSPFn from "./dsp_fn";


/**
 * DSP
 */
export default class DSP {
    constructor(private fn: DSPFn, private address: number) {}

    serialize(writer: Writer): void {
        writer.writeU8(this.fn);        // Function
        writer.writeU16(this.address);  // Address
    }
}

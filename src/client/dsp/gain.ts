import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";

/**
 * Gain
 */
export default class Gain extends DSP {
    constructor(
        address: number,
        readonly gainVal: number,               // float
        readonly channels: number | null = null // uint8
    ) {
        super(DSPFn.gain, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.gainVal);
        if (this.channels !== null) {
            writer.writeU8(this.channels);
        }
    }
}

import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";

/**
 * Hard clip
 */
export default class HardClip extends DSP {
    constructor(
        address: number,
        readonly highThreshold: number, // float
        readonly lowThreshold: number   // float
    ) {
        super(DSPFn.hardClip, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.highThreshold);
        writer.writeF32(this.lowThreshold);
    }
}

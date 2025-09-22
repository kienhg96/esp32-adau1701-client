import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";

/**
 * Soft clip
 */
export default class SoftClip extends DSP {
    constructor(
        address: number,
        readonly alpha: number // float
    ) {
        super(DSPFn.softClip, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.alpha);
    }
}

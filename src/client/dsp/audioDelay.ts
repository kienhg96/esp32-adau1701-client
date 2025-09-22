import { Writer } from "../buffer";
import DSPFn from "./dsp_fn";
import DSP from "./dsp";


/**
 * Audio delay
 */
export default class AudioDelay extends DSP {
    constructor(
        address: number,
        readonly delayMs: number // float
    ) {
        super(DSPFn.audioDelay, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.delayMs);
    }
}

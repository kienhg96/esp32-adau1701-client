import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";

/**
 * Sine source
 */
export default class SineSource extends DSP {
    constructor(
        address: number,
        readonly frequency: number // float
    ) {
        super(DSPFn.sineSource, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.frequency);
    }
}

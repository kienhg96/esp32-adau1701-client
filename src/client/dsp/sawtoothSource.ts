import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


/**
 * Sawtooth source
 */
export default class SawtoothSource extends DSP {
    constructor(
        address: number,
        readonly frequency: number // float
    ) {
        super(DSPFn.sawtoothSource, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.frequency);
    }
}

import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


/**
 * Volume
 */
export default class Volume extends DSP {
    constructor(
        address: number,
        readonly dB: number          // float
    ) {
        super(DSPFn.volume, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.dB);
    }
}

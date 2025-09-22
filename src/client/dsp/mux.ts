import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


/**
 * Mux
 */
export default class Mux extends DSP {
    constructor(
        address: number,
        readonly index: number,                        // uint8
        readonly numberOfIndexes: number | null = null // uint8
    ) {
        super(DSPFn.mux, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeU8(this.index);
        if (this.numberOfIndexes !== null) {
            writer.writeU8(this.numberOfIndexes);
        }
    }
}

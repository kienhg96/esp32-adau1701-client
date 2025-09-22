import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


/**
 * Demux
 */
export default class Demux extends DSP {
    constructor(
        address: number,
        readonly index: number,          // uint8
        readonly numberOfIndexes: number // uint8
    ) {
        super(DSPFn.demux, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeU8(this.index);
        writer.writeU8(this.numberOfIndexes);
    }
}

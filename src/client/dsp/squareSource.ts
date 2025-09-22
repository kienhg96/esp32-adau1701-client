import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";

/**
 * Square source
 */
export default class SquareSource extends DSP {
    constructor(
        address: number,
        readonly frequency: number // float
    ) {
        super(DSPFn.squareSource, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.frequency);
    }
}

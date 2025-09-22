import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";

/**
 * Triangle source
 */
export default class TriangleSource extends DSP {
    constructor(
        address: number,
        readonly frequency: number
    ) {
        super(DSPFn.triangleSource, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.frequency);
    }
}

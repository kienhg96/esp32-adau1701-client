import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


/**
 * State variable filter
 */
export default class StateVariable extends DSP {
    constructor(
        address: number,
        readonly freq: number, // float
        readonly q: number     // float
    ) {
        super(DSPFn.stateVariable, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.freq);
        writer.writeF32(this.q);
    }
}

import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


/**
 * DC source
 */
export default class DcSource extends DSP {
    constructor(
        address: number,
        readonly value: number // uint32
    ) {
        super(DSPFn.dcSource, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeU32(this.value);
    }
}

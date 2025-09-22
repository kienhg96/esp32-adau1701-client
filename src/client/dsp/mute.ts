import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


/**
 * Mute
 */
export default class Mute extends DSP {
    constructor(
        address: number,
        readonly state: boolean // uint8
    ) {
        super(DSPFn.mute, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeU8(this.state ? 1 : 0);
    }
}

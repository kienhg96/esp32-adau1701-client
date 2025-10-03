import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";

/**
 * Volume slew
 */
export default class VolumeSlew extends DSP {
    constructor(
        address: number,
        readonly dB: number,                 // float
        readonly slew: number | null = null  // uint8
    ) {
        super(DSPFn.volume_slew, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.dB);

        if (this.slew !== null) {
            writer.writeU8(this.slew);
        }
    }
}

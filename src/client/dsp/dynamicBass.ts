import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


/**
 * Dynamic bass
 */
export default class DynamicBass extends DSP {
    constructor(
        address: number,
        readonly dB: number,                         // float
        readonly frequency: number | null = null,    // uint16
        readonly threshold: number | null = null,    // int16
        readonly timeConstant: number | null = null, // uint16
    ) {
        super(DSPFn.dynamicBass, address);
        if (typeof threshold != typeof timeConstant) {
            throw new Error("Threshold and time constant must be of the same type");
        }
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        writer.writeF32(this.dB);

        if (this.frequency != null) {
            writer.writeU16(this.frequency);
        }

        if (this.threshold != null && this.timeConstant != null) {
            writer.writeS16(this.threshold);
            writer.writeU16(this.timeConstant);
        }
    }
}

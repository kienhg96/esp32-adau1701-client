import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


const FLAG_THRESHOLD = 1 << 0;
const FLAG_RATIO     = 1 << 1;
const FLAG_RMS_TC    = 1 << 2;
const FLAG_HOLD      = 1 << 3;
const FLAG_DECAY     = 1 << 4;
const FLAG_POSTGAIN  = 1 << 5;


export interface CompressorParams {
    threshold? : number; // float
    ratio?     : number; // float
    rms_tc?    : number; // float
    hold?      : number; // float
    decay?     : number; // float
    postgain?  : number; // float
};


/**
 * Compressor
 */
export default class Compressor extends DSP {
    constructor(fn: DSPFn, address: number, readonly params: CompressorParams) {
        super(fn, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        const data = this.params;

        // Build flags
        let flags = 0;
        if (data.threshold !== undefined) flags |= FLAG_THRESHOLD;
        if (data.ratio !== undefined) flags |= FLAG_RATIO;
        if (data.rms_tc !== undefined) flags |= FLAG_RMS_TC;
        if (data.hold !== undefined) flags |= FLAG_HOLD;
        if (data.decay !== undefined) flags |= FLAG_DECAY;
        if (data.postgain !== undefined) flags |= FLAG_POSTGAIN;

        writer.writeU8(flags);
        if (data.threshold !== undefined) writer.writeF32(data.threshold);
        if (data.ratio !== undefined) writer.writeF32(data.ratio);
        if (data.rms_tc !== undefined) writer.writeF32(data.rms_tc);
        if (data.hold !== undefined) writer.writeF32(data.hold);
        if (data.decay !== undefined) writer.writeF32(data.decay);
        if (data.postgain !== undefined) writer.writeF32(data.postgain);
    }
}

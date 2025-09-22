import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


const FLAG_GAIN        = 1 << 0;
const FLAG_FILTER_TYPE = 1 << 1;
const FLAG_PHASE       = 1 << 2;
const FLAG_STATE       = 1 << 3;


export interface EQfirstOrderParams {
    freq        : number;          // float
    gain?       : number;          // float
    filterType? : number;          // uint8
    phase?      : number;          // uint8
    state?      : boolean;         // uint8
};


/**
 * EQ first order
 */
export default class EQfirstOrder extends DSP {
    constructor(address: number, readonly params: EQfirstOrderParams) {
        super(DSPFn.EQfirstOrder, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        const data = this.params;

        // Build flags
        let flags = 0;
        if (data.gain !== undefined) flags |= FLAG_GAIN;
        if (data.filterType !== undefined) flags |= FLAG_FILTER_TYPE;
        if (data.phase !== undefined) flags |= FLAG_PHASE;
        if (data.state !== undefined) flags |= FLAG_STATE;

        writer.writeU8(flags);
        writer.writeF32(data.freq);
        if (data.gain !== undefined) writer.writeF32(data.gain);
        if (data.filterType !== undefined) writer.writeU8(data.filterType);
        if (data.phase !== undefined) writer.writeU8(data.phase);
        if (data.state !== undefined) writer.writeU8(data.state ? 1 : 0);
    }
}

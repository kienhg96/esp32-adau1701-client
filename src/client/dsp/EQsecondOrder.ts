import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


const FLAG_Q           = 1 << 0;
const FLAG_S           = 1 << 1;
const FLAG_BANDWIDTH   = 1 << 2;
const FLAG_BOOST       = 1 << 3;
const FLAG_GAIN        = 1 << 4;
const FLAG_FILTER_TYPE = 1 << 5;
const FLAG_PHASE       = 1 << 6;
const FLAG_STATE       = 1 << 7;


/**
 * EQ second order parameters
 */
export interface EQsecondOrderParams {
    freq        : number;          // float
    Q?          : number;          // float
    S?          : number;          // float
    bandwidth?  : number;          // float
    boost?      : number;          // float
    gain?       : number;          // float
    filterType? : number;          // uint8
    phase?      : number;          // uint8
    state?      : boolean;         // uint8
}

/**
 * EQ second order
 */
export default class EQsecondOrder extends DSP {
    constructor(address: number, readonly params: EQsecondOrderParams) {
        super(DSPFn.EQsecondOrder, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        const params = this.params;

        // Build flags
        let flags = 0;
        if (params.Q !== undefined) flags |= FLAG_Q;
        if (params.S !== undefined) flags |= FLAG_S;
        if (params.bandwidth !== undefined) flags |= FLAG_BANDWIDTH;
        if (params.boost !== undefined) flags |= FLAG_BOOST;
        if (params.gain !== undefined) flags |= FLAG_GAIN;
        if (params.filterType !== undefined) flags |= FLAG_FILTER_TYPE;
        if (params.phase !== undefined) flags |= FLAG_PHASE;
        if (params.state !== undefined) flags |= FLAG_STATE;

        writer.writeU8(flags);
        writer.writeF32(params.freq);
        if (params.Q !== undefined) writer.writeF32(params.Q);
        if (params.S !== undefined) writer.writeF32(params.S);
        if (params.bandwidth !== undefined) writer.writeF32(params.bandwidth);
        if (params.boost !== undefined) writer.writeF32(params.boost);
        if (params.gain !== undefined) writer.writeF32(params.gain);
        if (params.filterType !== undefined) writer.writeU8(params.filterType);
        if (params.phase !== undefined) writer.writeU8(params.phase);
        if (params.state !== undefined) writer.writeU8(params.state ? 1 : 0);
    }
}

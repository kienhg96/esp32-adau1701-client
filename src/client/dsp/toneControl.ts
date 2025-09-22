import { Writer } from "../buffer";
import DSP from "./dsp";
import DSPFn from "./dsp_fn";


const FLAG_BOOST_BASS_DB   = 1 << 0;
const FLAG_BOOST_TREBLE_DB = 1 << 1;
const FLAG_FREQ_TREBLE     = 1 << 2;
const FLAG_PHASE           = 1 << 3;
const FLAG_STATE           = 1 << 4;


export interface ToneControlParams {
    freq_Bass        : number;    // float      
    boost_Bass_dB?   : number;    // float
    boost_Treble_dB? : number;    // float
    freq_Treble?     : number;    // float
    phase?           : number;    // uint8
    state?           : boolean;   // uint8
}


/**
 * Tone control
 */
export default class ToneControl extends DSP {
    constructor(address: number, readonly params: ToneControlParams) {
        super(DSPFn.toneControl, address);
    }

    serialize(writer: Writer): void {
        super.serialize(writer);
        const data = this.params;

        // Build flags
        let flags = 0;
        if (data.boost_Bass_dB !== undefined) flags |= FLAG_BOOST_BASS_DB;
        if (data.boost_Treble_dB !== undefined) flags |= FLAG_BOOST_TREBLE_DB;
        if (data.freq_Treble !== undefined) flags |= FLAG_FREQ_TREBLE;
        if (data.phase !== undefined) flags |= FLAG_PHASE;
        if (data.state !== undefined) flags |= FLAG_STATE;

        writer.writeU8(flags);
        writer.writeF32(data.freq_Bass);
        if (data.boost_Bass_dB !== undefined) writer.writeF32(data.boost_Bass_dB);
        if (data.boost_Treble_dB !== undefined) writer.writeF32(data.boost_Treble_dB);
        if (data.freq_Treble !== undefined) writer.writeF32(data.freq_Treble);
        if (data.phase !== undefined) writer.writeU8(data.phase);
        if (data.state !== undefined) writer.writeU8(data.state ? 1 : 0);
    }
}

import Compressor, { CompressorParams } from "./compressor";
import DSPFn from "./dsp_fn";


/**
 * Compressor RMS
 */
export default class CompressorRMS extends Compressor {
    constructor(address: number, params: CompressorParams) {
        super(DSPFn.compressorRMS, address, params);
    }
}

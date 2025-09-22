import Compressor, { CompressorParams } from "./compressor";
import DSPFn from "./dsp_fn";


/**
 * Compressor peak
 */
export default class CompressorPeak extends Compressor {
    constructor(address: number, params: CompressorParams) {
        super(DSPFn.compressorPeak, address, params);
    }
}

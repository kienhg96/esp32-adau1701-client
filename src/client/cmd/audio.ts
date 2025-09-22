import { Writer } from "../buffer";
import DSP from "../dsp/dsp";
import ErrorCode, { makeError } from "./error";
import { AudioGraph, readGraph } from "./graph";
import Handler from "./handler";
import Opcode from "./opcode";


export interface AudioConfigMeta {
    /// Number of bytes
    length: number;

    /// Finish flag
    finish: boolean;
}


export interface AudioConfigData {
    /// Data
    data: ArrayBuffer;
}


export default class AudioHandler extends Handler {
    /**
     * Get audio graph
     */
    graph(): Promise<AudioGraph> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.GRAPH, (error, reader) => {
                if (error !== ErrorCode.SUCCESS) {
                    reject(makeError(error));
                } else {
                    resolve(readGraph(reader));
                }
            });

            // Send graph command
            this.send(Opcode.GRAPH);
        });
    }

    /**
     * Set DSP
     */
    dsp(value: DSP): Promise<void> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.DSP, (error) => {
                if (error !== ErrorCode.SUCCESS) {
                    reject(makeError(error));
                } else {
                    resolve();
                }
            });

            // Send DSP command
            const writer = new Writer();
            writer.writeU8(Opcode.DSP);
            value.serialize(writer);
            this.send(writer);
        });
    }

    /**
     * Set audio config meta
     */
    configMeta(meta: AudioConfigMeta): Promise<void> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.AUDIO_CONFIG_META, (error) => {
                if (error !== ErrorCode.SUCCESS) {
                    reject(makeError(error));
                } else {
                    resolve();
                }
            });

            // Send config meta command
            const writer = new Writer();
            writer.writeU8(Opcode.AUDIO_CONFIG_META);
            writer.writeU32(meta.length);
            writer.writeU8(meta.finish ? 1 : 0);
            this.send(writer);
        });
    }

    /**
     * Set audio config data
     */
    configData(data: AudioConfigData): Promise<void> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.AUDIO_CONFIG_DATA, (error) => {
                if (error !== ErrorCode.SUCCESS) {
                    reject(makeError(error));
                } else {
                    resolve();
                }
            });

            // Send config data command
            const writer = new Writer();
            writer.writeU8(Opcode.AUDIO_CONFIG_DATA);
            writer.write(data.data);
            this.send(writer);
        });
    }
}

import { Reader, Writer } from "../buffer";
import DSP from "../dsp/dsp";
import { readGraph, type DSPGraph } from "./graph";
import Handler from "./handler";
import Opcode from "./opcode";
import pako from "pako";


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

const UPGRADE_CHUNK_SIZE = 256;     // 256 bytes
const UPGRADE_MAX_CHUNKS = 128;     // 32 KB


interface GraphChunk {
    /// Request ID
    requestID: number;

    /// Total size
    totalSize: number;

    /// Sent size
    sentSize: number;

    /// Data
    data: ArrayBuffer;
};

export default class AudioHandler extends Handler {
    /**
     * Get audio graph
     */
    async graph(): Promise<DSPGraph> {
        let sentSize = 0;
        let totalSize = 0;
        let requestID = 0; // 0 means new requestID, we will update it later
        let recvChunks = 0;

        const inflator = new pako.Inflate();
        do {
            const chunk = await this.requestGraphChunk(requestID);
            sentSize = chunk.sentSize;
            totalSize = chunk.totalSize;
            requestID = chunk.requestID;

            inflator.push(chunk.data);
            recvChunks++;
        } while (sentSize < totalSize && recvChunks < UPGRADE_MAX_CHUNKS);

        if (sentSize < totalSize) {
            throw new Error("Graph download failed: sentSize < totalSize");
        }

        if (inflator.err) {
            throw inflator.err;
        }

        if (!(inflator.result instanceof Uint8Array)) {
            throw new Error("Graph download failed: Not Uint8Array");
        }

        return readGraph(new Reader(inflator.result));
    }

    /**
     * Set DSP
     */
    dsp(value: DSP): Promise<void> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.DSP, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });

            // Send DSP command
            const writer = new Writer();
            writer.writeU8(Opcode.DSP);
            value.serialize(writer);
            this.send(writer);
        });
    }

    /**
     * Set audio config
     */
    async config(
        file: File,
        onProgress: (progress: number) => void = () => {}
    ): Promise<void> {
        onProgress(0);
        const length = file.size;
        await this.requestConfigMeta({ length, finish: false });
    
        // Send data
        let offset = 0;
        while (offset < length) {
            const end = Math.min(offset + UPGRADE_CHUNK_SIZE, length);
            const chunk = file.slice(offset, end);
            offset = end;
    
            // Get the data
            const data = await chunk.arrayBuffer();
    
            // Send
            await this.requestConfigData({ data });
    
            // Update progress
            onProgress(Math.round((offset / length) * 100));
        }
    
        // Finish
        await this.requestConfigMeta({ length, finish: true });
    }

    /**
     * Set audio config meta
     */
    private requestConfigMeta(meta: AudioConfigMeta): Promise<void> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.AUDIO_CONFIG_META, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
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
    private requestConfigData(data: AudioConfigData): Promise<void> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.AUDIO_CONFIG_DATA, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });

            // Send config data command
            const writer = new Writer();
            writer.writeU8(Opcode.AUDIO_CONFIG_DATA);
            writer.write(data.data);
            this.send(writer);
        });
    }

    /**
     * Request graph chunk
     */
    private requestGraphChunk(requestID: number): Promise<GraphChunk> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.GRAPH, (error, reader) => {
                if (error) {
                    return reject(error);
                }
                const requestID = reader.readU32();
                const totalSize = reader.readU32();
                const sentSize = reader.readU32();
                const data = reader.read(reader.remain());

                resolve({ requestID, totalSize, sentSize, data });
            });

            // Send graph chunk command
            const writer = new Writer();
            writer.writeU8(Opcode.GRAPH);
            writer.writeU32(requestID);
            this.send(writer);
        });
    }
}

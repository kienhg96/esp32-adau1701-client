import { Writer, Reader } from "../buffer";
import ErrorCode from "./error";
import Opcode from "./opcode";
import Socket from "./socket";


interface MessageCallback {
    (error: ErrorCode, reader: Reader): void;
}

/**
 * Base handler for all commands
 */
export default abstract class Handler {
    private socket: Socket;
    private onceCallbacks: Map<Opcode, MessageCallback> = new Map();

    constructor(socket: Socket) {
        this.socket = socket;
        this.socket.addMessageListener((data) => {
            this.handle(data);
        });
    }

    handle(data: ArrayBuffer) {
        const reader = new Reader(data);
        const opcode = reader.readU8();
        const error = reader.readU8();
        this.onMessage(opcode, error, reader);
    }

    protected send(opcode: Opcode): void;
    protected send(writer: Writer): void;
    protected send(writerOrOpcode: Writer | Opcode) {
        if (writerOrOpcode instanceof Writer) {
            this.socket.send(writerOrOpcode.pack());
        } else {
            const writer = new Writer();
            writer.writeU8(writerOrOpcode);
            this.socket.send(writer.pack());
        }
    }

    /**
     * Wait for a single message
     */
    protected once(opcode: Opcode, callback: MessageCallback) {
        this.onceCallbacks.set(opcode, callback);
    }

    /**
     * Handle message from DSP
     */
    protected onMessage(
        opcode: Opcode,
        error: ErrorCode,
        reader: Reader
    ): void {
        const callback = this.onceCallbacks.get(opcode);
        if (callback) {
            this.onceCallbacks.delete(opcode);
            callback(error, reader);
        }
    }
}

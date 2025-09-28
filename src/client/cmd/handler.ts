import { Writer, Reader } from "../buffer";
import ErrorCode, { makeError } from "./error";
import Opcode from "./opcode";
import Socket from "./socket";


interface MessageCallback {
    (error: Error | null, reader: Reader): void;
}

/**
 * Base handler for all commands
 */
export default abstract class Handler {
    private socket: Socket;
    private onceCallbacks: Map<Opcode, MessageCallback[]> = new Map();

    constructor(socket: Socket) {
        this.socket = socket;
        this.socket.addMessageListener((data) => {
            this.handle(data);
        });
        this.socket.addSocketListener({
            onOpen: () => {},
            onClose: () => this.onClose(),
            onReconnect: () => {}
        });
    }

    handle(data: ArrayBuffer) {
        const reader = new Reader(data);
        const opcode = reader.readU8();
        const errorCode = reader.readU8();
        this.onMessage(opcode, errorCode, reader);
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
        const callbacks = this.onceCallbacks.get(opcode) || [];
        callbacks.push(callback);
        this.onceCallbacks.set(opcode, callbacks);
    }

    /**
     * Handle message from DSP
     */
    protected onMessage(
        opcode: Opcode,
        errorCode: ErrorCode,
        reader: Reader
    ): void {
        const callbacks = this.onceCallbacks.get(opcode) || [];
        if (callbacks.length > 0) {
            this.onceCallbacks.delete(opcode);
            if (errorCode !== ErrorCode.SUCCESS) {
                callbacks.forEach((callback) => {
                    callback(makeError(errorCode), reader);
                });
            } else {
                callbacks.forEach((callback) => {
                    callback(null, reader);
                });
            }
        }
    }

    protected onClose() {
        // Reject all pending callbacks
        this.onceCallbacks.forEach((callbacks) => {
            // Create empty array buffer
            const buffer = new ArrayBuffer(0);
            callbacks.forEach((callback) => {
                callback(new Error("CONNECTION_CLOSED"), new Reader(buffer));
            });
        });
        this.onceCallbacks.clear();
    }
}

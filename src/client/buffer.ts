
/**
 * All buffer operations are big-endian
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const BUFFER_CAPACITY = 2048;

/**
 * Buffer writer
 */
export class Writer {
    private buffer: ArrayBuffer;
    private position: number;
    private view: DataView;

    constructor() {
        this.buffer = new ArrayBuffer(BUFFER_CAPACITY);
        this.position = 0;
        this.view = new DataView(this.buffer);
    }

    write(value: ArrayBuffer): void {
        // Check capacity
        if (this.position + value.byteLength > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }

        const view = new DataView(value);

        for (let i = 0; i < value.byteLength; i++) {
            this.view.setUint8(this.position + i, view.getUint8(i));
        }
        this.position += value.byteLength;
    }

    writeU8(value: number): void {
        // Check capacity
        if (this.position + 1 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }

        this.view.setUint8(this.position, value);
        this.position += 1;
    }

    writeU16(value: number): void {
        // Check capacity
        if (this.position + 2 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }

        this.view.setUint16(this.position, value, false);
        this.position += 2;
    }

    writeS16(value: number): void {
        // Check capacity
        if (this.position + 2 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }

        this.view.setInt16(this.position, value, false);
        this.position += 2;
    }

    writeU32(value: number): void {
        // Check capacity
        if (this.position + 4 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }

        this.view.setUint32(this.position, value, false);
        this.position += 4;
    }

    writeF32(value: number): void {
        // Check capacity
        if (this.position + 4 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }

        this.view.setFloat32(this.position, value, false);
        this.position += 4;
    }

    writeStr(value: string): void {
        // Convert string to Uint8Array
        const strArray = encoder.encode(value);

        // Check capacity
        if (this.position + 2 + strArray.length > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }

        // length for string
        this.writeU16(strArray.length);

        // string data
        for (let i = 0; i < strArray.length; i++) {
            this.view.setUint8(this.position + i, strArray[i]);
        }
        this.position += strArray.length;
    }

    pack(): ArrayBuffer {
        return this.buffer.slice(0, this.position);
    }
}


/**
 * Buffer reader
 */
export class Reader {
    private buffer: ArrayBuffer;
    private position: number;
    private view: DataView;

    constructor(buffer: ArrayBuffer | Uint8Array) {
        if (buffer instanceof Uint8Array) {
            this.buffer = buffer.buffer;
        } else {
            this.buffer = buffer;
        }
        this.position = 0;
        this.view = new DataView(this.buffer);
    }

    remain(): number {
        return this.buffer.byteLength - this.position;
    }

    read(length: number): ArrayBuffer {
        // Check capacity
        if (this.position + length > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }
        const buffer = this.buffer.slice(this.position, this.position + length);
        this.position += length;
        return buffer;
    }

    readS8(): number {
        // Check capacity
        if (this.position + 1 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }
        return this.view.getInt8(this.position++);
    }

    readU8(): number {
        // Check capacity
        if (this.position + 1 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }
        return this.view.getUint8(this.position++);
    }

    readU16(): number {
        // Check capacity
        if (this.position + 2 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }
        const value = this.view.getUint16(this.position, false);
        this.position += 2;
        return value;
    }

    readU32(): number {
        // Check capacity
        if (this.position + 4 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }
        const value = this.view.getUint32(this.position, false);
        this.position += 4;
        return value;
    }

    readF32(): number {
        // Check capacity
        if (this.position + 4 > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }
        const value = this.view.getFloat32(this.position, false);
        this.position += 4;
        return value;
    }

    readStr(): string {
        // Read until null terminator
        // Find the null terminator
        let nullTerminator = this.position;
        while (nullTerminator < this.buffer.byteLength) {
            if (this.view.getUint8(nullTerminator) === 0) {
                break;
            }
            nullTerminator++;
        }

        // Check capacity
        if (nullTerminator >= this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }

        // Read string
        const str = decoder.decode(this.buffer.slice(this.position, nullTerminator));
        this.position = nullTerminator + 1;
        return str;
    }

    readU8Array(length: number): number[] {
        // Check capacity
        if (this.position + length > this.buffer.byteLength) {
            throw new Error("Buffer overflow");
        }

        const array = new Array(length);
        for (let i = 0; i < length; i++) {
            array[i] = this.view.getUint8(this.position + i);
        }
        this.position += length;
        return array;
    }
}

import { Reader } from "../buffer";
import Handler from "./handler";
import Opcode from "./opcode";
import ErrorCode, { makeError } from "./error";


/**
 * System status
 */
export interface SysStatus {
    upTime: number;
    freeHeap: number;
    maxHeap: number;
}


/**
 * System handler
 */
export default class SysHandler extends Handler {
    /**
     * Get system status
     */
    status(): Promise<SysStatus> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.STATUS, (error, reader) => {
                if (error !== ErrorCode.SUCCESS) {
                    reject(makeError(error));
                    return;
                }

                resolve(this.readStatus(reader));
            });

            // Send status command
            this.send(Opcode.STATUS);
        });
    }

    /**
     * Reboot system
     */
    reboot(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.REBOOT, (error) => {
                if (error !== ErrorCode.SUCCESS) {
                    reject(makeError(error));
                } else {
                    resolve();
                }
            });

            // Send reboot command
            this.send(Opcode.REBOOT);
        });
    }

    /**
     * Read system status from reader
     */
    private readStatus(reader: Reader): SysStatus {
        return {
            upTime: reader.readU32(),
            freeHeap: reader.readU32(),
            maxHeap: reader.readU32(),
        };
    }
}

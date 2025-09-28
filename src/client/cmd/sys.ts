import { Reader } from "../buffer";
import Handler from "./handler";
import Opcode from "./opcode";


/**
 * System status
 */
export interface SysStatus {
    upTime: number;
    freeHeap: number;
    maxHeap: number;
}


export interface WiFiStatus {
    host: string;
    ssid: string;
    ip: number[];
    gateway: number[];
    subnet: number[];
    rssi: number;
}


export interface Status {
    sys: SysStatus;
    wifi: WiFiStatus;
}

/**
 * System handler
 */
export default class SysHandler extends Handler {
    /**
     * Get system status
     */
    status(): Promise<Status> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.STATUS, (error, reader) => {
                if (error) {
                    return reject(error);
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
                if (error) {
                    return reject(error);
                }
                resolve();
            });

            // Send reboot command
            this.send(Opcode.REBOOT);
        });
    }

    /**
     * Read system status from reader
     */
    private readStatus(reader: Reader): Status {
        return {
            sys: this.readSysStatus(reader),
            wifi: this.readWiFiStatus(reader),
        };
    }

    private readSysStatus(reader: Reader): SysStatus {
        const upTime = reader.readU32();
        const freeHeap = reader.readU32();
        const maxHeap = reader.readU32();
        return {
            upTime,
            freeHeap,
            maxHeap,
        };
    }

    private readWiFiStatus(reader: Reader): WiFiStatus {
        const host = reader.readStr();
        const ssid = reader.readStr();
        const ip = reader.readU8Array(4);
        const gateway = reader.readU8Array(4);
        const subnet = reader.readU8Array(4);
        const rssi = reader.readS8();
        return {
            host,
            ssid,
            ip,
            gateway,
            subnet,
            rssi,
        };
    }
}

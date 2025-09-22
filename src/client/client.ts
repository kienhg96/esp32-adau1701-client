import AudioHandler from "./cmd/audio";
import Socket from "./cmd/socket";
import SysHandler from "./cmd/sys";
import WiFiHandler from "./cmd/wifi";


/**
 * DSP client
 */
export default class DSPClient {
    readonly socket: Socket;
    readonly audio: AudioHandler;
    readonly sys: SysHandler;
    readonly wifi: WiFiHandler;

    constructor(url: string) {
        this.socket = new Socket(url);
        this.audio = new AudioHandler(this.socket);
        this.sys = new SysHandler(this.socket);
        this.wifi = new WiFiHandler(this.socket);
    }
}

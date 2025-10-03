import { type DSPGraph } from "../client/cmd/graph";
import { type SocketListener } from "../client/cmd/socket";
import DSP from "../client/dsp/dsp";
import { type Status } from "../client/cmd/sys";


export interface ISocket {
    isConnected(): boolean;
    isConnecting(): boolean;
    addSocketListener(listener: SocketListener): void;
    removeSocketListener(listener: SocketListener): void;
}

export interface IAudio {
    graph(): Promise<DSPGraph>;
    dsp(value: DSP): Promise<void>;
    config(file: File): Promise<void>;
    config(file: File, onProgress: (progress: number) => void): Promise<void>;
}

export interface IWiFi {
    forget(): Promise<void>;
}

export interface ISys {
    status(): Promise<Status>;
    reboot(): Promise<void>;
}

export interface IClient {
    socket: ISocket;
    audio: IAudio;
    wifi: IWiFi;
    sys: ISys;
}

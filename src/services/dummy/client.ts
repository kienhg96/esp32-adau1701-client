import { type IAudio, type IClient, type ISys, type IWiFi, type ISocket } from "../entities";
import DummySocket from "./socket";
import status from "./status";
import graph from "./graph";

const DELAY = 100;

function delayPromise(data?: any): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve(data), DELAY));
}


const audio: IAudio = {
    graph: () => delayPromise(graph),
    dsp: delayPromise,
    config: delayPromise,
};

const wifi: IWiFi = {
    forget: delayPromise
};

const sys: ISys = {
    status: () => delayPromise(status()),
    reboot: delayPromise
};

class DummyClient implements IClient {
    readonly socket: ISocket = new DummySocket();
    audio = audio;
    wifi = wifi;
    sys = sys;
}

export default DummyClient;

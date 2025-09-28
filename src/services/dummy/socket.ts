import { type SocketListener } from "../../client/cmd/socket";
import { type ISocket } from "../entities";

const CONNECTED_DELAY = 200;

export default class DummySocket implements ISocket {
    private listeners: SocketListener[] = [];
    private connected = false;

    constructor() {
        setTimeout(() => {
            this.connected = true;
            this.listeners.forEach(l => l.onOpen());
        }, CONNECTED_DELAY);
    }

    isConnected() { return this.connected; }
    isConnecting() { return false; }
    
    addSocketListener(listener: SocketListener) {
        this.listeners.push(listener);
    }
    
    removeSocketListener(listener: SocketListener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }
}

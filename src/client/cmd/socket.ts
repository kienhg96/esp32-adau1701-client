/**
 * Reconnect delay in milliseconds
 */
const RECONNECT_DELAY = 1000;


/**
 * Socket listener
 */
export interface SocketListener {
    onOpen(): void;
    onClose(): void;
    onReconnect(): void;
}


export default class Socket {
    private ws: WebSocket;
    private msgListeners: ((data: ArrayBuffer) => void)[] = [];
    private closeRequested = false;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private listeners: SocketListener[] = [];
    private connected = false;

    constructor(private readonly url: string) {
        this.ws = new WebSocket(url);
        this.init();
    }

    private init() {
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = () => {
            this.onOpen();
        };
        this.ws.onclose = () => {
            this.onClose();
        };
        this.ws.onmessage = (event) => {
            if (!(event.data instanceof ArrayBuffer)) {
                return;
            }
            this.onMessage(event.data);
        };
        this.ws.onerror = (event) => {
            const error = event as ErrorEvent;
            console.error("WebSocket error", error.message);
        };
    }

    addSocketListener(listener: SocketListener) {
        this.listeners.push(listener);
    }

    removeSocketListener(listener: SocketListener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    addMessageListener(listener: (data: ArrayBuffer) => void) {
        this.msgListeners.push(listener);
    }

    removeMessageListener(listener: (data: ArrayBuffer) => void) {
        this.msgListeners = this.msgListeners.filter((l) => l !== listener);
    }

    send(data: ArrayBuffer) {
        this.ws.send(data);
    }

    close() {
        this.closeRequested = true;
        if (this.reconnectTimeout !== null) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        this.ws.close();
    }

    isConnected() {
        return this.connected;
    }

    private onMessage(data: ArrayBuffer) {
        this.msgListeners.forEach((handler) => handler(data));
    }

    private onOpen() {
        console.log("Connected to DSP.");
        this.connected = true;
        this.listeners.forEach((listener) => listener.onOpen());
    }

    private onClose() {
        console.log("Disconnected from DSP.");
        this.connected = false;
        this.listeners.forEach((listener) => listener.onClose());
        if (this.closeRequested) {
            return;
        }

        console.log("Reconnecting to DSP...");
        this.onReconnect();

        // Reconnect
        this.reconnectTimeout = setTimeout(() => {
            this.ws = new WebSocket(this.url);
            this.init();
        }, RECONNECT_DELAY);
    }

    private onReconnect() {
        this.listeners.forEach((listener) => listener.onReconnect());
    }
}

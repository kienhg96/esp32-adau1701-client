import { useEffect } from "react";
import { useAppDispatch, SocketState } from "./AppContext";
import client from "../services/client";


const STATUS_INTERVAL = 1000;


function AppMonitor() {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        function update(socketState: SocketState) {
            dispatch({ type: "SET_SOCKET_STATE", payload: socketState });
        }

        const socket = client.socket;
        if (socket.isConnected()) {
            update(SocketState.Connected);
        } else if (socket.isConnecting()) {
            update(SocketState.Connecting);
        } else {
            update(SocketState.Disconnected);
        }

        const listener = {
            onOpen: () => update(SocketState.Connected),
            onClose: () => update(SocketState.Disconnected),
            onReconnect: () => update(SocketState.Reconnecting),
        };

        socket.addSocketListener(listener);
        return () => socket.removeSocketListener(listener);
    }, [dispatch]);

    useEffect(() => {
        const socket = client.socket;
        let timer: any;
        function update() {
            if (!socket.isConnected()) {
                return;
            }
            client.sys.status()
            .then(status => dispatch({ type: "SET_STATUS", payload: status }))
            .catch(err => console.error("Failed to get status", err))
            .finally(() => {
                // Only fetch next request after previous request is completed
                timer = setTimeout(update, STATUS_INTERVAL);
            });
        }

        timer = setTimeout(update, STATUS_INTERVAL);

        return () => clearTimeout(timer);
    }, [dispatch]);

    return null;
}

export default AppMonitor;

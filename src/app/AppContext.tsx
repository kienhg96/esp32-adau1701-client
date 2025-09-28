import { createContext, useContext, useReducer } from "react";
import { type Status } from "../client/cmd/sys";

export enum SocketState {
    Waiting,
    Connecting,
    Connected,
    Reconnecting,
    Disconnected
}

export const StateLabels = [
    "Waiting",
    "Connecting",
    "Connected",
    "Reconnecting",
    "Disconnected"
];

export function getStateLabel(state: SocketState) {
    return StateLabels[state];
}


export interface AppContextType {
    socketState: SocketState;
    status?: Status;
}

export type AppDispatch = React.Dispatch<{ type: string; payload?: any }>;

export const AppContextDefault: AppContextType = {
    socketState: SocketState.Disconnected,
};


export function AppReducer(state: AppContextType, action: { type: string, payload?: any }) {
    switch (action.type) {
        case "SET_SOCKET_STATE":
            return { ...state, socketState: action.payload };
        case "SET_STATUS":
            return { ...state, status: action.payload };
        default:
            return state;
    }
}

const AppContext = createContext<AppContextType>(AppContextDefault);

export const AppDispatchContext = createContext<AppDispatch>(() => {});

export function useAppContext() {
    return useContext(AppContext);
}

export function useAppDispatch() {
    return useContext(AppDispatchContext);
}

export function useAppReducer() {
    return useReducer(AppReducer, AppContextDefault);
}

export default AppContext;

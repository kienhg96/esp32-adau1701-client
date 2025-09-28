import DSPClient from '../client';
import { type IClient } from './entities';
import DummyClient from './dummy/client';


let client: IClient;
if (typeof import.meta.env.VITE_WS_URL === 'string') {
    console.log('Using DSP client', import.meta.env.VITE_WS_URL);
    client = new DSPClient(import.meta.env.VITE_WS_URL);
} else {
    console.log('Using dummy client');
    client = new DummyClient();
}

export default client;

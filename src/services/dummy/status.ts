import { type Status } from "../../client/cmd/sys";


const start = Date.now();


export default function status(): Status {
    const upTime = Date.now() - start;
    const status: Status = {
        wifi: {
            host: 'WIFI_HOST',
            ssid: 'WIFI_SSID',
            ip: [1, 2, 3, 4],
            gateway: [1, 2, 3, 4],
            subnet: [1, 2, 3, 4],
            rssi: -70 + Math.round((Math.random() * 10))
        },
        sys: {
            upTime: Math.round(upTime / 1000),
            freeHeap: 1024 + Math.round((Math.random() * 1024)),
            maxHeap: 8192
        }
    };

    return status;
}

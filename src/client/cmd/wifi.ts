import Handler from "./handler";
import Opcode from "./opcode";


/**
 * WiFi handler
 */
export default class WiFiHandler extends Handler {
    /**
     * Forget WiFi connection
     */
    forget(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.once(Opcode.WIFI_FORGET, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });

            // Send forget command
            this.send(Opcode.WIFI_FORGET);
        });
    }
}

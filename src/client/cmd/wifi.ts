import Handler from "./handler";
import Opcode from "./opcode";
import ErrorCode, { makeError } from "./error";


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
                if (error !== ErrorCode.SUCCESS) {
                    reject(makeError(error));
                } else {
                    resolve();
                }
            });

            // Send forget command
            this.send(Opcode.WIFI_FORGET);
        });
    }
}

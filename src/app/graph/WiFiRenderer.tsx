import {
    BaseNode,
    BaseNodeContent,
    BaseNodeFooter,
    BaseNodeHeader,
    BaseNodeHeaderTitle,
} from "@/components/base-node";
import { Button } from "@/components/ui/button";
import { Wifi } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { useAppContext } from "../AppContext";
import { useState } from "react";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import client from "../../services/client";


function WiFiRenderer() {
    const { status } = useAppContext();
    const { wifi } = status || {};
    const [openForgetWiFi, setOpenForgetWiFi] = useState(false);

    function handleForgetWiFiConfirm(ok: boolean) {
        setOpenForgetWiFi(false);
        if (ok) {
            client.wifi.forget().catch(error => {
                console.error(error);
            });
        }
    }

    return (
        <BaseNode className="w-96">
            <BaseNodeHeader className="border-b">
                <Wifi className="size-4" />
                <BaseNodeHeaderTitle>WiFi</BaseNodeHeaderTitle>
            </BaseNodeHeader>
            <BaseNodeContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Host</TableCell>
                            <TableCell>{wifi?.host || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>SSID</TableCell>
                            <TableCell>{wifi?.ssid || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>IP Address</TableCell>
                            <TableCell>{wifi?.ip.join(".") || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Gateway</TableCell>
                            <TableCell>{wifi?.gateway.join(".") || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Subnet</TableCell>
                            <TableCell>{wifi?.subnet.join(".") || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>RSSI</TableCell>
                            <TableCell>{wifi?.rssi || "-"}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </BaseNodeContent>
            <BaseNodeFooter>
                {/* Two buttons full width */}
                <div className="flex gap-2 w-full">
                    <Button variant="outline" className="nodrag" onClick={() => setOpenForgetWiFi(true)}>
                        Forget WiFi
                    </Button>
                    <Button variant="outline" className="nodrag">
                        Change WiFi
                    </Button>
                </div>
            </BaseNodeFooter>
            <ConfirmDialog
                open={openForgetWiFi}
                onSubmit={handleForgetWiFiConfirm}
                title="Forget WiFi"
                description="Are you sure you want to forget the WiFi?"
                cancelText="Cancel"
                okText="Forget WiFi"
            />
        </BaseNode>
    );
}


WiFiRenderer.displayName = "WiFiRenderer";


export default WiFiRenderer;

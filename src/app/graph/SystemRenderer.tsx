import { useState } from "react";
import {
    BaseNode,
    BaseNodeContent,
    BaseNodeFooter,
    BaseNodeHeader,
    BaseNodeHeaderTitle,
} from "@/components/base-node";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { useAppContext } from "../AppContext";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import client from "../../services/client";


function SystemRenderer() {
    const { status } = useAppContext();
    const { sys } = status || {};
    const [openReboot, setOpenReboot] = useState(false);

    function handleRebootConfirm(ok: boolean) {
        setOpenReboot(false);
        if (ok) {
            client.sys.reboot().catch(error => {
                console.error(error);
            });
        }
    }

    return (
        <BaseNode className="w-96">
            <BaseNodeHeader className="border-b">
                <Settings className="size-4" />
                <BaseNodeHeaderTitle>System</BaseNodeHeaderTitle>
            </BaseNodeHeader>
            <BaseNodeContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Up Time</TableCell>
                            <TableCell>{sys ? toDuration(sys?.upTime) : "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Free Heap</TableCell>
                            <TableCell>{sys?.freeHeap || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Max Allocation Heap</TableCell>
                            <TableCell>{sys?.maxHeap || "-"}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </BaseNodeContent>
            <BaseNodeFooter>
                <Button variant="outline" className="nodrag w-full" onClick={() => setOpenReboot(true)}>
                    Reboot
                </Button>
            </BaseNodeFooter>
            <ConfirmDialog
                open={openReboot}
                onSubmit={handleRebootConfirm}
                title="Reboot"
                description="Are you sure you want to reboot the device?"
                cancelText="Cancel"
                okText="Reboot"
            />
        </BaseNode>
    );
}


SystemRenderer.displayName = "SysStatusRenderer";

export default SystemRenderer;

function toDuration(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
}

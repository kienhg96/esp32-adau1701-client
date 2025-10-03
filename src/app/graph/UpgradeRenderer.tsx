import { useState } from "react";
import {
    BaseNode,
    BaseNodeContent,
    BaseNodeFooter,
    BaseNodeHeader,
    BaseNodeHeaderTitle,
} from "@/components/base-node";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import client from "../../services/client";


// Upgrade chunk size in bytes
const MAX_UPGRADE_SIZE = 50 * 1024; // 50 KB


function UpgradeRenderer() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [upgrading, setUpgrading] = useState(false);
    const [progress, setProgress] = useState(0);

    function handleUpgradeSubmit() {
        if (upgrading || !file) {
            return;
        }
        
        if (file.size > MAX_UPGRADE_SIZE) {
            alert("File size is too large");
            return;
        }
        setOpen(true);
    }

    function handleUpgradeConfirm(ok: boolean) {
        if (upgrading) {
            return;
        }
        
        setOpen(false);
        if (!ok || !file || file.size > MAX_UPGRADE_SIZE) {
            return; // Illegal state
        }

        // Start upgrading
        setUpgrading(true);
        client.audio.config(file, (progress) => setProgress(progress))
        .catch(error => console.error(error))
        .finally(() => setUpgrading(false));
    }

    return (
        <BaseNode className="w-96">
            <BaseNodeHeader className="border-b">
                <Upload className="size-4" />
                <BaseNodeHeaderTitle>Upgrade</BaseNodeHeaderTitle>
            </BaseNodeHeader>
            <BaseNodeContent>
                <Input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
                {upgrading && (
                    <div className="flex items-center justify-center">
                        <Loader2 className="size-4 animate-spin" />
                        <span className="ml-2">Upgrading {progress}%...</span>
                    </div>
                )}
            </BaseNodeContent>
            <BaseNodeFooter>
                <Button variant="outline" className="nodrag w-full" onClick={handleUpgradeSubmit}>
                    Upgrade
                </Button>
            </BaseNodeFooter>
            <ConfirmDialog
                open={open}
                onSubmit={handleUpgradeConfirm}
                title="Upgrade"
                description="Are you sure you want to upgrade the device?"
                cancelText="Cancel"
                okText="Upgrade"
            />
        </BaseNode>
    );
}


UpgradeRenderer.displayName = "UpgradeRenderer";

export default UpgradeRenderer;

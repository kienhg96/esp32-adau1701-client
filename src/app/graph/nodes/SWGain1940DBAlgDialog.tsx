import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";

interface SWGain1940DBAlgDialogProps {
    open: boolean;
    onSubmit: (ok: boolean) => void;
}

function SWGain1940DBAlgDialog({ open, onSubmit }: SWGain1940DBAlgDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onSubmit}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>SWGain1940DBAlg</DialogTitle>
                    <DialogDescription>Set DSP</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onSubmit(true)}>OK</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default SWGain1940DBAlgDialog;

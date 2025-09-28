import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


interface ConfirmDialogProps {
    open: boolean;
    onSubmit: (ok: boolean) => void;
    title?: string;
    description?: string;
    cancelText?: string;
    okText?: string;
}


function ConfirmDialog({ open, onSubmit, title, description, cancelText, okText }: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onSubmit}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title || "Empty title"}</DialogTitle>
                    <DialogDescription>{description || "Empty description"}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="destructive" onClick={() => onSubmit(true)}>
                        {okText || "OK"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => onSubmit(false)}>
                        {cancelText || "Cancel"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmDialog;

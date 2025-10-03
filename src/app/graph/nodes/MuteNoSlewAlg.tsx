import { useState } from "react";
import type NodeContentProps from "./NodeContentProps";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import client from "@/services/client";
import Mute from "@/client/dsp/mute";


/**
 * Mute (no slew)
 */
function MuteNoSlewAlg({ node }: NodeContentProps) {
    // Get value from node data
    const [mute, setMute] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    function handleChange(checked: boolean) {
        const address = node.address;
        if (address === undefined) {
            console.log("MuteNoSlewAlg: No address is found");
            return;
        }

        if (submitting) return;

        // optimistic update
        const prev = mute;

        setMute(checked);
        setSubmitting(true);

        // Submit DSP with the address
        client.audio.dsp(new Mute(address, checked))
        .catch(err => {
            console.error("MuteNoSlewAlg: Error submitting mute", err);
            setMute(prev);
        }).finally(() => {
            setSubmitting(false);
        });
    }

    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id="mute_checkbox"
                checked={mute}
                disabled={submitting}
                onCheckedChange={handleChange}
            />
            <Label htmlFor="mute_checkbox">Mute</Label>
        </div>
    )
}

MuteNoSlewAlg.displayName = "MuteNoSlewAlg";
export default MuteNoSlewAlg;

import { Label } from "@radix-ui/react-label";
import type NodeContentProps from "./NodeContentProps";
import { useState } from "react";
import Volume from "@/client/dsp/volume";
import client from "@/services/client";
import useCoalescedSender from "../utils/CoalescedSender";
import { Adjuster } from "@/components/custom/adjuster";


const MIN_GAIN = -80;
const MAX_GAIN = 20;


/**
 * Volume control (no slew)
 */
function Gain1940AlgNS({ node }: NodeContentProps) {
    // TODO: Get gain from param

    const [gain, setGain] = useState(0);
    const { schedule, submitting } = useCoalescedSender<number>(async (db) => {
        const address = node.address;
        if (address === undefined) {
            console.log("Gain1940AlgNS: No address is found");
            return;
        }

        await client.audio.dsp(new Volume(address, db));
    });

    return (
        <div className="min-w-[240px] flex flex-col items-center pt-2">
            <Adjuster
                value={gain}
                min={MIN_GAIN}
                max={MAX_GAIN}
                step={1}
                onChange={(gain: number) => setGain(gain)}
                onCommit={() => schedule(gain)}
            />
            <Label className="mt-2">{gain} dB</Label>
            {submitting && <span className="mt-2 text-xs text-muted-foreground">Submitting...</span>}
        </div>
    )
}


Gain1940AlgNS.displayName = "Gain1940AlgNS";
export default Gain1940AlgNS;

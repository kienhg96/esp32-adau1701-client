import type NodeContentProps from "./NodeContentProps";
import { useState } from "react";
import client from "@/services/client";
import useCoalescedSender from "../utils/CoalescedSender";
import { Adjuster } from "@/components/custom/adjuster";
import { Label } from "@/components/ui/label";
import AudioDelay from "@/client/dsp/audioDelay";


const DSP_FREQ = 48000;
const US_PER_SAMPLE = 1000000 / DSP_FREQ;

const MIN_DELAY = 0;
const MAX_DELAY = 2000;

/**
 * Delay
 */
function MultCtrlDelGrowAlg({ node }: NodeContentProps) {
    // TODO: Get sample from node

    const [samples, setSamples] = useState(0);
    const { schedule, submitting } = useCoalescedSender<number>(async (value) => {
        const address = node.address;
        if (address === undefined) {
            console.log("MultCtrlDelGrowAlg: No address is found");
            return;
        }

        const delayMs = value * US_PER_SAMPLE / 1000;
        await client.audio.dsp(new AudioDelay(address, delayMs));
    });

    const us = samples * US_PER_SAMPLE;
    return (
        <div className="min-w-[240px] flex flex-col items-center pt-2">
            <Adjuster
                value={samples}
                min={MIN_DELAY}
                max={MAX_DELAY}
                step={1}
                onChange={(samples: number) => setSamples(samples)}
                onCommit={() => schedule(samples)}
            />
            <Label>{samples} samples ({us.toFixed(2)} µs)</Label>
            {submitting && <span className="text-xs text-muted-foreground">Submitting...</span>}
        </div>
    )
}

MultCtrlDelGrowAlg.displayName = "MultCtrlDelGrowAlg";
export default MultCtrlDelGrowAlg;

import { Label } from "@radix-ui/react-label";
import type NodeContentProps from "./NodeContentProps";
import { Adjuster } from "@/components/custom/adjuster"
import { useState } from "react";
import client from "@/services/client";
import useCoalescedSender from "../utils/CoalescedSender";
import VolumeSlew from "@/client/dsp/volume_slew";


const MIN_GAIN = -80;
const MAX_GAIN = 20;
const MIN_SLEW = 1;
const MAX_SLEW = 23;


interface VolumeSlewParams {
    gain: number;
    slew: number;
}


/**
 * Volume control (with slew)
 */
function SWGain1940DBAlg({ node }: NodeContentProps) {
    // TODO: Get slew from param

    const [gain, setGain] = useState(0);
    const [slew, setSlew] = useState(12);

    const { schedule, submitting } = useCoalescedSender<VolumeSlewParams>(async (params) => {
        const address = node.address;
        if (address === undefined) {
            console.log("SWGain1940DBAlg: No address is found");
            return;
        }

        await client.audio.dsp(new VolumeSlew(address, params.gain, params.slew));
    });

    return (
        <div className="min-w-[240px] flex flex-col items-center">
            <Adjuster
                value={gain}
                min={MIN_GAIN}
                max={MAX_GAIN}
                step={1}
                onChange={(gain: number) => setGain(gain)}
                onCommit={() => schedule({ gain, slew })}
            />
            <Label>Gain: {gain} dB</Label>
            <Adjuster
                value={slew}
                min={MIN_SLEW}
                max={MAX_SLEW}
                step={1}
                onChange={(slew: number) => setSlew(slew)}
                onCommit={() => schedule({ gain, slew })}
            />
            <Label>Slew: {slew}</Label>
            {submitting && <span className="mt-2 text-xs text-muted-foreground">Submitting...</span>}
        </div>
    )
}


SWGain1940DBAlg.displayName = "SWGain1940DBAlg";
export default SWGain1940DBAlg;

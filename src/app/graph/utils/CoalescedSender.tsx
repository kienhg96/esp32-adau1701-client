import { useCallback, useRef, useState } from "react";


export default function useCoalescedSender<T>(send: (v: T) => Promise<void>) {
    const latest = useRef<T | null>(null);
    const inFlight = useRef(false);
    const [submitting, setSubmitting] = useState(false);

    const schedule = useCallback((value: T) => {
    latest.current = value;                 // Update the latest value
    if (inFlight.current) return;           // If already in flight, do nothing

    inFlight.current = true;
    setSubmitting(true);

    (async function run() {
        while (latest.current !== null) {
            const v = latest.current;           // Lock the current value
            latest.current = null;              // Clear to detect new updates during await
            try {
                await send(v as T);             // Send once
            } catch (e) {
                console.error(e);
            }
            // If there are new updates during await, latest.current != null
        }
        inFlight.current = false;
        setSubmitting(false);
    })();
    }, [send]);

    return { schedule, submitting };
}

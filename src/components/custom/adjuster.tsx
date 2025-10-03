import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface AdjusterProps {
    value: number;
    onChange: (value: number) => void;
    onCommit: () => void;
    min: number;
    max: number;
    step: number;
}

export function Adjuster({
    value,
    onChange,
    onCommit,
    min,
    max,
    step,
}: AdjusterProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                    onChange(value - 1);
                    onCommit?.();
                }}
            >
                –
            </Button>

            <Slider
                value={[value]}
                onValueChange={values => onChange(values[0])}
                onValueCommit={onCommit}
                min={min}
                max={max}
                step={step}
                className="w-[200px]"
            />

            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                    onChange(value + 1);
                    onCommit();
                }}
            >
                +
            </Button>
        </div>
    );
}

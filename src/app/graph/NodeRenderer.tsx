import { Position } from "@xyflow/react";
import { BaseHandle } from "@/components/base-handle";
import { BaseNode, BaseNodeContent, BaseNodeFooter, BaseNodeHeader, BaseNodeHeaderTitle } from "@/components/base-node";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";


interface PortInfo {
    id: number;
    output: boolean;
}

interface NodeRendererProps {
    data: {
        name: String;
        ports: PortInfo[];
    };
}

function NodeRenderer({ data }: NodeRendererProps) {
    const { name, ports } = data;
    return (
        <BaseNode>
            <BaseNodeHeader className="border-b">
                <Rocket className="size-4" />
                <BaseNodeHeaderTitle>In/Out</BaseNodeHeaderTitle>
            </BaseNodeHeader>
            <BaseNodeContent>
                <h3 className="text-lg">{name}</h3>
                {ports.map(port => (
                    <BaseHandle
                        key={port.id}
                        id={port.id.toString()}
                        type={port.output ? "source" : "target"}
                        position={port.output ? Position.Right : Position.Left}
                    />
                ))}
            </BaseNodeContent>
            <BaseNodeFooter>
                <Button variant="outline" className="nodrag w-full">
                    Edit
                </Button>
            </BaseNodeFooter>
        </BaseNode>
    );
};

NodeRenderer.displayName = "NodeRenderer";

export default NodeRenderer;

import { BaseNode, BaseNodeContent, BaseNodeHeader, BaseNodeHeaderTitle } from "@/components/base-node";
import { Rocket } from "lucide-react";
import { DSPPortType, type DSPNode, type DSPPort } from "../../client/cmd/graph";
import { BaseHandle } from "@/components/base-handle";
import { Position } from "@xyflow/react";
import getNodeFC from "./nodes/Nodes";
import { useMemo } from "react";


interface NodeRendererProps {
    data: {
        name: string;
        node?: DSPNode;
    };
}

interface NodeHandleProps {
    port: DSPPort;
}


function NodeHandle({ port }: NodeHandleProps) {
    const output = (port.type === DSPPortType.Output);
    return (
        <BaseHandle
            id={port.id.toString()}
            type={output ? "source" : "target"}
            position={output ? Position.Right : Position.Left}
        />
    );
}

function NodeRenderer({ data }: NodeRendererProps) {
    const { name, node } = data;
    const NodeFC = useMemo(() => getNodeFC(node), [node]);
    return (
        <BaseNode>
            <BaseNodeHeader className="border-b">
                <Rocket className="size-4" />
                <BaseNodeHeaderTitle>{name}</BaseNodeHeaderTitle>
            </BaseNodeHeader>
            <BaseNodeContent>
                {node && <NodeFC node={node} />}
                {node && node.ports.map(port => (
                    <NodeHandle key={port.id} port={port} />
                ))}
            </BaseNodeContent>
        </BaseNode>
    );
};

NodeRenderer.displayName = "NodeRenderer";

export default NodeRenderer;

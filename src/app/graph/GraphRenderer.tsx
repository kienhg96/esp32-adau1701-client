import { useState, useEffect } from "react";
import client from "@/services/client";
import { useAppContext, SocketState } from "../AppContext";
import { ReactFlow, Background, type Node, type Edge, applyNodeChanges, type NodeChange } from "@xyflow/react";
import NodeRenderer from "./NodeRenderer";
import SystemRenderer from "./SystemRenderer";
import WiFiRenderer from "./WiFiRenderer";
import UpgradeRenderer from "./UpgradeRenderer";
import dagre from '@dagrejs/dagre';


const NodeTypes: Record<string, React.FC<any>> = {
    "NodeRenderer": NodeRenderer,
    "StatusRenderer": SystemRenderer,
    "WiFiRenderer": WiFiRenderer,
    "UpgradeRenderer": UpgradeRenderer
};


interface GraphState {
    nodes: Node[];
    edges: Edge[];
}


const BuiltinNodes: Node[] = [
    {
        id: "status",
        position: { x: 0, y: 0 },
        data: { name: "Status" },
        type: "StatusRenderer",
    },
    {
        id: "wifi",
        position: { x: 0, y: 0 },
        data: { name: "WiFi" },
        type: "WiFiRenderer",
    },
    {
        id: "upgrade",
        position: { x: 0, y: 0 },
        data: { name: "Upgrade" },
        type: "UpgradeRenderer",
    }
];


function GraphRenderer() {
    const { socketState } = useAppContext();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [arranged, setArranged] = useState(false);

    useEffect(() => {
        if (socketState !== SocketState.Connected) {
            if (arranged) {
                setArranged(false);
            }
            return; // Prevent useEffect from running if socket is not connected
        }

        let running = true;
        loadGraph().then(graph => {
            if (!running) {
                return;
            }
            setNodes(graph.nodes);
            setEdges(graph.edges);
        }).catch((error) => {
            if (error instanceof Error && error.message === "RESOURCE_NULL") {
                setNodes(BuiltinNodes);
                setEdges([]);
            } else {
                console.error(error);
            }
        });

        return () => { running = false; };
    }, [socketState]);

    useEffect(() => {
        if (arranged) {
            return;
        }

        // Check if all nodes have dimensions
        if (nodes.length > 0 && nodes.every(node => node.measured)) {
            const newNodes = doLayout(nodes, edges);
            setNodes(newNodes);
            setArranged(true);
        }
    }, [nodes, arranged]);

    function onNodesChange(changes: NodeChange[]) {
        const filteredChanges = changes.filter(change => change.type !== "remove");
        setNodes((nodesSnapshot) => applyNodeChanges(filteredChanges, nodesSnapshot));
    }

    return (
        <div className="h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={NodeTypes}
                onNodesChange={onNodesChange}
                fitView={false}
                proOptions={{ hideAttribution: true }}
            >
                <Background />
            </ReactFlow>
        </div>
    );
}


async function loadGraph(): Promise<GraphState> {
    console.log("Loading graph");
    const graph = await client.audio.graph();
    console.log("Graph loaded");

    const portNodes = new Map();
    graph.nodes.forEach(node => {
        node.ports.forEach(port => {
            portNodes.set(port.id, node.name);
        });
    });

    // Update port information
    const sourcePortIDs = new Set();
    graph.edges.forEach(edge => {
        sourcePortIDs.add(edge.sourcePortID);
    });

    const nodes: Node[] = graph.nodes.map(node => ({
        id: node.name,
        position: { x: 0, y: 0 },
        data: {
            name: node.name,
            node: node,
        },
        type: "NodeRenderer",
    }));

    const edges: Edge[] = graph.edges.map(edge => ({
        id: edge.name,
        source: portNodes.get(edge.sourcePortID),
        target: portNodes.get(edge.targetPortID),
        sourceHandle: edge.sourcePortID.toString(),
        targetHandle: edge.targetPortID.toString(),
    }));

    BuiltinNodes.forEach(node => nodes.push(node));

    return { nodes, edges };
}


const PADDING = 10;
const NODE_SEP = 40;
const RANK_SEP = 80;
const DEFAULT_NODE_SIZE = { w: 180, h: 60 };
function doLayout(nodes: Node[], edges: Edge[]) {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "LR", nodesep: NODE_SEP, ranksep: RANK_SEP });
    g.setDefaultEdgeLabel(() => ({}));

  // Khai báo kích thước cho từng node để Dagre tính toán
    nodes.forEach(n => {
        const w = n.measured?.width ?? DEFAULT_NODE_SIZE.w;
        const h = n.measured?.height ?? DEFAULT_NODE_SIZE.h;
        g.setNode(n.id, { width: w, height: h });
    });

    edges.forEach(e => g.setEdge(e.source, e.target));

    dagre.layout(g);

    const pos: Record<string, { x: number; y: number }> = {};
    nodes.forEach(n => {
        const { x, y } = g.node(n.id); // Dagre trả tâm node
        const w = n.measured?.width ?? DEFAULT_NODE_SIZE.w;
        const h = n.measured?.height ?? DEFAULT_NODE_SIZE.h;
        pos[n.id] = { x: x - w / 2 + PADDING, y: y - h / 2 + PADDING };
    });

    return nodes.map(n => ({
        ...n,
        position: pos[n.id],
    }));
}


export default GraphRenderer;

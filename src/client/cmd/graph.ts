import { Reader } from "../buffer";
import { findNodeType, type NodeType } from "./node";


export enum DSPPortType {
    Isolated,
    Input,
    Output
}


export interface DSPPort {
    id: number;   // uint16
    name: string; // string

    /* Calculated values */
    type: DSPPortType;
}


export interface DSPParam {
    address: number;   // uint16
    data: ArrayBuffer; // uint8[]
}


export interface DSPEdge {
    name: string;          // string
    sourcePortID: number;  // uint16
    targetPortID: number;  // uint16
}


export interface DSPNode {
    name: string;          // string
    labelID: number;       // uint16
    ports: DSPPort[];      // uint16[]
    params: DSPParam[];    // AudioParam[]

    /* Calculated values */
    type: NodeType;        // NodeType
    address?: number;      // The begining address of this node
}


export interface DSPGraph {
    labels: string[];      // string[]
    nodes: DSPNode[];    // AudioNode[]
    edges: DSPEdge[];    // AudioEdge[]
}


export function readGraph(reader: Reader): DSPGraph {
    // Read labels
    const labelCount = reader.readU16();
    console.log("Label count: ", labelCount);
    const labels: string[] = [];
    for (let i = 0; i < labelCount; i++) {
        const label = reader.readStr();
        labels.push(label);
    }

    // Read nodes
    const nodeCount = reader.readU16();
    const nodes: DSPNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
        const node = readNode(reader);
        nodes.push(node);
    }

    // Read edges
    const edgeCount = reader.readU16();
    const edges: DSPEdge[] = [];
    for (let i = 0; i < edgeCount; i++) {
        const edge = readEdge(reader);
        edges.push(edge);
    }

    // Update port type after reading edges
    const outputPorts = new Set<number>();
    edges.forEach(edge => {
        outputPorts.add(edge.sourcePortID);
    });

    nodes.forEach(node => {
        node.ports.forEach(port => {
            port.type = outputPorts.has(port.id)
                ? DSPPortType.Output
                : DSPPortType.Input;
        });
    });

    return { labels, nodes, edges };
}


function readNode(reader: Reader): DSPNode {
    const name = reader.readStr();
    const labelID = reader.readU16();
    const portCount = reader.readU16();
    const ports: DSPPort[] = [];
    for (let i = 0; i < portCount; i++) {
        const port = readPort(reader);
        ports.push(port);
    }

    const paramCount = reader.readU16();
    const params: DSPParam[] = [];
    for (let i = 0; i < paramCount; i++) {
        const param = readParam(reader);
        params.push(param);
    }

    return {
        name, labelID, ports, params,
        type: findNodeType(name),
        address: params[0]?.address
    };
}


function readEdge(reader: Reader): DSPEdge {
    const name = reader.readStr();
    const sourcePortID = reader.readU16();
    const targetPortID = reader.readU16();
    return { name, sourcePortID, targetPortID };
}


function readPort(reader: Reader): DSPPort {
    const id = reader.readU16();
    const name = reader.readStr();

    // The type of this port will be updated later
    return { id, name, type: DSPPortType.Isolated };
}


function readParam(reader: Reader): DSPParam {
    const address = reader.readU16();
    const length = reader.readU16();
    const data = reader.read(length);
    return { address, data };
}

import { Reader } from "../buffer";


export interface AudioPort {
    id: number;   // uint16
    name: string; // string
}


export interface AudioParam {
    address: number;   // uint16
    data: ArrayBuffer; // uint8[]
}


export interface AudioEdge {
    name: string;          // string
    sourcePortID: number;  // uint16
    targetPortID: number;  // uint16
}


export interface AudioNode {
    name: string;          // string
    labelID: number;       // uint16
    ports: AudioPort[];    // uint16[]
    params: AudioParam[];  // AudioParam[]
}


export interface AudioGraph {
    labels: string[];      // string[]
    nodes: AudioNode[];    // AudioNode[]
    edges: AudioEdge[];    // AudioEdge[]
}


export function readGraph(reader: Reader): AudioGraph {
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
    const nodes: AudioNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
        const node = readNode(reader);
        nodes.push(node);
    }

    // Read edges
    const edgeCount = reader.readU16();
    const edges: AudioEdge[] = [];
    for (let i = 0; i < edgeCount; i++) {
        const edge = readEdge(reader);
        edges.push(edge);
    }

    return { labels, nodes, edges };
}


function readNode(reader: Reader): AudioNode {
    const name = reader.readStr();
    const labelID = reader.readU16();
    const portCount = reader.readU16();
    const ports: AudioPort[] = [];
    for (let i = 0; i < portCount; i++) {
        const port = readPort(reader);
        ports.push(port);
    }

    const paramCount = reader.readU16();
    const params: AudioParam[] = [];
    for (let i = 0; i < paramCount; i++) {
        const param = readParam(reader);
        params.push(param);
    }

    return { name, labelID, ports, params };
}


function readEdge(reader: Reader): AudioEdge {
    const name = reader.readStr();
    const sourcePortID = reader.readU16();
    const targetPortID = reader.readU16();
    return { name, sourcePortID, targetPortID };
}


function readPort(reader: Reader): AudioPort {
    const id = reader.readU16();
    const name = reader.readStr();
    return { id, name };
}


function readParam(reader: Reader): AudioParam {
    const address = reader.readU16();
    const length = reader.readU16();
    const data = reader.read(length);
    return { address, data };
}

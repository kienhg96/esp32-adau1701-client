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
    portIDs: number[];     // uint16[]
    params: AudioParam[];  // AudioParam[]
}


export interface AudioGraph {
    nodes: AudioNode[];    // AudioNode[]
    edges: AudioEdge[];    // AudioEdge[]
    ports: AudioPort[];    // AudioPort[]
}



export function readGraph(reader: Reader): AudioGraph {
    // Read nodes
    const nodeCount = reader.readU16();
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        const node = readNode(reader);
        nodes.push(node);
    }

    // Read edges
    const edgeCount = reader.readU16();
    const edges = [];
    for (let i = 0; i < edgeCount; i++) {
        const edge = readEdge(reader);
        edges.push(edge);
    }

    // Read ports
    const portCount = reader.readU16();
    const ports = [];
    for (let i = 0; i < portCount; i++) {
        const port = readPort(reader);
        ports.push(port);
    }

    return { nodes, edges, ports };
}


function readNode(reader: Reader): AudioNode {
    const name = reader.readStr();
    const labelID = reader.readU16();
    const portCount = reader.readU16();
    const portIDs = [];
    for (let i = 0; i < portCount; i++) {
        const portID = reader.readU16();
        portIDs.push(portID);
    }

    const paramCount = reader.readU16();
    const params = [];
    for (let i = 0; i < paramCount; i++) {
        const param = readParam(reader);
        params.push(param);
    }
    return { name, labelID, portIDs, params };
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

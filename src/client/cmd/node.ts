/**
 * Node types
 */
export enum NodeType {
    Undefined = 0,
    SWGain1940DBAlg = 1,
    Gain1940AlgNS = 2,
    MuteNoSlewAlg = 3,
    MuteSWSlewAlg = 4,
    MultCtrlDelGrowAlg = 5,
};

/**
 * Node type info
 */
type NodeTypeInfo = {
    prefix: string;
    value: NodeType;
};

/**
 * Node types
 */
export const Types: NodeTypeInfo[] = [
    { prefix: "SWGain1940DBAlg", value: NodeType.SWGain1940DBAlg },
    { prefix: "Gain1940AlgNS", value: NodeType.Gain1940AlgNS },
    { prefix: "MuteNoSlewAlg", value: NodeType.MuteNoSlewAlg },
    { prefix: "MuteSWSlewAlg", value: NodeType.MuteSWSlewAlg },
    { prefix: "MultCtrlDelGrowAlg", value: NodeType.MultCtrlDelGrowAlg },
];


let indexed = false;
const indexTable = new Map<string, NodeTypeInfo[]>();
const INDEX_PREFIX_LENGTH = 4;

/**
 * Find node type by name
 * @param name Node name
 * @returns Node type
 */
export function findNodeType(name: string): NodeType {
    if (!indexed) {
        // better performance
        indexNodeTypes();
        indexed = true;
    }

    const key = name.slice(0, INDEX_PREFIX_LENGTH);
    if (!indexTable.has(key)) {
        return NodeType.Undefined;
    }

    const types = indexTable.get(key)!;
    for (const type of types) {
        if (name.startsWith(type.prefix)) {
            return type.value;
        }
    }

    return NodeType.Undefined;
}


/**
 * Index node types
 */
function indexNodeTypes() {
    // Get 4 first characters as the key for index map
    Types.forEach((type) => {
        const key = type.prefix.slice(0, INDEX_PREFIX_LENGTH);
        if (indexTable.has(key)) {
            indexTable.get(key)!.push(type);
        } else {
            indexTable.set(key, [type]);
        }
    });
}

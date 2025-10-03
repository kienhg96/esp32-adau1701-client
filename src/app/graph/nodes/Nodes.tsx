import { type DSPNode } from "@/client/cmd/graph";
import { NodeType } from "@/client/cmd/node";
import type NodeContentProps from "./NodeContentProps";
import DefaultNode from "./DefaultNode";
import SWGain1940DBAlg from "./SWGain1940DBAlg";
import Gain1940AlgNS from "./Gain1940AlgNS";
import MuteNoSlewAlg from "./MuteNoSlewAlg";
import MuteSWSlewAlg from "./MuteSWSlewAlg";
import MultCtrlDelGrowAlg from "./MultCtrlDelGrowAlg";


const nodes = [
    { type: NodeType.SWGain1940DBAlg, component: SWGain1940DBAlg },
    { type: NodeType.Gain1940AlgNS, component: Gain1940AlgNS },
    { type: NodeType.MuteNoSlewAlg, component: MuteNoSlewAlg },
    { type: NodeType.MuteSWSlewAlg, component: MuteSWSlewAlg },
    { type: NodeType.MultCtrlDelGrowAlg, component: MultCtrlDelGrowAlg },
]


let indexed = false;
const nodeTable = new Map<NodeType, React.FC<NodeContentProps>>();

function getNodeFC(node?: DSPNode): React.FC<NodeContentProps> {
    if (!indexed) {
        nodes.forEach((node) => nodeTable.set(node.type, node.component));
        indexed = true;
    }

    if (!node) {
        return DefaultNode;
    }

    return nodeTable.get(node.type) || DefaultNode;
}


export default getNodeFC;

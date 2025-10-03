import type NodeContentProps from "./NodeContentProps";


function DefaultNode({ node }: NodeContentProps) {
    return (
        <h3 className="text-lg">{node.name}</h3>
    )
}

DefaultNode.displayName = "DefaultNode";
export default DefaultNode;

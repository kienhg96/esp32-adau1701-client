import { type DSPGraph, DSPPortType } from "../../client/cmd/graph";
import { findNodeType } from "../../client/cmd/node";


const graph: DSPGraph = {
    nodes: [
        {
            "name": "ICSigma100In1",
            "type": findNodeType("ICSigma100In1"),
            "labelID": 0,
            "ports": [
                {
                    "id": 0,
                    "name": "P0",
                    "type": DSPPortType.Output
                }
            ],
            "params": []
        },
        {
            "name": "MultCtrlDelGrowAlg",
            "type": findNodeType("MultCtrlDelGrowAlg"),
            "labelID": 1,
            "ports": [
                {
                    "id": 1,
                    "name": "P1",
                    "type": DSPPortType.Input
                },
                {
                    "id": 2,
                    "name": "P2",
                    "type": DSPPortType.Output
                }
            ],
            "params": []
        },
        {
            "name": "ICSigma100Out1",
            "type": findNodeType("ICSigma100Out1"),
            "labelID": 2,
            "ports": [
                {
                    "id": 3,
                    "name": "P3",
                    "type": DSPPortType.Input
                }
            ],
            "params": []
        }
    ],
    edges: [
        {
            "name": "Link_0_1",
            "sourcePortID": 0,
            "targetPortID": 1
        },
        {
            "name": "Link_2_3",
            "sourcePortID": 2,
            "targetPortID": 3
        }
    ],
    labels: [
        "ICSigma100In1_Label",
        "MuteNoSlewAlg1_Label",
        "ICSigma100Out1_Label"
    ]
};

export default graph;

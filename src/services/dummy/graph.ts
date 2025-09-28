import { type AudioGraph } from "../../client/cmd/graph";


const graph: AudioGraph = {
    nodes: [
        {
            "name": "ICSigma100In",
            "labelID": 1,
            "portIDs": [0],
            "params": []
        },
        {
            "name": "ICSigma100Out",
            "labelID": 2,
            "portIDs": [1],
            "params": []
        }
    ],
    edges: [
        {
            "name": "Link",
            "sourcePortID": 0,
            "targetPortID": 1
        }
    ],
    ports: [
        { "id": 0, "name": "P1" },
        { "id": 1, "name": "P1" }
    ]
};

export default graph;

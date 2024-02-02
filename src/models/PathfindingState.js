import AStar from "./algorithms/AStar";
import BidirectionalSearch from "./algorithms/BidirectionalSearch";
import Dijkstra from "./algorithms/Dijkstra";
import AStar_kstep from "./algorithms/AStar_kstep";
import PathfindingAlgorithm from "./algorithms/PathfindingAlgorithm";

export default class PathfindingState {
    static #instance;

    /**
     * Singleton class
     * @returns {PathfindingState}
     */
    constructor() {
        if (!PathfindingState.#instance) {
            this.endNode = null;
            this.graph = null;
            this.finished = false;
            this.algorithm = new PathfindingAlgorithm();
            PathfindingState.#instance = this;
        }
    
        return PathfindingState.#instance;
    }

    get startNode() {
        return this.graph.startNode;
    }

    /**
     * 
     * @param {Number} id OSM node id
     * @returns {import("./Node").default} node
     */
    getNode(id) {
        return this.graph?.getNode(id);
    }

    /**
     * Resets to default state
     */
    reset() {
        this.finished = false;
        if(!this.graph) return;
        for(const key of this.graph.nodes.keys()) {
            this.graph.nodes.get(key).reset();
        }
    }

    /**
     * Resets state and initializes new pathfinding animation
     * @param {string} algorithm - The pathfinding algorithm (e.g., "astar", "astar_kstep")
     * @param {number} k - The k-step value (only needed for "astar_kstep" algorithm)
     */
    start(algorithm, k) {
        this.reset();
        switch (algorithm) {
            case "astar":
                this.algorithm = new AStar();
                break;
            case "astar_kstep":
                this.algorithm = new AStar_kstep(k); // Pass the k value to the constructor
                break;
            case "dijkstra":
                this.algorithm = new Dijkstra();
                break;
            case "bidirectional":
                this.algorithm = new BidirectionalSearch();
                break;
            default:
                this.algorithm = new AStar();
                break;
        }

        this.algorithm.start(this.startNode, this.endNode);
    }

    /**
     * Progresses the pathfinding algorithm by one step/iteration
     * @returns {(import("./Node").default)[]} array of nodes that were updated
     */
    nextStep() {
        const updatedNodes = this.algorithm.nextStep();
        if(this.algorithm.finished || updatedNodes.length === 0) {
            this.finished = true;
        }

        return updatedNodes;
    }
}

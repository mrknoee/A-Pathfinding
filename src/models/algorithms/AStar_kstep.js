import PathfindingAlgorithm from "./PathfindingAlgorithm";

class AStar_kstep extends PathfindingAlgorithm {
    constructor(k) {
        super();
        this.openList = [];
        this.closedList = [];
        this.k = k; // Number of steps to look ahead
    }

    start(startNode, endNode) {
        super.start(startNode, endNode);
        this.openList = [this.startNode];
        this.closedList = [];
        this.startNode.distanceFromStart = 0;
        this.startNode.distanceToEnd = this.heuristic(this.startNode, endNode);
    }

    heuristic(node, target) {
        // Implement your heuristic function here
        // For example, using Euclidean distance as a simple heuristic:
        return Math.hypot(node.longitude - target.longitude, node.latitude - target.latitude);
    }

    kStepLookAhead(currentNode) {
        // Implement the k-step look-ahead logic here
        // This is a placeholder implementation
        let minCost = Infinity;
        let nextNode = null;

        // Explore paths extending k steps ahead from the current node
        // This is a simplified version and may not cover all edge cases
        for (let step = 0; step < this.k; step++) {
            for (const neighbor of currentNode.neighbors) {
                const cost = currentNode.distanceFromStart + this.heuristic(neighbor.node, this.endNode);
                if (cost < minCost) {
                    minCost = cost;
                    nextNode = neighbor.node;
                }
            }
            currentNode = nextNode;
        }

        return minCost;
    }

    nextStep() {
        if (this.openList.length === 0) {
            this.finished = true;
            return [];
        }

        const updatedNodes = [];
        let currentNode = this.openList.reduce((acc, current) => current.totalDistance < acc.totalDistance ? current : acc, this.openList[0]);
        this.openList.splice(this.openList.indexOf(currentNode), 1);
        currentNode.visited = true;

        // Found end node
        if (currentNode.id === this.endNode.id) {
            this.openList = [];
            this.finished = true;
            return [currentNode];
        }

        for (const n of currentNode.neighbors) {
            const neighbor = n.node;
            const edge = n.edge;

            // Apply k-step look-ahead heuristic
            const kStepCost = this.kStepLookAhead(neighbor);
            const neighborCurrentCost = currentNode.distanceFromStart + edge.weight;

            if (this.openList.includes(neighbor) && neighbor.distanceFromStart <= neighborCurrentCost) continue;
            if (this.closedList.includes(neighbor) && neighbor.distanceFromStart <= neighborCurrentCost) continue;

            if (!this.openList.includes(neighbor) && !this.closedList.includes(neighbor)) {
                this.openList.push(neighbor);
            }

            neighbor.distanceFromStart = neighborCurrentCost;
            neighbor.distanceToEnd = kStepCost;
            neighbor.referer = currentNode;
            neighbor.parent = currentNode;
            updatedNodes.push(neighbor);
        }

        this.closedList.push(currentNode);

        return [...updatedNodes, currentNode];
    }
}

export default AStar_kstep;

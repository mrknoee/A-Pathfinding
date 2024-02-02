import PathfindingAlgorithm from "./PathfindingAlgorithm";
import PriorityQueue from '../PriorityQueue/';

class AStar_kstep extends PathfindingAlgorithm {
    constructor(k) {
        super();
        this.openList = new PriorityQueue((a, b) => a.fscore - b.fscore);
        this.closedList = new Set();
        this.k = k; // The 'k' in k-step lookahead
    }

    calculateKStepHeuristic(node, endNode, k, currentPath = [], visited = new Set()) {
        if (k === 0 || node === endNode) {
            return this.heuristic(node, endNode);
        }
    
        let minHeuristic = Infinity;
        visited.add(node);
    
        for (let { node: neighbor } of node.neighbors) {
            if (visited.has(neighbor)) continue; // Skip already visited nodes in the current path
    
            let newPath = [...currentPath, neighbor];
            let pathCost = newPath.reduce((acc, n, i) => {
                if (i === 0) return acc;
                return acc + this.heuristic(newPath[i - 1], n);
            }, 0);
    
            let futureHeuristic = this.calculateKStepHeuristic(neighbor, endNode, k - 1, newPath, new Set(visited));
            minHeuristic = Math.min(minHeuristic, pathCost + futureHeuristic);
        }
    
        visited.delete(node);
        return minHeuristic;
    }
    

    heuristic(node, endNode) {
        // Implement your heuristic here; for example, Euclidean distance:
        return Math.hypot(node.latitude - endNode.latitude, node.longitude - endNode.longitude);
    }

    start(startNode, endNode) {
        super.start(startNode, endNode);
        startNode.distanceFromStart = 0;
        startNode.distanceToEnd = this.calculateKStepHeuristic(startNode, endNode, this.k);
        this.openList.enqueue({ node: startNode, fscore: startNode.distanceToEnd });
    }

    nextStep() {
        if (this.openList.isEmpty()) {
            this.finished = true;
            return [];
        }

        let { node: currentNode } = this.openList.dequeue();
        this.closedList.add(currentNode);

        if (currentNode === this.endNode) {
            this.finished = true;
            return this.reconstructPath(currentNode);
        }

        for (let { node: neighbor } of currentNode.neighbors) {
            if (this.closedList.has(neighbor)) continue;

            let tentative_gScore = currentNode.distanceFromStart + this.heuristic(currentNode, neighbor);
            let tentative_fScore = tentative_gScore + this.calculateKStepHeuristic(neighbor, this.endNode, this.k);

            if (!this.openList.contains(neighbor) || tentative_gScore < neighbor.distanceFromStart) {
                neighbor.distanceFromStart = tentative_gScore;
                neighbor.distanceToEnd = tentative_fScore - tentative_gScore;
                neighbor.parent = currentNode;

                if (!this.openList.contains(neighbor)) {
                    this.openList.enqueue({ node: neighbor, fscore: tentative_fScore });
                }
            }
        }

        return [currentNode];
    }

    reconstructPath(endNode) {
        let path = [];
        let current = endNode;
        while (current !== null) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    }
}

export default AStar_kstep;

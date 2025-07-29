
// A* Pathfinding Algorithm Implementation

class Node {
    x: number;
    y: number;
    g: number; // Cost from start to current node
    h: number; // Heuristic cost from current node to end
    f: number; // Total cost (g + h)
    parent: Node | null;

    constructor(x: number, y: number, parent: Node | null = null) {
        this.x = x;
        this.y = y;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = parent;
    }
}

// Manhattan distance heuristic
function heuristic(pos0: { x: number, y: number }, pos1: { x: number, y: number }): number {
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
}

export function findPath(grid: number[][], startPos: { x: number, y: number }, endPos: { x: number, y: number }): { x: number, y: number }[] | null {
    const openList: Node[] = [];
    const closedList: boolean[][] = Array(grid.length).fill(false).map(() => Array(grid[0].length).fill(false));
    
    const startNode = new Node(startPos.x, startPos.y);
    const endNode = new Node(endPos.x, endPos.y);

    openList.push(startNode);

    while (openList.length > 0) {
        // Find the node with the lowest f cost in the open list
        let lowestIndex = 0;
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < openList[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        const currentNode = openList[lowestIndex];

        // End case -- result has been found, return the traced path
        if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
            const path: { x: number, y: number }[] = [];
            let curr: Node | null = currentNode;
            while (curr) {
                path.push({ x: curr.x, y: curr.y });
                curr = curr.parent;
            }
            return path.reverse();
        }

        // Normal case -- move currentNode from open to closed, process each of its neighbors
        openList.splice(lowestIndex, 1);
        closedList[currentNode.y][currentNode.x] = true;

        const neighbors = [];
        const { x, y } = currentNode;
        // Check all 8 directions
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const newX = x + j;
                const newY = y + i;
                
                if (newY >= 0 && newY < grid.length && newX >= 0 && newX < grid[0].length) {
                    neighbors.push({ x: newX, y: newY });
                }
            }
        }

        for (const neighborPos of neighbors) {
            // If the neighbor is unwalkable or is on the closed list, skip it
            if (grid[neighborPos.y][neighborPos.x] === 1 || closedList[neighborPos.y][neighborPos.x]) {
                continue;
            }

            const gScore = currentNode.g + 1; // Assuming cost of 1 for each step
            let gScoreIsBest = false;

            const neighborNodeInOpenList = openList.find(n => n.x === neighborPos.x && n.y === neighborPos.y);

            if (!neighborNodeInOpenList) {
                // This is the first time we have seen this node
                gScoreIsBest = true;
                const neighborNode = new Node(neighborPos.x, neighborPos.y);
                neighborNode.h = heuristic(neighborPos, endNode);
                openList.push(neighborNode);
            } else if (gScore < neighborNodeInOpenList.g) {
                // We have already seen the node, but this path is better
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                const neighborNode = openList.find(n => n.x === neighborPos.x && n.y === neighborPos.y)!;
                neighborNode.parent = currentNode;
                neighborNode.g = gScore;
                neighborNode.f = neighborNode.g + neighborNode.h;
            }
        }
    }

    // No path was found
    return null;
}

// Find a path from the start to the end using DFS
const findPathUsingDFS = async (labyrinth, currentCell, visited) => {
  if (!currentCell) {
    return null;
  }

  if (currentCell.isEnd) {
    return [currentCell]; // Reached the end
  }

  visited.add(currentCell._id);

  // Define adjacent moves in directions like > (up, down, left, right)
  const moves = [
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 }, // Right
    { x: 0, y: 1 }, // Up
    { x: 0, y: -1 },// Down
  ];

  for (const move of moves) {
    const nextX = currentCell.x + move.x;
    const nextY = currentCell.y + move.y;

    const nextCell = labyrinth.cells.find((cell) => cell.x === nextX && cell.y === nextY);

    if (nextCell && nextCell.type === "empty" && !visited.has(nextCell._id)) {
      const path = await findPath(labyrinth, nextCell, visited);
      console.log("29> path", path);
      if (path) {
        return [currentCell, ...path];
      }
    }
  }

  return null;
};

const findPathUsingBFS = async (labyrinth, startCell) => {
  const queue = [];
  const visited = new Set();

  queue.push([startCell]);

  while (queue.length > 0) {
    const currentPath = queue.shift(); // Dequeue the first path from the queue.
    const currentCell = currentPath[currentPath.length - 1];

    if (currentCell.isEnd) {
      return currentPath; // Return the path when the end is reached.
    }

    visited.add(currentCell._id);

    const moves = [
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 }, // Right
      { x: 0, y: 1 }, // Up
      { x: 0, y: -1 }, // Down
    ];

    for (const move of moves) {
      const nextX = currentCell.x + move.x;
      const nextY = currentCell.y + move.y;

      const nextCell = labyrinth.cells.find((cell) => cell.x === nextX && cell.y === nextY);

      if (nextCell && nextCell.type === "empty" && !visited.has(nextCell._id)) {
        queue.push([...currentPath, nextCell]);
      }
    }
  }

  return null;
};

module.exports = {
  findPathUsingDFS,
  findPathUsingBFS,
};
exports.convertCoordinatesToDirections = (coordinates) => {

  const directions = [];

  for (let i = 1; i < coordinates.length; i++) {
    const prevCoord = coordinates[i - 1];
    const currCoord = coordinates[i];

    if (currCoord.x > prevCoord.x) {
      directions.push('right');
    } else if (currCoord.x < prevCoord.x) {
      directions.push('left');
    } else if (currCoord.y > prevCoord.y) {
      directions.push('up');
    } else if (currCoord.y < prevCoord.y) {
      directions.push('down');
    }
  }
  return directions;
};
export const isCenter = ({ hex, halfHexCount, rows, columns }) => {
  const positionsForOddRowCount = [
    halfHexCount - Math.ceil(columns / 2) + 1,
    halfHexCount - Math.ceil(columns / 2) + 2,
    halfHexCount - Math.ceil(columns / 2),
    halfHexCount + Math.floor(columns / 2) + 1,
  ]

  return rows % 2
    ? hex == halfHexCount
    : positionsForOddRowCount.some((n) => n == hex);
};

export const isVillage = ({
  hex,
  halfHexCount,
  dist,
  rows,
  columns,
}) => {
  const positionsForOddRowCount = [
    halfHexCount - columns * (Math.floor(dist / 2) + (dist % 2)) - dist,
    halfHexCount - columns * dist,
    halfHexCount - columns * (Math.floor(dist / 2) + (dist % 2)) + dist,
    halfHexCount + columns * Math.floor(dist / 2) + dist,
    halfHexCount + columns * dist,
    halfHexCount + columns * Math.floor(dist / 2) - dist,
  ];

  const positionsForEvenRowCount = [
    halfHexCount - Math.ceil((columns * (dist + 1 - (dist % 2))) / 2) - dist,
    halfHexCount - Math.ceil((columns * (2 * dist + 1)) / 2) + 1,
    halfHexCount -
      Math.ceil((columns * (dist + 1 - (dist % 2))) / 2) +
      dist +
      2,
    halfHexCount +
      Math.floor((columns * (dist - 1 + (dist % 2))) / 2) +
      dist +
      2,
    halfHexCount + Math.floor((columns * (2 * dist + 1)) / 2) + 1,
    halfHexCount + Math.floor((columns * (dist - 1 + (dist % 2))) / 2) - dist,
  ];

  return rows % 2 == 0
    ? positionsForEvenRowCount.some((n) => n == hex)
    : positionsForOddRowCount.some((n) => n == hex);
};

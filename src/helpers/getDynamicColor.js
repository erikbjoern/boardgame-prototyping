export function getInvertedHexColor(backgroundColor) {
  const bgColorValueR =
    backgroundColor.length > 4
      ? backgroundColor.slice(1, 3)
      : backgroundColor.slice(1, 2) + backgroundColor.slice(1, 2)
  const bgColorValueG =
    backgroundColor.length > 4
      ? backgroundColor.slice(3, 5)
      : backgroundColor.slice(2, 3) + backgroundColor.slice(2, 3)
  const bgColorValueB =
    backgroundColor.length > 4
      ? backgroundColor.slice(5, 7)
      : backgroundColor.slice(3, 4) + backgroundColor.slice(3, 4)

  const rgbValues = [bgColorValueR, bgColorValueG, bgColorValueB].map((v, index) =>
    parseInt(v, 16)
  )

  const max = Math.max(...rgbValues)
  const rgbMax = 255
  const average = rgbValues.reduce((a, b) => a + b, 0) / rgbValues.length
  const blueIsSingleMax = ![rgbValues[0], rgbValues[1]].includes(max)

  // threshold decides whether to regard input as a dark shade
  let averageThreshold = max > 180 ? 70 : 110
  blueIsSingleMax && (averageThreshold += 20)
  const multiple = average < averageThreshold ? rgbMax / max : average / 200

  function getInvertedColorValue(v, index) {
    let multiplied = v * multiple

    // if result will be a bright shade, increase its brightness even more
    // else, make it even darker
    if (average < averageThreshold) {
      if (blueIsSingleMax && index == 0) {
        multiplied += (rgbMax - multiplied) / 1.8
      } else if (blueIsSingleMax && index == 1) {
        multiplied += (rgbMax - multiplied) / 1.4
      } else {
        multiplied += (rgbMax - multiplied) / 4
      }
    } else {
      multiplied -= multiplied * (2 / 3)
    }

    // if result will be a dark shade, increase main color slightly
    if (multiplied < rgbMax / 2 && v == max) {
      multiplied += 5
    }

    return multiplied
  }

  const adjustedValues = rgbValues.map((v, index) => getInvertedColorValue(v, index))

  return (
    '#' +
    adjustedValues
      .map(v =>
        Math.floor(v)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}
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

  const rgbValues = [bgColorValueR, bgColorValueG, bgColorValueB].map((v, index) => {
    let p = parseInt(v, 16)
    return index == 1 ? p * 1.05 : p
  })

  const max = Math.max(...rgbValues)
  const rgbMax = 255
  const average = rgbValues.reduce((a,b) => a + b, 0) / rgbValues.length
  const averageThreshold = max > 180 ? 70 : 110
  const multiple = average < averageThreshold ? (rgbMax / 2) / max : average / 400

  const adjustedValues = rgbValues.map(v => {
    let multiplied = v * multiple

    if (average < averageThreshold) {
      multiplied += (rgbMax - multiplied) / 2
    } else {
      multiplied -= multiplied / 3
    }

    if (multiplied < rgbMax / 2 && v == max) {
      multiplied += 5
    }

    if (max - average > 50 && max == rgbValues[2]) {
      multiplied = multiplied * 0.85
    }

    return Math.floor(multiplied)
      .toString(16)
      .padStart(2, '0')
  })

  return '#' + adjustedValues.join('')
}

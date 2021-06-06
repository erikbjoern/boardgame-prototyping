function getRGBValues(hexColor) {
  const r =
    hexColor.length > 4
      ? hexColor.slice(1, 3)
      : hexColor.slice(1, 2) + hexColor.slice(1, 2)
  const g =
    hexColor.length > 4
      ? hexColor.slice(3, 5)
      : hexColor.slice(2, 3) + hexColor.slice(2, 3)
  const b =
    hexColor.length > 4
      ? hexColor.slice(5, 7)
      : hexColor.slice(3, 4) + hexColor.slice(3, 4)

  return [r, g, b].map((v, index) => parseInt(v, 16))
}

const rgbMax = 255

export function getInvertedHexColor(hexColor) {
  const rgbValues = getRGBValues(hexColor)

  const max = Math.max(...rgbValues)
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

    // if result will be a dark shade, increase main hexColor slightly
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

export function getRandomHexColor(brightnessMin = 0, brightnessMax = 100) {
  if (brightnessMin < 0) {
    brightnessMin = 0
  } else {
    brightnessMin = brightnessMin / 100
  }

  if (brightnessMax > 100) {
    brightnessMax = 1
  } else {
    brightnessMax = brightnessMax / 100
  }

  function getRandomValue() {
    return Math.floor(
      255 * brightnessMin + Math.random() * (255 * brightnessMax - 255 * brightnessMin)
    )
  }

  return (
    '#' +
    ['r', 'g', 'b']
      .map(hue =>
        getRandomValue()
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

export function getInvertedHexcolorGrayscale(hexColor) {
  const rgbValues = getRGBValues(hexColor)

  const average = rgbValues.reduce((a, b) => a + b, 0) / rgbValues.length

  const invertedGrayValues = rgbValues.map(v => {
    if (average > rgbMax / 2) {
      return rgbMax / 2 - Math.min(rgbMax / 2, rgbMax - average * 1.1)
    } else {
      return rgbMax / 2 + Math.min(rgbMax / 2, average * 1.1)
    }
  })

  return (
    '#' +
    invertedGrayValues
      .map(v =>
        Math.floor(v)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

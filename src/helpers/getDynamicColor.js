export function getRGBValues(hexColor) {
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

  if (max == 0) return getInvertedHexcolorGrayscale('#000000')

  const average = rgbValues.reduce((a, b) => a + b, 0) / rgbValues.length
  const blueIsSingleMax = ![rgbValues[0], rgbValues[1]].includes(max)
  const redIsSingleMax = ![rgbValues[1], rgbValues[2]].includes(max)
  const nonMaxValues = rgbValues.filter(v => v !== max)
  const nonMaxAverage = nonMaxValues.length ? nonMaxValues.reduce((a, b) => a + b, 0) / nonMaxValues.length : average

  // threshold decides whether to regard input as a light shade
  // and depends on how high the maximum value is
  let averageThreshold = 120 - (20 * max / 180)
  // blue needs higher threshold, and keep returning a light shade for higher values
  // because a strong blue is not visibly as bright as green and red
  blueIsSingleMax && (averageThreshold += Math.max(45, nonMaxAverage / 3))

  // resulting in (x = v * multiplied           0 <= x <= 255, 0 <= x <≈ 65)
  const multiple = average < averageThreshold ? rgbMax / max : average / 1000

  function getInvertedColorValue(v, index) {
    // when (v == max) && (average < averageThreshold) multiplied will always be 255
    let multiplied = v * multiple

    // if result will be a bright shade, increase its brightness even more
    // else, make it even darker
    if (average < averageThreshold) {
      // see next comment below
      // increase red less than green
      if (blueIsSingleMax && index !== 2) {
        multiplied +=
          ((rgbMax - multiplied) * (index == 0 ? 0.75 : 0.8)) *
          ((max - rgbValues[index]) / max)
      } else if (redIsSingleMax && index !== 0) {
        // take 75% of the margin between multiplied and rgbMax and multiply by:
        // difference between max and the other values divided by rgbMax,
        // which will equal 1 when (max == rgbMax && nonMaxAverage == 0)
        // and ≈0 when (max ≈ nonMaxAverage), resulting in a smooth curve between different values
        multiplied += ((rgbMax - multiplied) * 0.75) * ((max - nonMaxAverage) / max)
      } else {
        multiplied += ((rgbMax - multiplied) * (index == 0 ? 0.6 : 0.8)) * ((max - nonMaxAverage) / max)
      }
    } else {
      if (v == max) {
        // increase main r/g/b value slightly
        // if multiple values == max, distribute the amount
        multiplied += 20 / rgbValues.filter(v => v == max).length
      }
    }


    // if (average < averageThreshold) {
    //   // if result is a bright shade, even out output
    //   multiplied = Math.min((rgbMax + multiplied + (rgbMax - average)) / 3, rgbMax)
    //   multiplied += multiplied == max ? 25 / rgbValues.filter(v => v == max).length : -25 * (rgbValues.length - rgbValues.filter(v => v == max).length)
    // }
    return multiplied
  }

  const adjustedValues = rgbValues.map((v, index) => getInvertedColorValue(v, index))

  // if result is bright yellow, tone it down
  if (
    adjustedValues[0] / 3 > adjustedValues[2] &&
    adjustedValues[1] / 3 > adjustedValues[2]
  ) {
    adjustedValues[0] = adjustedValues[0] * 0.85
    adjustedValues[1] = adjustedValues[1] * 0.85
  }

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
      return rgbMax / 2 - Math.min(rgbMax / 2, rgbMax - average + 75)
    } else {
      return rgbMax / 2 + Math.min(rgbMax / 2, average + 75)
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

export function getUniqueDefaultName(currentDefaultName, currentDataSet) {
  if (currentDataSet.find(l => l.name == currentDefaultName)) {
    currentDefaultName = getUniqueDefaultName(
      (currentDefaultName += '.1'),
      currentDataSet
    )
  }

  return currentDefaultName
}

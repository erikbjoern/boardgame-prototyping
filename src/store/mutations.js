export default {
  updateViewportWidth(state) {
    state.viewportWidth = visualViewport.width
  },
  toggleResourceValuesVisibility(state) {
    state.showResourceValues = !state.showResourceValues
  },
  toggleOverviewVisibility(state) {
    state.showOverview = !state.showOverview
  },
  keydown(state, keyCode) {
    if (!state.keysPressed.includes(keyCode)) {
      state.keysPressed.push(keyCode)
    }
  },
  keyup(state, keyCode) {
    state.keysPressed.splice(state.keysPressed.indexOf(keyCode), 1)
  },
  addTileToSelection(state, tileId) { 
    state.selectedTiles.push(tileId)
  },
  removeTileFromSelection(state, index) {
    state.selectedTiles.splice(index, 1)
  },
}

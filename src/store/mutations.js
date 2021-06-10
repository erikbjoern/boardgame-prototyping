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
}

export default {
  state: () => ({
    rowCount: null,
    columnCount: null,
    gap: null,
    tileSize: null,
    tileBorderWidth: null,
  }),
  mutations: {
    setInitialGrid(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) && (state[property] = payload[property])
      })
    },
    setRowCount(state, payload) {
      const rowCount = payload > 23 ? 23 : payload < 3 ? 3 : payload
      state.rowCount = rowCount
    },
    setColumnCount(state, payload) {
      const columnCount = payload > 23 ? 23 : payload < 3 ? 3 : payload
      state.columnCount = columnCount
    },
    setGap(state, payload) {
      state.gap = payload
    },
    setTileSize(state, payload) {
      state.tileSize = payload
    },
    setTileBorderWidth(state, payload) {
      state.tileBorderWidth = payload
    },
  },
  getters: {
    tileSize(state, getter, rootState) {
      const thresholdInPx = 45
      if (state.tileSize * (rootState.viewportWidth / 100) > thresholdInPx) {
        return state.tileSize
      } else {
        return (thresholdInPx / rootState.viewportWidth) * 100
      }
    },
  },
}

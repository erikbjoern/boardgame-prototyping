export default {
  state: () => ({
    rowCount: null,
    columnCount: null,
    hexRows: [],
    hexRowsStash: [],
    gap: null,
    tileSize: null,
    tileBorderWidth: null,
  }),
  mutations: {
    setRowCount(state, payload) {
      const rowCount = payload > 23 ? 23 : payload < 3 ? 3 : payload
      state.rowCount = rowCount
    },
    setColumnCount(state, payload) {
      const columnCount = payload > 23 ? 23 : payload < 3 ? 3 : payload
      state.columnCount = columnCount
    },
    addHexRow(state, { row, index }) {
      state.hexRows.push(row)
    },
    addHexRowToStash(state, { row, index }) {
      state.hexRowsStash.push(row)
    },
    removeHexRow(state) {
      state.hexRows.pop()
    },
    replaceHexRow(state, { row, index }) {
      state.hexRows[index] = row
    },
    replaceHexRowInStash(state, { row, index }) {
      state.hexRowsStash[index] = row
    },
    setInitialHexRows(state, payload) {
      state.hexRows = payload
    },
    setInitialHexRowsStash(state, payload) {
      state.hexRowsStash = payload
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
  actions: {
    getRowFromStash(context, index) {
      return context.state.hexRowsStash[index] || null
    },
    storeHexRow(context, { row, index }) {
      context.commit('addHexRow', { row, index })

      if (index == context.state.hexRowsStash.length) {
        context.commit('addHexRowToStash', { row: [...row], index })
      }
    },
    storeModifiedHexRow(context, { row, index }) {
      const stashedCopyOfRow = context.state.hexRowsStash[index]

      if (row.length > stashedCopyOfRow.length) {
        context.commit('replaceHexRow', { row, index })
        context.commit('replaceHexRowInStash', { row: [...row], index })
      } else {
        context.commit('replaceHexRow', { row, index })
      }
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

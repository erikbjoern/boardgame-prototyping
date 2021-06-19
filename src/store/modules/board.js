export default {
  state: () => ({
    tileRows: [],
    tileRowsStash: [],
    selectedTiles: [],
  }),
  mutations: {
    setInitialBoard(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) && (state[property] = payload[property])
      })
    },
    addHexRow(state, { row, index }) {
      state.tileRows.push(row)
    },
    addHexRowToStash(state, { row, index }) {
      state.tileRowsStash.push(row)
    },
    removeHexRow(state) {
      state.tileRows.pop()
    },
    replaceHexRow(state, { row, index }) {
      state.tileRows[index] = row
    },
    replaceHexRowInStash(state, { row, index }) {
      state.tileRowsStash[index] = row
    },
    addTileToSelection(state, tileId) {
      state.selectedTiles.push(tileId)
    },
    removeTileFromSelection(state, index) {
      state.selectedTiles.splice(index, 1)
    },
  },
  actions: {
    getRowFromStash(context, index) {
      return context.state.tileRowsStash[index] || null
    },
    storeHexRow(context, { row, index }) {
      context.commit('addHexRow', { row, index })

      if (index == context.state.tileRowsStash.length) {
        context.commit('addHexRowToStash', { row: [...row], index })
      }
    },
    storeModifiedHexRow(context, { row, index }) {
      const stashedCopyOfRow = context.state.tileRowsStash[index]

      if (row.length > stashedCopyOfRow.length) {
        context.commit('replaceHexRow', { row, index })
        context.commit('replaceHexRowInStash', { row: [...row], index })
      } else {
        context.commit('replaceHexRow', { row, index })
      }
    },
  },
}

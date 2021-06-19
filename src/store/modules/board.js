export default {
  state: () => ({
    tileRows: [],
    tileRowsStash: [],
    selectedTiles: [],
  }),
  mutations: {
    setBoardState(state, payload) {
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
    getRowFromStash({ state }, index) {
      return state.tileRowsStash[index] || null
    },
    storeHexRow({ commit, state }, { row, index }) {
      commit('addHexRow', { row, index })

      if (index == state.tileRowsStash.length) {
        commit('addHexRowToStash', { row: [...row], index })
      }
    },
    storeModifiedHexRow({ commit, state }, { row, index }) {
      const stashedCopyOfRow = state.tileRowsStash[index]

      if (row.length > stashedCopyOfRow.length) {
        commit('replaceHexRow', { row, index })
        commit('replaceHexRowInStash', { row: [...row], index })
      } else {
        commit('replaceHexRow', { row, index })
      }
    },
  },
}

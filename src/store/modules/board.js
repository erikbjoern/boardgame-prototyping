import EventBus from '@/eventBus'

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
    addTileRow(state, { row, index }) {
      state.tileRows.push(row)
    },
    addTileRowToStash(state, { row, index }) {
      state.tileRowsStash.push(row)
    },
    removeTileRow(state) {
      state.tileRows.pop()
    },
    replaceTileRow(state, { row, index }) {
      state.tileRows[index] = row
    },
    replaceTileRowInStash(state, { row, index }) {
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
    storeTileRow({ commit, state }, { row, index }) {
      commit('addTileRow', { row, index })

      if (index == state.tileRowsStash.length) {
        commit('addTileRowToStash', { row: [...row], index })
      }
    },
    storeModifiedTileRow({ commit, state }, { row, index }) {
      const stashedCopyOfRow = state.tileRowsStash[index]

      if (row.length > stashedCopyOfRow.length) {
        commit('replaceTileRow', { row, index })
        commit('replaceTileRowInStash', { row: [...row], index })
      } else {
        commit('replaceTileRow', { row, index })
      }
    },
    generateNewTiles({ commit, dispatch }) {
      commit('setBoardState', {
        tileRows: [],
        tileRowsStash: [],
        selectedTiles: [],
      })
      dispatch('arrangeLandscapePool') 

      EventBus.$emit('buildGrid')
    },
  },
}

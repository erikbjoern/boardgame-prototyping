import EventBus from '@/eventBus'

export default {
  state: () => ({
    tileRows: [],
    tileRowsStash: [],
    selectedTiles: [],
    draggableItems: [
      {
        id: '1',
        color: '#afa',
        invertedColorGrayScale: '#070',
        title: '',
        text: '',
        position: {
          x: 0,
          y: 0,
        },
      },
    ],
  }),
  mutations: {
    setBoardState(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) && (state[property] = payload[property])
      })
    },
    addTileRow(state, { row }) {
      state.tileRows.push(row)
    },
    addTileRowToStash(state, { row }) {
      state.tileRowsStash.push(row)
    },
    removeTileRow(state) {
      state.tileRows.pop()
    },
    replaceTileRow(state, { row, index }) {
      state.tileRows.splice(index, 1, row)
    },
    replaceTileRowInStash(state, { row, index }) {
      state.tileRowsStash.splice(index, 1, row)
    },
    addTileToSelection(state, tileId) {
      state.selectedTiles.push(tileId)
    },
    removeTileFromSelection(state, index) {
      state.selectedTiles.splice(index, 1)
    },
    setResourceValueOnTile(state, { tile, resource, value }) {
      const targetResource = state.tileRows[tile.rowIndex][tile.index].resources.find(
        r => r.name == resource.name
      )
      targetResource && (targetResource.amount = value)
    },
    updateDraggableItem(state, { id, property, value }) {
      const targetItem = state.draggableItems.find(i => i.id == id)
      targetItem?.hasOwnProperty(property) && (targetItem[property] = value)
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

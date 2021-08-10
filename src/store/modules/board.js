import EventBus from '@/eventBus'
import cuid from 'cuid'
import {
  getRandomHexColor,
  getInvertedHexColor,
  getInvertedHexcolorGrayscale,
} from '../../helpers/getDynamicColor'

export default {
  state: () => ({
    tileRows: [],
    tileRowsStash: [],
    selectedTiles: [],
    draggableItems: [],
    colors: {},
    landscapesAndResources: [],
  }),
  mutations: {
    setBoardState(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) && (state[property] = payload[property])
      })
    },
    setBoardColor(state, { dataset, itemName, color }) {
      state.colors[dataset].main[itemName] = color
      state.colors[dataset].inverted[itemName] = getInvertedHexColor(color)
      state.colors[dataset].grayscale[itemName] = getInvertedHexcolorGrayscale(color)
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
    addDraggableItem(state, payload) {
      state.draggableItems.push(payload)
    },
    putDraggableItemOnTop(state, id) {
      const targetItemIndex = state.draggableItems.findIndex(i => i.id == id)
      const targetItem = state.draggableItems[targetItemIndex]

      state.draggableItems.push(targetItem)
      state.draggableItems.splice(targetItemIndex, 1)
    },
    updateDraggableItem(state, { id, property, value }) {
      const targetItem = state.draggableItems.find(i => i.id == id)
      targetItem?.hasOwnProperty(property) && (targetItem[property] = value)
    },
    deleteDraggableItem(state, id) {
      const targetItemIndex = state.draggableItems.findIndex(i => i.id == id)
      state.draggableItems.splice(targetItemIndex, 1)
    },
  },
  actions: {
    addDraggableItem({ commit, rootState }) {
      const board = document.getElementById('board-container')
      const randomColor = getRandomHexColor()
      const initialX =
        (visualViewport.width - 140 - board.getBoundingClientRect().left) /
        rootState.grid.scale
      const initialY = (70 - board.getBoundingClientRect().top) / rootState.grid.scale

      const newItem = {
        id: cuid(),
        color: randomColor,
        invertedColorGrayScale: getInvertedHexcolorGrayscale(randomColor),
        title: '',
        text: '',
        position: {
          x: initialX,
          y: initialY,
        },
      }

      commit('addDraggableItem', newItem)
    },
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

      EventBus.$emit('buildNewBoard')
    },
    setBoardColors({ state, rootState, commit }) {
      const landscapes = rootState.landscapes.data
      const landscapeColors = landscapes.length
        ? {
            main: Object.assign(...landscapes.map(l => ({ [l.name]: l.color }))),
            inverted: Object.assign(
              ...landscapes.map(l => ({ [l.name]: getInvertedHexColor(l.color) }))
            ),
            grayscale: Object.assign(
              ...landscapes.map(l => ({
                [l.name]: getInvertedHexcolorGrayscale(l.color),
              }))
            ),
          }
        : {}

      const resources = rootState.resources.data
      const resourceColors = resources.length
        ? {
            main: Object.assign(...resources.map(r => ({ [r.name]: r.color }))),
            inverted: Object.assign(
              ...resources.map(r => ({ [r.name]: r.invertedColor }))
            ),
            grayscale: Object.assign(
              ...resources.map(r => ({ [r.name]: r.invertedColorGrayscale }))
            ),
          }
        : {}

      const colors = { landscapes: landscapeColors, resources: resourceColors }

      commit('setBoardState', { ...state, colors })
    },
    setBoardLandscapes({ state, rootState, commit }) {
      const landscapesAndResources =
        JSON.parse(JSON.stringify(rootState.landscapes.data)) || []

      commit('setBoardState', { ...state, landscapesAndResources })
    },
  },
}

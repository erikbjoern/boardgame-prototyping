import localForage from 'localforage'
import EventBus from '@/eventBus'
import { storeConfig } from '@/store'

function performTimeStampCheck(params) {
  const timeStamp = localStorage.getItem('timeStamp')

  if (new Date(timeStamp) < new Date('2021-06-10T18:18:56.926Z')) {
    localStorage.removeItem('grid')
    localStorage.removeItem('landscapes')
    localStorage.removeItem('resources')
    localStorage.removeItem('board')
    localStorage.setItem('timeStamp', new Date())
  }
}

export default {
  async setInitialGrid({ commit }) {
    const savedData = (await localForage.getItem('grid')) || {}

    let gridData = {}

    Object.entries(storeConfig.initialState.grid).forEach(([key, value]) => {
      gridData[key] = savedData[key] || value
    })

    commit('setGridState', gridData || storeConfig.initialState.grid)
  },
  async setInitialLandscapes({ commit }) {
    const savedData = (await localForage.getItem('landscapes')) || {}

    commit('setLandscapeState', savedData || storeConfig.initialState.landscapes)
  },
  async setInitialResources({ commit }) {
    const savedData = (await localForage.getItem('resources')) || {}

    commit('setResourceState', savedData || storeConfig.initialState.resources)
  },
  async setInitialBoard({ commit }) {
    const savedData = (await localForage.getItem('board')) || {}

    let tileData

    if (savedData.tileRows?.length) {
      tileData = {
        tileRows: savedData.tileRows,
        tileRowsStash: savedData.tileRowsStash || [],
        selectedTiles: savedData.selectedTiles || [],
      }
    }

    commit('setBoardState', tileData || storeConfig.initialState.board)
  },
  async setInitialState({ dispatch }) {
    performTimeStampCheck()

    const setInitialGrid = dispatch('setInitialGrid')
    const setInitialResources = dispatch('setInitialResources')
    const setInitialLandscapes = dispatch('setInitialLandscapes')
    const setInitialBoard = dispatch('setInitialBoard')

    dispatch('arrangeLandscapePool')

    await Promise.all([
      setInitialResources,
      setInitialLandscapes,
      setInitialBoard,
      setInitialGrid,
    ])
  },
  updateLocalStorage({ state }) {
    localForage.setItem('grid', state.grid)
    localForage.setItem('landscapes', state.landscapes)
    localForage.setItem('resources', state.resources)
    localForage.setItem('board', state.board)
    localForage.setItem('timeStamp', new Date())
  },
  resetAdjustments({ commit }) {
    commit('setGridState', storeConfig.initialState.grid)
  },
  resetTiles({ commit }) {
    commit('setBoardState', {
      tileRows: [],
      tileRowsStash: [],
      selectedTiles: [],
    })

    EventBus.$emit('buildGrid')
  },
}

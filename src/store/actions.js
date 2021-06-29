import localForage from 'localforage'
import { storeConfig } from '@/store'

async function performTimeStampCheck(params) {
  const timeStamp = await localForage.getItem('timeStamp')

  if (new Date(timeStamp) < new Date('2021-06-19T18:18:56.926Z')) {
    const grid = localForage.removeItem('grid')
    const landscapes = localForage.removeItem('landscapes')
    const resources = localForage.removeItem('resources')
    const board = localForage.removeItem('board')

    localForage.setItem('timeStamp', new Date())

    await Promise.all([grid, landscapes, resources, board])
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
    const savedData = (await localForage.getItem('landscapes')) || null

    commit('setLandscapeState', savedData || storeConfig.initialState.landscapes)
  },
  async setInitialResources({ commit }) {
    const savedData = (await localForage.getItem('resources')) || null

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
        draggableItems: savedData.draggableItems || [],
      }
    }

    commit('setBoardState', tileData || storeConfig.initialState.board)
  },
  async setInitialPreferences({ commit }) {
    const savedData = (await localForage.getItem('preferences')) || null

    commit('setPreferencesState', savedData || storeConfig.initialState)
  },
  async setInitialState({ dispatch }) {
    performTimeStampCheck()

    await dispatch('setInitialResources')

    const promises = [
      'setInitialGrid',
      'setInitialLandscapes',
      'setInitialBoard',
      'setInitialPreferences',
    ].map(action => dispatch(action))

    await Promise.all(promises)

    dispatch('arrangeLandscapePool')
  },
  updateLocalStorage({ state }) {
    localForage.setItem('preferences', state.preferences)
    localForage.setItem('grid', state.grid)
    localForage.setItem('landscapes', state.landscapes)
    localForage.setItem('resources', state.resources)
    localForage.setItem('board', state.board)
    localForage.setItem('timeStamp', new Date())
  },
}

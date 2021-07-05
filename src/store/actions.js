import localForage from 'localforage'
import { storeConfig } from '@/store'
import cuid from 'cuid'

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
  async setInitialGrid({ commit }, settings) {
    const savedData = (await localForage.getItem('grid')) || {}

    let gridData = {}

    Object.entries(storeConfig.initialState.grid).forEach(([key, value]) => {
      gridData[key] = savedData[key] || value
    })

    commit('setGridState', (settings?.grid ?? gridData) || storeConfig.initialState.grid)
  },
  async setInitialLandscapes({ commit }, settings) {
    const savedData = (await localForage.getItem('landscapes')) || null

    commit('setLandscapeState', (settings?.landscapes ?? savedData) || storeConfig.initialState.landscapes)
  },
  async setInitialResources({ commit }, settings) {
    const savedData = (await localForage.getItem('resources')) || null

    commit('setResourceState', (settings?.resources ?? savedData) || storeConfig.initialState.resources)
  },
  async setInitialBoard({ commit }, settings) {
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

    commit('setBoardState', (settings?.board ?? tileData) || storeConfig.initialState.board)
  },
  async setInitialPreferences({ commit }, settings) {
    const savedData = (await localForage.getItem('preferences')) || null

    commit('setPreferencesState', (settings?.preferences ?? savedData) || storeConfig.initialState.preferences)
  },
  async setApplicationState({ dispatch }, settings = null) {
    performTimeStampCheck()

    await dispatch('setInitialResources', settings)

    const promises = [
      'setInitialGrid',
      'setInitialLandscapes',
      'setInitialBoard',
      'setInitialPreferences',
    ].map(action => dispatch(action, settings))

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
  async saveSettings({ state }, name) {
    const id = cuid()
    const settings = Object.assign(
      ...Object.entries(state)
        .filter(([k, v]) => !Object.keys(storeConfig.initialState.root).includes(k))
        .map(([k, v]) => ({ [k]: v }))
    )

    const newMetaEntry = { id, name, date: new Date() }
    const allMetaEntries = [newMetaEntry]
    const savedSettingsMeta = await localForage.getItem('savedSettingsMeta')

    if (savedSettingsMeta?.length) allMetaEntries.push(...savedSettingsMeta)

    localForage.setItem(`savedSettings:${id}`, settings)
    localForage.setItem('savedSettingsMeta', allMetaEntries)
  },
  async loadSettings({ dispatch }, id) {
    const savedSettings = await localForage.getItem(`savedSettings:${id}`)

    dispatch('setApplicationState', savedSettings)
  }
}

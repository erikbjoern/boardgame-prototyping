import db from '@/db'
import localForage from 'localforage'
import cuid from 'cuid'
import { storeConfig } from '@/store'
import { firestoreAction } from 'vuexfire'

async function performTimeStampCheck(params) {
  const timeStamp = await localForage.getItem('timeStamp')

  if (new Date(timeStamp) < new Date('2021-08-10T21:32:38.785Z')) {
    const grid = localForage.removeItem('grid')
    const landscapes = localForage.removeItem('landscapes')
    const resources = localForage.removeItem('resources')
    const board = localForage.removeItem('board')

    localForage.setItem('timeStamp', new Date())

    await Promise.all([grid, landscapes, resources, board])
  }
}

const firestoreId = 'EkKBOQjjJk6Bz4zJUIAs' || localForage.getItem('firestoreId')

export default {
  bindStore: firestoreAction(async ({ bindFirestoreRef }, id) => {
    return bindFirestoreRef('appState', db.collection(id).doc('appState'))
  }),
  async initFirebase({ dispatch }) {
    if (firestoreId) {
      dispatch('bindStore', firestoreId)
    } else {
      console.log('Todo')
    }
  },
  async setInitialGrid({ commit }, settings) {
    if (settings?.grid) {
      return commit('setGridState', settings.grid)
    }

    const savedData = (await localForage.getItem('grid')) || {}

    let gridData = {}

    Object.entries(storeConfig.initialState.grid).forEach(([key, value]) => {
      gridData[key] = savedData[key] || value
    })

    commit('setGridState', gridData || storeConfig.initialState.grid)
  },
  async setInitialLandscapes({ commit }, settings) {
    if (settings?.landscapes) {
      return commit('setLandscapeState', settings.landscapes)
    }

    const savedData = (await localForage.getItem('landscapes')) || null

    commit('setLandscapeState', savedData || storeConfig.initialState.landscapes)
  },
  async setInitialResources({ commit }, settings) {
    if (settings?.resources) {
      return commit('setResourceState', settings.resources)
    }

    const savedData = (await localForage.getItem('resources')) || null

    commit('setResourceState', savedData || storeConfig.initialState.resources)
  },
  async setInitialBoard({ commit }, settings) {
    if (settings?.board) {
      return commit('setBoardState', settings.board)
    }

    const savedData = (await localForage.getItem('board')) || {}
    // let savedData

    // const savedDataF = await db.collection('savedState').get()

    // if (savedDataF) {
    //   savedData = savedDataF.docs[0].data()
    // }

    let tileData

    if (savedData.tileRows?.length) {
      tileData = {
        tileRows: savedData.tileRows,
        tileRowsStash: savedData.tileRowsStash || [],
        selectedTiles: savedData.selectedTiles || [],
        draggableItems: savedData.draggableItems || [],
        colors: savedData.colors || {},
        landscapesAndResources: savedData.landscapesAndResources || [],
      }
    }

    commit('setBoardState', tileData || storeConfig.initialState.board)
  },
  async setInitialPreferences({ commit }, settings) {
    if (settings?.preferences) {
      return commit('setPreferencesState', settings.preferences)
    }

    const savedData = (await localForage.getItem('preferences')) || null

    commit('setPreferencesState', savedData || storeConfig.initialState.preferences)
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
  // updateApplicationState() {},
  updateLocalStorage({ state }) {
    const appState = {
      ...Object.assign(
        ...Object.entries(state)
          .filter(
            ([k, v]) =>
              !Object.keys(storeConfig.initialState.root).includes(k) && k !== 'appState'
          )
          .map(([k, v]) => ({ [k]: v }))
      ),
      board: {
        ...state.board,
        tileRows: state.board.tileRows?.map(row =>
          row.length ? Object.assign(...row.map((tile, i) => ({ [i]: tile }))) : {}
        ),
        tileRowsStash: state.board.tileRowsStash?.map(row =>
          row.length ? Object.assign(...row.map((tile, i) => ({ [i]: tile }))) : {}
        ),
      },
    }

    db.collection(firestoreId)
      .doc('appState')
      .set(appState)

    // localForage.setItem('preferences', state.preferences)
    // localForage.setItem('grid', state.grid)
    // localForage.setItem('landscapes', state.landscapes)
    // localForage.setItem('resources', state.resources)
    // localForage.setItem('board', state.board)
    // localForage.setItem('timeStamp', new Date())
  },
  async saveSettings({ state }, name) {
    const id = cuid()
    const newMetaEntry = { id, name, date: new Date() }
    const currentState = Object.assign(
      ...Object.entries(state)
        .filter(([k, v]) => !Object.keys(storeConfig.initialState.root).includes(k))
        .map(([k, v]) => ({ [k]: v }))
    )

    currentState.board.tileRows.forEach(
      (row, index) =>
        (currentState.board.tileRows[index] = Object.assign(
          ...row.map((tile, i) => ({ [i]: tile }))
        ))
    )

    currentState.board.tileRowsStash.forEach(
      (row, index) =>
        (currentState.board.tileRowsStash[index] = Object.assign(
          ...row.map((tile, i) => ({ [i]: tile }))
        ))
    )

    db.collection('savedState')
      .doc(id)
      .set(currentState)
    db.collection('savedStateMeta').add(newMetaEntry)
  },
  async loadSettings({ dispatch }, id) {
    db.collection('savedState')
      .doc(id)
      .get()
      .then(doc => {
        const savedState = doc.data()

        if (savedState.board?.tileRows?.length) {
          savedState.board.tileRows.forEach(
            (row, index) => (savedState.board.tileRows[index] = Object.values(row))
          )
        }

        if (savedState.board?.tileRowsStash?.length) {
          savedState.board.tileRowsStash.forEach(
            (row, index) => (savedState.board.tileRowsStash[index] = Object.values(row))
          )
        }

        dispatch('setApplicationState', savedState)
      })
  },
}

import db from '@/db'
import cuid from 'cuid'
import EventBus from '@/eventBus'
import { storeConfig } from '@/store'
import { firestoreAction } from 'vuexfire'

async function performTimeStampCheck() {
  const timeStamp = await localStorage.getItem('timeStamp')

  if (new Date(timeStamp) < new Date('2021-08-14T21:32:38.785Z')) {
    localStorage.setItem('timeStamp', new Date())
    return true
  }

  return false
}

export default {
  bindStore: firestoreAction(async ({ commit, bindFirestoreRef }, id) => {
    // safely reset state to know when new state is loaded
    commit('isAwaitingFirstGridBuild', true)
    commit('setBoardState', storeConfig.initialState.board)
    
    return bindFirestoreRef('appState', db.collection(id).doc('appState'))
  }),
  async setFirestoreId({ commit }) {
    let firestoreId

    const dataIsStale = await performTimeStampCheck()

    if (dataIsStale) {
      firestoreId = cuid()
      commit('useInitialState', true)
    } else {
      firestoreId = (await localStorage.getItem('firestoreId')) || 'EkKBOQjjJk6Bz4zJUIAs'
    }

    localStorage.setItem('firestoreId', firestoreId)
    commit('setFirestoreId', firestoreId)
  },
  async initFirebase({ state, dispatch }) {
    await dispatch('setFirestoreId')

    dispatch('bindStore', state.firestoreId)
  },
  async setApplicationState({ state, commit }, savedState) {
    function setState(appState) {
      commit('setResourceState', appState.resources)
      commit('setGridState', appState.grid)
      commit('setBoardState', appState.board)
      commit('setLandscapeState', appState.landscapes)
      commit('setPreferencesState', appState.preferences)
    }

    if (state.useInitialState) {
      setState(storeConfig.initialState)

      EventBus.$emit('buildNewBoard')

      return commit('useInitialState', false)
    } else {
      setState(savedState)
    }
  },
  writeToDatabase({ state }) {
    if (!state.firestoreId || state.isAwaitingFirstGridBuild) return

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

    db.collection(state.firestoreId)
      .doc('appState')
      .set(appState)
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

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
  bindStore: firestoreAction(async ({ state, commit, bindFirestoreRef }) => {
    // when rebinding - safely reset state to know when new state is loaded
    commit('isAwaitingFirstGridBuild', true)
    commit('setBoardState', {
      ...storeConfig.initialState.board,
    })

    return bindFirestoreRef('appState', db.collection(state.firestoreId).doc('appState'))
  }),
  async setFirestoreId({ state, commit }, firestoreId) {
    if (state.firestoreId) {
      const previousFirestoreId =
        state.previousFirestoreIds[0] ||
        (await localStorage.getItem('previousFirestoreId1'))

      localStorage.setItem('firestoreId', firestoreId)
      localStorage.setItem('previousFirestoreId1', state.firestoreId)

      if (previousFirestoreId) {
        localStorage.setItem('previousFirestoreId2', previousFirestoreId)
      }
      
      commit('setPreviousFirestoreIds', [state.firestoreId])
    }

    commit('setFirestoreId', firestoreId)
  },
  async initFirebase({ state, commit, dispatch }) {
    let firestoreId
    let previousFirestoreIds = []

    const dataIsStale = await performTimeStampCheck()

    if (!dataIsStale) {
      await Promise.all([
        (firestoreId = localStorage.getItem('firestoreId')),
        previousFirestoreIds.push(
          localStorage.getItem('previousFirestoreId1'),
          localStorage.getItem('previousFirestoreId2')
        ),
      ])

      previousFirestoreIds = previousFirestoreIds.filter(v => !!v)
    }

    if (!firestoreId || firestoreId == 'undefined') {
      firestoreId = cuid()
      commit('useInitialState', true)
    }

    await dispatch('setFirestoreId', firestoreId)
    dispatch('bindStore')
    commit('setPreviousFirestoreIds', previousFirestoreIds)
  },
  async setApplicationState({ state, commit }, savedState) {
    function setState(appState) {
      commit('setResourceState', appState?.resources || {})
      commit('setGridState', appState?.grid || {})
      commit('setBoardState', appState?.board || {})
      commit('setLandscapeState', appState?.landscapes || {})
      commit('setPreferencesState', appState?.preferences || {})
    }

    if (state.useInitialState) {
      const initialStateCopy = JSON.parse(JSON.stringify(storeConfig.initialState))
      setState(initialStateCopy)

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

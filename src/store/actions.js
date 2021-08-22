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

    return bindFirestoreRef(
      'appState',
      db.doc(`Rooms/${state.firestoreId}/AppStates/CurrentState`)
    )
  }),
  async setSaveFileId({ state, commit }, saveFileId) {
    localStorage.setItem('saveFileId', saveFileId)
    commit('setSaveFileId', saveFileId)
  },
  async setFirestoreId({ state, commit }, firestoreId) {
    const currentFirestoreId = state.firestoreId

    commit('setFirestoreId', firestoreId)

    if (currentFirestoreId) {
      commit('setPreviousFirestoreIds', [currentFirestoreId])
    } else {
      const previousIds =
        (await localStorage
          .getItem('previousFirestoreIds')
          ?.split(',')
          .filter(v => !!v)) || []

      commit('setPreviousFirestoreIds', previousIds)
    }

    localStorage.setItem('firestoreId', firestoreId)
    localStorage.setItem('previousFirestoreIds', state.previousFirestoreIds)
  },
  async initFirebase({ state, commit, dispatch }) {
    let firestoreId = await localStorage.getItem('firestoreId')
    const dataIsStale = await performTimeStampCheck()

    if (dataIsStale) {
      commit('useInitialState', true)
    }

    if (!firestoreId || firestoreId == 'undefined') {
      firestoreId = cuid()
      commit('useInitialState', true)
    }

    await dispatch('setFirestoreId', firestoreId)
    dispatch('bindStore')
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
  writeStateToDatabase({ state }, documentId) {
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

    db.doc(`Rooms/${state.firestoreId}/AppStates/${documentId}`).set(appState)
  },
  saveState({ state, dispatch }, name) {
    const fileId = cuid()
    const newMetaEntry = { roomId: state.firestoreId, fileId, name, date: new Date() }

    dispatch('writeStateToDatabase', fileId)

    db.collection(`GlobalSaveFilesMeta`).add(newMetaEntry)
  },
  async loadState({ state, dispatch }, { roomId, fileId, stayOnThisConnection }) {
    let rebindStore = false

    if (stayOnThisConnection) {
      dispatch('saveState', 'Auto-save')
    } else if (roomId !== state.firestoreId) {
      rebindStore = true
      await dispatch('setFirestoreId', roomId)
    }

    db.doc(`Rooms/${roomId}/AppStates/${fileId}`)
      .get()
      .then(doc => {
        const savedState = doc.data()

        if (savedState) {
          db.doc(`Rooms/${state.firestoreId}/AppStates/CurrentState`).set(savedState)
        }
      })

    rebindStore && dispatch('bindStore')
  },
}

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
      db.doc(`Rooms/${state.firestoreId}/AppStates/${state.saveFileId}`)
    )
  }),
  async setSaveFileId({ state, commit }, saveFileId) {
    localStorage.setItem('saveFileId', saveFileId)
    commit('setSaveFileId', saveFileId)
  },
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

      const saveFileId = (await localStorage.getItem('saveFileId')) || cuid()

      commit('setSaveFileId', saveFileId)
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
  writeToDatabase({ state }, { roomId, fileId } = {}) {
    if (!state.firestoreId || state.isAwaitingFirstGridBuild) return

    roomId ??= state.firestoreId
    fileId ??= state.saveFileId

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

    db.doc(`Rooms/${roomId}/AppStates/${fileId}`).set(appState)
  },
  saveState({ state, dispatch }, name) {
    const fileId = cuid()
    const newMetaEntry = { roomId: state.firestoreId, fileId, name, date: new Date() }

    dispatch('writeToDatabase', { roomId: state.firestoreId, fileId })

    db.collection(`Rooms/SaveFiles/MetaEntries`).add(newMetaEntry)
  },
  async loadState({ state, dispatch }, { roomId, fileId, stayOnThisConnection }) {
    if (stayOnThisConnection) {
      dispatch('saveState', 'Auto-save')

      // fetch the desired save and write to a new fileId on *this* connection
      // then bind to that connection
      const newFileId = cuid()

      db.doc(`Rooms/${roomId}/AppStates/${fileId}`)
        .get()
        .then(doc => {
          const savedState = doc.data()

          if (savedState) {
            db.doc(`Rooms/${state.firestoreId}/AppStates/${newFileId}`).set(savedState)
          }
        })

      dispatch('setSaveFileId', newFileId)
    } else {
      if (roomId !== state.firestoreId) {
        await dispatch('setFirestoreId', roomId)
      }

      dispatch('setSaveFileId', fileId)
    }

    dispatch('bindStore')
  },
}

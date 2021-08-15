import Vue from 'vue'
import Vuex from 'vuex'
import { StoreConfig } from './storeConfig'

Vue.use(Vuex)

const storeConfiguration = new StoreConfig()

export const storeConfig = JSON.parse(JSON.stringify(storeConfiguration))

const store = new Vuex.Store(storeConfiguration.create())

store.subscribe((mutation, state) => {
  if (mutation.type == 'vuexfire/SET_VALUE' && mutation.payload?.path == 'appState') {
    // the mutation is passing incoming data from firestore
    const appState = mutation.payload.data

    if (appState?.board) {
      appState.board.tileRows = appState.board.tileRows?.map(row => Object.values(row))
      appState.board.tileRowsStash = appState.board.tileRowsStash?.map(row =>
        Object.values(row)
      )
    }

    store.dispatch('setApplicationState', appState)
  } else {
    // the mutation is internal - update firestore
    let debouncedWriteToDatabase = undefined

    if (debouncedWriteToDatabase) {
      clearTimeout(debouncedWriteToDatabase)
    }

    debouncedWriteToDatabase = setTimeout(() => {
      store.dispatch('writeToDatabase')
    }, 1000)
  }
})

export default store

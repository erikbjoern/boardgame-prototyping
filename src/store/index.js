import Vue from 'vue'
import Vuex from 'vuex'
import { StoreConfig } from './storeConfig'

Vue.use(Vuex)

const storeConfiguration = new StoreConfig()

export const storeConfig = JSON.parse(JSON.stringify(storeConfiguration))

const store = new Vuex.Store(storeConfiguration.create())

let updateLocalStorageTimer = undefined

store.subscribe((mutation, state) => {
  if (!state.initialised) return

  if (updateLocalStorageTimer) {
    clearTimeout(updateLocalStorageTimer)
  }

  updateLocalStorageTimer = setTimeout(() => {
    store.dispatch('updateLocalStorage')
  }, 1000)
})

export default store

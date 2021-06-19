import Vue from 'vue'
import Vuex from 'vuex'
import { StoreConfig } from './storeConfig'

Vue.use(Vuex)

export const storeConfig = new StoreConfig()

const store = new Vuex.Store(storeConfig.create())

store.watch(
  state => state,
  () => {
    store.dispatch('updateLocalStorage')
  },
  {
    deep: true,
  }
)

export default store

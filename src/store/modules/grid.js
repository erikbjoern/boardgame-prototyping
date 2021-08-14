import { storeConfig } from '@/store'

export default {
  state: () => ({
    rowCount: null,
    columnCount: null,
    gap: null,
    tileBorderWidth: null,
    scale: null,
  }),
  mutations: {
    setGridState(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) && (state[property] = payload[property])
      })
    },
    setGridProperty(state, { property, value }) {
      if (['rowCount', 'columnCount'].includes(value)) {
        value > 23 && (value = 23)
        value < 3 && (value = 3)
      }
      state[property] = value
    },
  },
  actions: {
    resetAdjustments({ commit }) {
      commit('setGridState', storeConfig.initialState.grid)
    },
  },
}

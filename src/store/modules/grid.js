import { storeConfig } from '@/store'

export default {
  state: () => ({
    rowCount: null,
    columnCount: null,
    gap: null,
    tileSize: null,
    tileBorderWidth: null,
    scale: null,
  }),
  getters: {
    tileSize(state, getter, rootState) {
      const thresholdInPx = 45
      if (state.tileSize * (rootState.viewportWidth / 100) > thresholdInPx) {
        return state.tileSize
      } else {
        return (thresholdInPx / rootState.viewportWidth) * 100
      }
    },
  },
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

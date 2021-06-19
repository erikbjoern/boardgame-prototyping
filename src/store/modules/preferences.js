export default {
  state: () => ({
    showResourceValues: false,
    showOverview: false,
  }),
  mutations: {
    setPreferencesState(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) && (state[property] = payload[property])
      })
    },
    toggleResourceValuesVisibility(state) {
      state.showResourceValues = !state.showResourceValues
    },
    toggleOverviewVisibility(state) {
      state.showOverview = !state.showOverview
    },
  },
}

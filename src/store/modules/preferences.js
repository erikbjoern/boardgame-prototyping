export default {
  state: () => ({
    showResourceValues: true,
    showOverview: true,
    showSummary: true,
  }),
  mutations: {
    setPreferencesState(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) && (state[property] = payload[property])
      })
    },
    toggleVisibility(state, item) {
      const propertyName = 'show' + item
      state[propertyName] = !state[propertyName]
    },
  },
}

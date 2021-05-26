import Vue from "vue";

export default {
  state: () => ({
    parameters: [
      {
        type: null,
        max: null,
        chance: null,
        fraction: null,
      },
    ],
    visibleValues: false,
    distributionMode: 'FRACTION'
  }),
  mutations: {
    setResourceParameter(state, { value, resource, property }) {
      value > 100 && (value = 100);
      const object = state.parameters.filter((r) => r.type == resource.type)[0];
      Vue.set(object, property, value);
    },
    setInitialResourceParameters(state, payload) {
      state.parameters = payload.parameters;
      state.visibleValues = payload.visibleValues;
      state.distributionMode = payload.distributionMode;
    },
    toggleResourceValuesVisibility(state) {
      state.visibleValues = !state.visibleValues;
    },
    toggleResourceDistributionMode(state) {
      state.distributionMode =
        state.distributionMode == "FRACTION"
          ? "INDIVIDUAL"
          : "FRACTION";
    },
  },
  getters: {
    resourceDistributionSum(state) {
      const fractions = state.parameters.map((p) => p.fraction);
      return fractions.reduce((a, b) => a + b, 0);
    },
  },
};

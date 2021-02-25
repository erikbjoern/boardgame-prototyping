import Vue from "vue";

export const resources = {
  state: () => ({
    parameters: [
      {
        type: null,
        max: null,
        chance: null,
      }
    ],
  }),
  mutations: {
    setResourceParameter(state, { value, resource, property }) {
      value > 100 && (value = 100)
      const object = state.parameters.filter(
        (r) => r.type == resource.type
      )[0];
      Vue.set(object, property, value);
    },
    setInitialResourceParameters(state, payload) {
      state.parameters = payload;
    },
  },
}
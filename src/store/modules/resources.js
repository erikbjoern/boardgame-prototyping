import Vue from 'vue'
import {
  getRandomHexColor,
  getInvertedHexColor,
  getInvertedHexcolorGrayscale,
} from '@/helpers/getDynamicColor.js'
import { getUniqueDefaultName } from '@/helpers/getUniqueName.js'
import { storeConfig } from '@/store'

export default {
  state: () => ({
    data: [],
  }),
  getters: {
    resourceColors(state) {
      return state.data.length
        ? Object.assign(
            ...state.data.map(r => ({
              [r.name]: {
                main: r.color,
                inverted: getInvertedHexColor(r.color),
                grayscale: getInvertedHexcolorGrayscale(r.color),
              },
            }))
          )
        : {}
    },
  },
  mutations: {
    setResourceState(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) &&
          (state[property] = JSON.parse(JSON.stringify(payload[property])))
      })
    },
    setResourceParameter(state, { value, name, property }) {
      const object = state.data.find(r => r.name == name)
      Vue.set(object, property, value)
    },
    addResource(state, payload) {
      state.data.push(payload)
    },
    removeResource(state, { name }) {
      const targetResourceIndex = state.data.findIndex(r => r.name == name)

      state.data.splice(targetResourceIndex, 1)
    },
  },
  actions: {
    addResource({ state, commit, dispatch }, name) {
      const color = getRandomHexColor([0, 0, 0], [55, 55, 55])

      name ||= getUniqueDefaultName(`resurs #${state.data.length + 1}`, state.data)

      const payload = {
        name,
        color,
      }

      commit('addResource', payload)
    },
    resetResources({ commit }) {
      commit('setResourceState', storeConfig.initialState.resources)
    },
    removeResource({ commit, dispatch }, { name }) {
      commit('removeResource', { name })
      dispatch('removeResourceFromLandscapes', name)
    },
    removeAllResources({ state, commit, dispatch }) {
      state.data.forEach(r => dispatch('removeResourceFromLandscapes', r.name))

      state.data = []
    },
    addMissingResources({ state, dispatch }, resourcesOnLandscapes) {
      resourcesOnLandscapes.forEach(resourceName => {
        if (!state.data.some(r => r.name == resourceName)) {
          dispatch('addResource', resourceName)
        }
      })
    },
  },
}

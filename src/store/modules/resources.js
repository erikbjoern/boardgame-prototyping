import Vue from 'vue'
import { getRandomHexColor, getInvertedHexColor } from '@/helpers/getDynamicColor.js'
import { getUniqueDefaultName } from '@/helpers/getUniqueName.js'
import { storeConfig } from '@/store'

export default {
  state: () => ({
    data: [
      {
        name: '',
        color: '#eeefff',
        icon: '',
      },
    ],
  }),
  getters: {
    resourceColors(state) {
      return Object.assign(...state.data.map(r => ({ [r.name]: r.color })))
    },
    invertedResourceColors(state) {
      return Object.assign(...state.data.map(r => ({ [r.name]: r.invertedColor })))
    },
  },
  mutations: {
    setResourceState(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) && (state[property] = payload[property])
      })
    },
    setResourceParameter(state, { value, name, property }) {
      const object = state.data.find(r => r.name == name)
      Vue.set(object, property, value)
    },
    addResource(state, name) {
      const color = getRandomHexColor([0, 0, 0], [55, 55, 55])

      name ||= getUniqueDefaultName(
        `resurs #${state.data.length + 1}`,
        state.data
      )

      const payload = {
        name,
        color,
        invertedColor: getInvertedHexColor(color),
      }

      state.data.push(payload)
    },
    removeResource(state, { name }) {
      const targetResourceIndex = state.data.findIndex(r => r.name == name)

      state.data.splice(targetResourceIndex, 1)
    },
  },
  actions: {
    resetResources({ commit }) {
      commit('setResourceState', storeConfig.initialState.resources)
    },
    removeResource({ commit, dispatch }, { name }) {
      commit('removeResource', { name })
      dispatch('removeResourceFromLandscapes', name)
    },
    addMissingResources({ state, commit }, resourcesOnLandscapes) {
      resourcesOnLandscapes.forEach(resourceName => {
        if (!state.data.some(r => r.name == resourceName)) {
          commit('addResource', resourceName)
        }
      });
    }
  },
}

import Vue from 'vue'
import { getRandomHexColor, getInvertedHexColor } from '@/helpers/getDynamicColor.js'
import { getUniqueDefaultName } from '@/helpers/getUniqueName.js'
import { storeConfig } from '@/store'

export default {
  state: () => ({
    data: [
      {
        name: '',
        color: '#efefef',
        icon: '',
      },
    ],
  }),
  getters: {
    resourceColors(state) {
      if (state.data.length) {
        return Object.assign(...state.data.map(r => ({ [r.name]: r.color })))
      } else return []
    },
    invertedResourceColors(state) {
      if (state.data.length) {
        return Object.assign(...state.data.map(r => ({ [r.name]: r.invertedColor })))
      } else return []
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
    addResource(state, name) {
      const color = getRandomHexColor([0, 0, 0], [55, 55, 55])

      name ||= getUniqueDefaultName(`resurs #${state.data.length + 1}`, state.data)

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
    removeAllResources({ state, commit, dispatch }) {
      state.data.forEach(r => dispatch('removeResourceFromLandscapes', r.name))

      state.data = []
    },
    addMissingResources({ state, commit }, resourcesOnLandscapes) {
      resourcesOnLandscapes.forEach(resourceName => {
        if (!state.data.some(r => r.name == resourceName)) {
          commit('addResource', resourceName)
        }
      })
    },
  },
}

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
    pool: [],
  }),
  getters: {
    landscapeDistributionSum(state) {
      const fractions = state.data.map(l => l.fraction)
      return fractions.reduce((a, b) => a + b, 0)
    },
  },
  mutations: {
    setLandscapeState(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) &&
          (state[property] = JSON.parse(JSON.stringify(payload[property])))
      })
    },
    setLandscapeParameter(state, { value, name, property }) {
      value > 100 && (value = 100)
      const object = state.data.find(l => l.name == name)
      Vue.set(object, property, value)
    },
    addLandscape(state, payload) {
      state.data.push(payload)
    },
    removeLandscape(state, { name }) {
      const targetLandscapeIndex = state.data.findIndex(l => l.name == name)

      state.data.splice(targetLandscapeIndex, 1)
    },
    addResourceToLandscape(state, { landscape, resource }) {
      const targetLandscape = state.data.find(l => l.name == landscape)

      targetLandscape?.resources.push(resource)
    },
    setResourceValueOnLandscape(state, { name, resourceName, property, value }) {
      const targetLandscape = state.data.find(l => l.name == name)
      const targetResourceIndex = targetLandscape.resources.findIndex(
        r => r.name == resourceName
      )
      const updatedResource = {
        ...targetLandscape.resources[targetResourceIndex],
        [property]: value,
      }

      const landscapeResources = [
        ...targetLandscape.resources.slice(0, targetResourceIndex),
        updatedResource,
        ...targetLandscape.resources.slice(targetResourceIndex + 1),
      ]

      Vue.set(targetLandscape, 'resources', landscapeResources)
    },
    removeResourceFromLandscape(state, { name, landscapeName }) {
      const targetLandscape = state.data.find(l => l.name == landscapeName)
      const targetResourceIndex = targetLandscape.resources.findIndex(r => r.name == name)

      targetLandscape.resources.splice(targetResourceIndex, 1)
    },
    setLandscapePool(state, payload) {
      state.pool = payload
    },
  },
  actions: {
    addLandscape({ state, commit }) {
      const color = getRandomHexColor([1, 1, 0], [60, 60, 30])

      const defaultName = getUniqueDefaultName(
        `landskap #${state.data.length + 1}`,
        state.data
      )

      const payload = {
        name: defaultName,
        fraction: 1,
        color,
        resources: [],
      }

      commit('addLandscape', payload)
    },
    arrangeLandscapePool({ state, getters, commit }, payload) {
      const landscapes = state.data

      for (var i = 0, landscapePool = []; i < landscapes.length; i++) {
        for (let i2 = 0; i2 < landscapes[i].fraction; i2++) {
          landscapePool.push(landscapes[i].name)
        }
      }

      commit('setLandscapePool', landscapePool)
    },
    resetLandscapes({ commit, dispatch }) {
      commit('setLandscapeState', storeConfig.initialState.landscapes)

      const resourcesOnLandscapes = Array.from(
        new Set(
          storeConfig.initialState.landscapes.data.flatMap(l =>
            l.resources.map(r => r.name)
          )
        )
      )

      if (resourcesOnLandscapes.length) {
        dispatch('addMissingResources', resourcesOnLandscapes)
      }

      dispatch('arrangeLandscapePool')
    },
    removeLandscape({ commit }, { name }) {
      commit('removeLandscape', { name })
    },
    removeAllLandscapes({ state, commit }) {
      state.data = []
    },
    removeResourceFromLandscape({ commit }, { name, landscapeName }) {
      commit('removeResourceFromLandscape', { name, landscapeName })
    },
    removeResourceFromLandscapes({ state, commit }, resourceName) {
      state.data.forEach(l => {
        const targetResourceIndex = l.resources.findIndex(r => r.name == resourceName)

        targetResourceIndex > -1 &&
          commit('removeResourceFromLandscape', {
            name: resourceName,
            landscapeName: l.name,
          })
      })
    },
  },
}

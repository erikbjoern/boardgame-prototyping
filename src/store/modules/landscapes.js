import Vue from 'vue'
import { getRandomHexColor, getInvertedHexColor } from '@/helpers/getDynamicColor.js'
import { getUniqueDefaultName } from '@/helpers/getUniqueName.js'
import { storeConfig } from '@/store'

export default {
  state: () => ({
    data: [
      {
        name: 'Sten',
        fraction: 1,
        color: '#eeefff',
        invertedColor: '#111000',
        resources: [
          {
            name: '',
            min: 0,
            max: 0,
          },
        ],
      },
    ],
    landscapePool: [],
  }),
  mutations: {
    setLandscapeState(state, payload) {
      Object.keys(payload).forEach(property => {
        state.hasOwnProperty(property) && (state[property] = payload[property])
      })
    },
    setLandscapeParameter(state, { value, name, property }) {
      value > 100 && (value = 100)
      const object = state.data.find(l => l.name == name)
      Vue.set(object, property, value)
    },
    addLandscape(state) {
      const color = getRandomHexColor([1, 1, 0], [60, 60, 30])

      const defaultName = getUniqueDefaultName(
        `landskap #${state.data.length + 1}`,
        state.data
      )

      const payload = {
        name: defaultName,
        fraction: 1,
        color,
        invertedColor: getInvertedHexColor(color),
        resources: [],
      }

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
      state.landscapePool = payload
    },
  },
  actions: {
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

      dispatch('addMissingResources', resourcesOnLandscapes)
      dispatch('arrangeLandscapePool')
    },
  },
  getters: {
    landscapeDistributions(state, getters) {
      return state.data.map(l => l.fraction)
    },
    landscapeDistributionSum(state) {
      const fractions = state.data.map(l => l.fraction)
      return fractions.reduce((a, b) => a + b, 0)
    },
    landscapeColors(state) {
      return Object.assign(...state.data.map(l => ({ [l.name]: l.color })))
    },
  },
}

import Vue from 'vue'
import { getRandomHexColor, getInvertedHexColor } from '@/helpers/getDynamicColor.js'

export default {
  state: () => ({
    data: [
      {
        name: '',
        fraction: 0,
        color: '#eee',
        resources: [
          {
            name: '',
            min: 0,
            max: 0,
          },
        ],
      },
    ],
  }),
  mutations: {
    setLandscapeParameter(state, { value, landscapeName, property }) {
      value > 100 && (value = 100)
      const object = state.data.find(l => l.name == landscapeName)
      Vue.set(object, property, value)
    },
    setInitialLandscapeParameters(state, payload) {
      state.data = payload
    },
    addLandscape(state) {
      const color = getRandomHexColor(0,50)
      const payload = {
        name: '',
        fraction: 1,
        color,
        invertedColor: getInvertedHexColor(color),
        resources: [
          {
            name: '',
            min: 0,
            max: 0,
          },
        ],
      }

      state.parameters.push(payload)
    },
  },
  getters: {
    landscapeDistributionSum(state) {
      const fractions = state.data.map(l => l.fraction)
      return fractions.reduce((a, b) => a + b, 0)
    },
    landscapeNames(state) {
      return state.data.map(l => l.name)
    },
    landscapeChances(state, getters) {
      return state.data.map(l => l.fraction / getters.landscapeDistributionSum)
    },
    landscapeColors(state) {
      return Object.assign(...state.data.map(l => ({ [l.name]: l.color })))
    },
  },
}

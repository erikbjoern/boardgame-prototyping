import Vue from 'vue'
import { getRandomHexColor, getInvertedHexColor } from '@/helpers/getDynamicColor.js'

export default {
  state: () => ({
    data: [
      {
        name: '',
        color: '#eee',
        icon: '',
      },
    ],
  }),
  mutations: {
    setResourceParameter(state, { value, resource, property }) {
      const object = state.resources.find(r => r.id == resource.id)
      Vue.set(object, property, value)
    },
    setInitialResourceData(state, payload) {
      state.data = payload
    },
    addResource(state) {
      const color = getRandomHexColor(0, 50)

      const payload = {
        name: `resurs #${state.data.length + 1}`,
        color,
        invertedColor: getInvertedHexColor(color),
      }

      state.data.push(payload)
    },
  },
  getters: {
    resourceColors(state) {
      return Object.assign(...state.data.map(r => ({ [r.name]: r.color })))
    },
    invertedResourceColors(state) {
      return Object.assign(...state.data.map(r => ({ [r.name]: r.invertedColor })))
    },
  },
}

import Vue from 'vue'
import { getRandomHexColor, getInvertedHexColor } from '@/helpers/getDynamicColor.js'
import { getUniqueDefaultName } from '@/helpers/getUniqueName.js'

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
  mutations: {
    setResourceParameter(state, { value, name, property }) {
      const object = state.resources.find(r => r.name == name)
      Vue.set(object, property, value)
    },
    setInitialResourceData(state, payload) {
      state.data = payload
    },
    addResource(state) {
      const color = getRandomHexColor(0, 50)

      const defaultName = getUniqueDefaultName(
        `resurs #${state.data.length + 1}`,
        state.data
      )

      const payload = {
        name: defaultName,
        color,
        invertedColor: getInvertedHexColor(color),
      }

      state.data.push(payload)
    },
    removeResource(state, name) {
      const targetResourceIndex = state.data.findIndex(r => r.name == name)

      state.data.splice(targetResourceIndex, 1)
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

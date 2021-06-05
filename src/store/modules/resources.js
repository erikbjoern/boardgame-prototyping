import Vue from 'vue'
import colors from '@/assets/colors'

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
      const payload = {
        name: 'nytt',
        color: '#ddd',
        icon: '',
      }

      state.resources.push(payload)
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

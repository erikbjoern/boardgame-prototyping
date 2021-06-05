<template>
  <div
    class="flex w-full justify-between rounded overflow-hidden"
    :style="{ backgroundColor: resource.color }"
  >
    <input
      class="font-semibold pl-2 py-2"
      name="name"
      v-model.lazy="resource.name"
      :style="{
        color: resource.invertedColor,
        backgroundColor: resource.color,
      }"
      @keydown.esc="handleEscapeKey"
    />
    <input
      class="font-semibold !w-24 text-sm text-center"
      name="color"
      v-model.lazy="resourceColor"
      :style="{
        color: resource.color,
        backgroundColor: resource.invertedColor,
      }"
      @keydown.esc="handleEscapeKey"
    />
  </div>
</template>

<script>
import { getInvertedHexColor } from '@/helpers/getDynamicColor.js'

export default {
  name: 'SettingsInputResources',
  props: ['resource'],
  computed: {
    resourceColor: {
      get() {
        return this.resource.color
      },
      set(value) {
        let color = value.slice(0, 7)

        if (!/^#dddddd/.test(color)) {
          let split = value.replace('#', '').split('')

          if (split.length == 3) {
            split = split.map(v => (v = v + v))
          }

          color = ['#', ...split].join('')
        }

        this.resource.color = color
        this.resource.invertedColor = getInvertedHexColor(color)
      },
    },
  },
  methods: {
    getInvertedHexColor,
    handleEscapeKey(e) {
      const property = e.target.name
      e.target.value = this.resource[property]
      e.target.blur()
    },
  },
}
</script>

<template>
  <div class="flex flex-col w-full rounded overflow-hidden">
    <div
      class="flex w-full p-2"
      :style="{ backgroundColor: getInvertedHexColor(landscape.color) }"
    >
      <input
        class="font-semibold flex-1 bg-transparent mr-2"
        v-model="landscape.name"
        :style="{ color: landscape.color }"
      />
      <input
        class="font-semibold w-16 bg-transparent text-sm"
        v-model.lazy="landscapeColor"
        :style="{ color: landscape.color }"
      />
    </div>
    <div
      class="flex flex-col items-stretch space-y-2 p-2"
      :style="{
        backgroundColor: landscape.color,
        color: getInvertedHexColor(landscape.color),
      }"
    >
      <label class="inline-flex justify-between font-semibold">
        min
        <div class="inline-block w-16">
          <div class="bg-white w-8 rounded">
            <input
              class="text-gray-900 font-semibold text-center w-8"
              :style="{ backgroundColor: `${landscape.color}99` }"
              type="number"
              name="min"
              :value="landscape.min"
              @change="handleChange"
              @keydown="keydownHandler"
            />
          </div>
        </div>
      </label>
      <label class="inline-flex justify-between font-semibold">
        max
        <div class="inline-block w-16">
          <div class="bg-white w-8 rounded">
            <input
              class="text-gray-900 font-semibold text-center w-8"
              :style="{ backgroundColor: `${landscape.color}99` }"
              type="number"
              name="max"
              :value="landscape.max"
              @change="handleChange"
              @keydown="keydownHandler"
            />
          </div>
        </div>
      </label>
      <label class="inline-flex justify-between font-semibold">
        fördelning
        <div class="inline-flex w-16">
          <div class="bg-white w-8 rounded">
            <input
              class="text-gray-900 font-semibold text-center w-8"
              :style="{ backgroundColor: `${landscape.color}99` }"
              type="text"
              name="fraction"
              :value="landscape.fraction"
              @change="handleChange"
              @keydown="keydownHandler"
            />
          </div>
          <span class="ml-2">/</span>
          <span class="ml-1">{{ $store.getters.landscapeDistributionSum }}</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import WoodIcon from '@/assets/icons/log.svg'
import StoneIcon from '@/assets/icons/stone-block.svg'
import WheatIcon from '@/assets/icons/wheat.svg'
import colors from '@/assets/colors'
import { getInvertedHexColor } from '@/helpers/getDynamicColor'

export default {
  name: 'SettingsInputLandscapes',
  components: {
    WoodIcon,
    StoneIcon,
    WheatIcon,
  },
  props: ['landscape'],
  data() {
    return {
      colors,
    }
  },
  computed: {
    landscapeColor: {
      get() {
        return this.landscape.color
      },
      set(value) {
        if (/^#dddddd/.test(value)) {
          this.landscape.color = value.slice(0, 7)
          return
        }

        let split = value.replace('#', '').split('')

        if (split.length == 3) {
          split = split.map(v => (v = v + v))
        }

        this.landscape.color = ['#', ...split].join('')
      },
    },
  },
  methods: {
    getInvertedHexColor,
    handleChange(e) {
      const value = parseInt(e.target.value)
      const landscape = this.landscape
      const property = e.target.name

      if (!value) {
        e.target.value = landscape[property]
        return
      }

      this.$store.commit('setLandscapeParameter', { value, landscape, property })
    },
    keydownHandler(e) {
      const value = property !== 'fraction' ? parseInt(e.target.value) : e.target.value
      const landscape = this.landscape
      const property = e.target.name

      if (e.which == 27 || e.code == 'Escape') {
        e.target.value = landscape[property]
        e.target.blur()
      }

      if (e.which == 13 || e.code == 'Enter') {
        this.$store.commit('setLandscapeParameter', {
          value,
          landscape,
          property,
        })
        e.target.blur()
      }
    },
  },
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
}

input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>

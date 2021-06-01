<template>
  <div
    class="landscape-input flex flex-col w-64 p-2"
    :style="{ backgroundColor: landscape.color }"
  >
    <div class="flex flex-col items-stretch space-y-2">
      <div class="flex justify-between">
        <h2>{{ landscape.name || 'resursens namn' }}</h2>
      </div>
      <label class="inline-flex justify-between">
        min
        <div class="inline-block w-16 space-x-1">
          <input
            class="rounded-sm"
            type="number"
            name="min"
            :value="landscape.min"
            @change="handleChange"
            @keydown="keydownHandler"
          />
        </div>
      </label>
      <label class="inline-flex justify-between">
        max
        <div class="inline-block w-16">
          <input
            class="rounded-sm"
            type="number"
            name="max"
            :value="landscape.max"
            @change="handleChange"
            @keydown="keydownHandler"
          />
        </div>
      </label>
      <label class="inline-flex justify-between">
        fördelning
        <div class="inline-block w-16 space-x-1">
          <input
            class="rounded-sm"
            type="text"
            name="fraction"
            :value="landscape.fraction"
            @change="handleChange"
            @keydown="keydownHandler"
          />
          <span>/</span>
          <span>{{ $store.getters.landscapeDistributionSum }}</span>
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

export default {
  name: 'SettingsInputLandscapes',
  components: {
    WoodIcon,
    StoneIcon,
    WheatIcon,
  },
  data() {
    return {
      colors,
    }
  },
  props: ['landscape'],
  methods: {
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

.landscape-input {
  animation: fadeIn 0.2s forwards;
  border-radius: 2px;
  color: #ffffff;
  opacity: 1;
}
.landscape-input input {
  width: 25px;
  margin-left: 3px;
}
.landscape-input input::-webkit-inner-spin-button,
.landscape-input input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>

<template>
  <div
    class="resource-input flex flex-col w-64 p-2"
    :style="{ backgroundColor: resource.color }"
  >
    <div class="flex flex-col items-stretch space-y-2">
      <div class="flex justify-between">
        <h2>{{ resource.name || 'resursens namn' }}</h2>
        <div class="inline-block w-16 p-1">
          <WoodIcon v-if="resource.name == 'trä'" />
          <StoneIcon v-if="resource.name == 'sten'" />
          <WheatIcon v-if="resource.name == 'mat'" />
        </div>
      </div>
      <label class="inline-flex justify-between">
        min
        <div class="inline-block w-16 space-x-1">
          <input
            class="rounded-sm"
            type="number"
            name="min"
            :value="resource.min"
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
            :value="resource.max"
            @change="handleChange"
            @keydown="keydownHandler"
          />
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
  name: 'SettingsInputResources',
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
  props: ['resource'],
  methods: {
    handleChange(e) {
      const value = parseInt(e.target.value)
      const resource = this.resource
      const property = e.target.name

      if (!value) {
        e.target.value = resource[property]
        return
      }

      this.$store.commit('setResourceParameter', { value, resource, property })
    },
    keydownHandler(e) {
      const value = property !== 'fraction' ? parseInt(e.target.value) : e.target.value
      const resource = this.resource
      const property = e.target.name

      if (e.which == 27 || e.code == 'Escape') {
        e.target.value = resource[property]
        e.target.blur()
      }

      if (e.which == 13 || e.code == 'Enter') {
        this.$store.commit('setResourceParameter', {
          value,
          resource,
          property,
        })
        e.target.blur()
      }
    },
  },
}
</script>

<style scoped>
svg {
  width: 20px !important;
  height: 20px !important;
  fill: transparent;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
}

.resource-input {
  animation: fadeIn 0.2s forwards;
  border-radius: 2px;
  color: #ffffff;
  opacity: 1;
}
.resource-input input {
  width: 25px;
  margin-left: 3px;
}
.resource-input input::-webkit-inner-spin-button,
.resource-input input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>

<template>
  <div class="flex w-full h-full">
    <div class="flex-1">
      <div class="mx-auto w-[11rem] flex flex-col space-y-3 h-full">
        <button
          class="btn w-full !mt-auto"
          :class="$store.state.preferences.showResourceValues && 'btn-active'"
          @click="toggleResourceValuesVisibility"
        >
          {{ $store.state.preferences.showResourceValues ? 'Visar' : 'Visa' }}
          resursvärden
        </button>
      </div>
    </div>
    <div class="flex-1 h-full">
      <div class="text-white flex flex-col h-full w-[11rem] justify-between mx-auto">
        <GridSettingsItem
          class="w-full mx-auto"
          v-for="property in gridProperties"
          :key="property.name"
          :property="property"
        />
        <button class="btn rounded-full w-full" @click="resetAdjustments">
          Återställ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/eventBus'
import GridSettingsItem from './GridSettingsItem'
import { scrollToCenter } from '@/helpers/scroll.js'

export default {
  name: 'BoardAndTiles',
  components: {
    GridSettingsItem,
  },
  data() {
    return {
      gridProperties: [
        {
          name: 'rowCount',
          min: 3,
          max: 23,
          text: 'Rader',
          showValue: true,
          multiple: 1,
          flexGrow: 10,
        },
        {
          name: 'columnCount',
          min: 3,
          max: 23,
          text: 'Kolumner',
          showValue: true,
          multiple: 1,
          flexGrow: 10,
        },
        {
          name: 'scale',
          min: 20,
          max: 120,
          text: 'Storlek',
          multiple: 40,
          flexGrow: 7,
        },
        {
          name: 'gap',
          min: 0,
          max: 20,
          text: 'Mellanrum',
          multiple: 70,
          flexGrow: 1,
        },
        {
          name: 'tileBorderWidth',
          min: 0,
          max: 20,
          text: 'Bård',
          multiple: 1,
          flexGrow: 1,
        },
      ],
    }
  },
  methods: {
    toggleResourceValuesVisibility(e) {
      this.$store.commit('toggleVisibility', 'ResourceValues')
      e.currentTarget.blur()
    },
    resetAdjustments() {
      this.$store.dispatch('resetAdjustments')
      scrollToCenter()
    },
  },
}
</script>

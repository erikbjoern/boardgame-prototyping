<template>
  <div class="flex w-full h-full">
    <div class="flex-1">
      <div class="w-36 mx-auto">
        <button
          class="h-8 w-full border rounded !font-thin text-sm tracking-wide bg-black"
          :class="
            $store.state.preferences.showResourceValues
              ? '!border-green-500 text-green-200'
              : 'border-gray-300 text-gray-300 !bg-opacity-10'
          "
          @click="toggleResourceValuesVisibility"
        >
          {{ $store.state.preferences.showResourceValues ? 'Visar' : 'Visa' }} resursvärden
        </button>
      </div>
    </div>
    <div class="text-white flex flex-col h-full justify-between flex-1">
      <GridSettingsItem
        class="w-48 mx-auto"
        v-for="property in gridProperties"
        :key="property.name"
        :property="property"
      />
      <button
        class="h-8 w-36 mx-auto border rounded-full !font-thin text-sm tracking-wide bg-black border-gray-100 text-gray-100"
        @click="resetAdjustments"
      >
        Återställ justeringar
      </button>
    </div>
  </div>
</template>

<script>
import GridSettingsItem from './GridSettingsItem'
import { scrollToCenter } from '@/helpers/scroll.js'

export default {
  name: 'GridSettings',
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
          name: 'tileSize',
          min: 60,
          max: 225,
          text: 'Storlek',
          multiple: 15,
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

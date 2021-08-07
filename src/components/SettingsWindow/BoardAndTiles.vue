<template>
  <div class="flex w-full h-full">
    <div class="flex-1">
      <div
        class="mx-auto w-[11rem] flex flex-col space-y-6 h-full text-white justify-between"
      >
        <GridSettingsItem
          class="w-full mx-auto"
          v-for="property in gridProperties"
          :key="property.name"
          :property="property"
        />
        <button class="btn rounded-full w-full" @click="resetAdjustments">
          Återställ
        </button>
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
    <div class="flex flex-col items-center space-y-6 flex-1 min-h-0">
      <p class="text-[#9f9f9f]">Färger på nuvarande bräde</p>
      <div class="h-8 w-full flex items-center px-[1.25rem]">
        <div class="flex w-full rounded overflow-hidden">
          <button
            v-for="([tabName, label], index) in [
              ['landscapes', 'Landskap'],
              ['resources', 'Resurser'],
            ]"
            :key="label"
            class="flex-1 bg-black border h-8"
            :class="[
              activeTab == tabName
                ? '!bg-opacity-100 text-[#eeeeee] border-green-500 border hover:!bg-opacity-100'
                : '!bg-opacity-10 text-[#9f9f9f]',
              tabName == 'landscapes' ? 'rounded-tl rounded-bl' : 'rounded-tr rounded-br',
              activeTab == 'landscapes' && index == 1 && 'border-l-0',
              activeTab == 'resources' && index == 0 && 'border-r-0',
            ]"
            @click="e => switchTab(e, tabName)"
          >
            <span class="relative inlinbe-block bottom-px">{{ label }}</span>
          </button>
        </div>
      </div>
      <div
        class="w-full flex flex-col flex-1 min-h-0 max-h-full overflow-auto items-start"
      >
        <LandscapeOrResourceItem
          v-for="(item, index) in currentDataSet"
          class="pl-[1.25rem]"
          :class="index !== 0 && 'mt-3'"
          :key="item.name"
          :item="item"
          :tab="activeTab"
        />
      </div>
    </div>
  </div>
</template>

<script>
import GridSettingsItem from './GridSettingsItem'
import LandscapeOrResourceItem from './LandscapeOrResourceItem'
import { scrollToCenter } from '@/helpers/scroll.js'

export default {
  name: 'BoardAndTiles',
  components: {
    GridSettingsItem,
    LandscapeOrResourceItem,
  },
  data() {
    return {
      activeTab: 'landscapes',
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
  computed: {
    currentDataSet() {
      return this.$store.state[this.activeTab].data
    },
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
    switchTab(e, tabName) {
      this.activeTab = tabName
      e.currentTarget.blur()
    },
  },
}
</script>

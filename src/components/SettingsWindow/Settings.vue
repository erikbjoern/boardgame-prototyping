<template>
  <div
    :class="
      `h-[80vh] rounded overflow-hidden bg-black bg-opacity-95 
      fixed right-0 mr-12 top-1/2 transform -translate-y-1/2 z-[1100] flex flex-col`
    "
  >
    <div class="flex border-b-2 border-black mx-px h-10">
      <button
        class="flex-1 hover:bg-black bg-opacity-100 hover:!opacity-100 border-b-2"
        :class="
          activeTab == tab.name
            ? 'border-green-500 text-white'
            : 'border-transparent text-gray-500 hover:!text-gray-400'
        "
        v-for="tab in tabs"
        :key="tab.name"
        @click="e => selectTab(e, tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div
      class="shadow-inner border-black border-[10px] py-8 flex-1"
      :style="{ height: 'calc(100vh - 200px)', maxHeight: '80vh', minWidth: '40rem' }"
    >
      <ResourceSettings v-if="activeTab == 'landscapesAndResources'" />
      <GridSettings v-if="activeTab == 'boardAndTiles'" />
      <SettingsActions v-if="activeTab == 'other'" @close="$emit('close')" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ResourceSettings from './ResourceSettings'
import GridSettings from './GridSettings'
import SettingsActions from './SettingsActions'

import { scrollToCenter } from '@/helpers/scroll'
export default {
  name: 'Menu',
  components: {
    ResourceSettings,
    GridSettings,
    SettingsActions,
  },
  data() {
    return {
      tabs: [
        {
          name: 'landscapesAndResources',
          label: 'Landskap & Resurser',
        },
        {
          name: 'boardAndTiles',
          label: 'Bräde & Brickor',
        },
        {
          name: 'other',
          label: 'Övrigt',
        },
      ],
      activeTab: 'landscapesAndResources',
    }
  },
  methods: {
    scrollToCenter,
    center(e) {
      this.scrollToCenter()
      e.target.blur()
    },
    showResourceInputs() {
      this.resourceSettingsIsOpen = true
    },
    hideResourceInputs(e) {
      this.resourceSettingsIsOpen = false
      e.target.blur()
    },
    reset(e) {
      this.$store.dispatch(e.target.value)
    },
    selectTab(e, name) {
      this.activeTab = name
      e.currentTarget.blur()
    },
  },
}
</script>

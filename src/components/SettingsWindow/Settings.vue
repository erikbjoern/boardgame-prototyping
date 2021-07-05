<template>
  <div
    :class="
      `h-[80vh] rounded overflow-hidden bg-black bg-opacity-95 
      fixed right-0 mr-12 top-1/2 transform -translate-y-1/2 z-[1100] flex`
    "
    v-click-outside="onClickOutside"
  >
    <div class="h-full flex flex-col">
      <div
        class="h-10 w-full flex items-center justify-center text-white text-opacity-30 tracking-wide font-semibold"
      >
        Inställningar
      </div>
      <div class="p-2 space-y-3 border-[10px] border-r-0 border-black flex-1 min-h-0">
        <button class="btn w-full rounded-full" @click="generateNewResourceValues">
          Generera nya resursvärden
        </button>
        <button class="btn w-full rounded-full" @click="generateNewTiles">
          Generera nytt bräde
        </button>
        <button class="btn w-full rounded-full" @click="saveSettings">
          Spara
        </button>
        <button class="btn w-full rounded-full" @click="loadSettings">
          Ladda
        </button>
      </div>
    </div>
    <div class="flex flex-col">
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
        <LandscapesAndResources v-if="activeTab == 'landscapesAndResources'" />
        <BoardAndTiles v-if="activeTab == 'boardAndTiles'" />
      </div>
    </div>
  </div>
</template>

<script>
import LandscapesAndResources from './LandscapesAndResources'
import BoardAndTiles from './BoardAndTiles'
import vClickOutside from 'v-click-outside'
import EventBus from '@/eventBus'
import localForage from 'localforage'
import { scrollToCenter } from '@/helpers/scroll.js'

export default {
  name: 'Menu',
  components: {
    LandscapesAndResources,
    BoardAndTiles,
  },
  directives: {
    clickOutside: vClickOutside.directive,
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
      ],
      activeTab: 'landscapesAndResources',
    }
  },
  methods: {
    selectTab(e, name) {
      this.activeTab = name
      e.currentTarget.blur()
    },
    onClickOutside() {
      if (!document.documentElement.classList.contains('swal2-shown')) this.$emit('close')
    },
    generateNewResourceValues() {
      EventBus.$emit('reassignResources')
    },
    generateNewTiles() {
      this.$store.dispatch('generateNewTiles')
      scrollToCenter()
    },
    async saveSettings() {
      const dialog = await this.$swal({
        title: 'Spara nuvarande inställningar',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
        },
        inputPlaceholder: 'Ny inställningsprofil',
        showCancelButton: true,
        confirmButtonText: 'Spara',
        cancelButtonText: 'Avbryt',
        showLoaderOnConfirm: true,
        allowOutsideClick: true,
        preConfirm: () => {},
      })

      if (dialog.isConfirmed) {
        const saveFileName = dialog.value || 'Ny inställningsprofil'
        this.$store.dispatch('saveSettings', saveFileName)
      }
    },
    async loadSettings() {
      const savedSettingsMeta = await localForage.getItem('savedSettingsMeta')
      const inputOptions = Object.assign(
        ...savedSettingsMeta
          .sort((a, b) => a.date - b.date)
          .map(m => ({ [m.id]: `${m.name} (${m.date.toString().slice(0, 15)})` }))
      )

      const dialog = await this.$swal({
        title: 'Ladda sparade inställningar',
        input: 'select',
        inputOptions,
        inputPlaceholder: 'Välj inställning',
        showCancelButton: true,
        confirmButtonText: 'Ladda',
        cancelButtonText: 'Avbryt',
        showLoaderOnConfirm: true,
        allowOutsideClick: true,
        inputValidator: value => {
          return new Promise(resolve => {
            if (!!value) {
              resolve()
            } else {
              resolve('Du har inte valt någon sparad inställning')
            }
          })
        },
      })

      if (dialog.isConfirmed) {
        const saveFileId = dialog.value

        this.$store.dispatch('loadSettings', saveFileId)
      }
    },
  },
}
</script>

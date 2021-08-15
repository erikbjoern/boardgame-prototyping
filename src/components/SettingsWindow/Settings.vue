<template>
  <div
    class="h-[80vh] rounded overflow-hidden bg-black bg-opacity-95 fixed 
           right-0 mr-12 top-1/2 transform -translate-y-1/2 z-[1100] flex flex-col"
    v-click-outside="onClickOutside"
  >
    <div class="flex">
      <div
        class="h-10 w-64 flex items-center justify-center text-white text-opacity-30 tracking-wide font-semibold"
      >
        Inställningar
      </div>

      <div class="flex border-b-2 border-black mx-px px-2 h-10 flex-1">
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
    </div>
    <div class="flex flex-1 min-h-0">
      <div
        class="p-2 space-y-3 border-[10px] border-r-0 border-b-0 border-black flex-1 min-h-0 flex flex-col w-64"
      >
        <button class="btn w-full rounded-full" @click="generateNewResourceValues">
          Generera nya resursvärden
        </button>
        <button
          class="btn w-full rounded-full"
          :class="activeTab == 'newBoard' && 'highlighted'"
          @click="generateNewTiles"
          :disabled="$store.state.landscapes.data.length == 0"
        >
          Generera nytt bräde
        </button>
        <button class="btn w-full rounded-full" @click="saveSettings">
          Spara
        </button>
        <button class="btn w-full rounded-full" @click="loadSettings">
          Ladda
        </button>
        <button
          class="btn w-full !mt-auto"
          :class="$store.state.preferences.showResourceValues && 'btn-active'"
          @click="e => toggleVisibility(e, 'ResourceValues')"
        >
          {{ $store.state.preferences.showResourceValues ? 'Visar' : 'Visa' }}
          resursvärden
        </button>
        <button
          class="btn w-full"
          :class="$store.state.preferences.showOverview && 'btn-active'"
          @click="e => toggleVisibility(e, 'Overview')"
        >
          {{ $store.state.preferences.showOverview ? 'Visar' : 'Visa' }} översikt
        </button>
        <button
          :class="$store.state.preferences.showSummary ? 'btn w-full btn-active' : 'btn'"
          @click="e => toggleVisibility(e, 'Summary')"
        >
          {{ $store.state.preferences.showSummary ? 'Visar' : 'Visa' }} summering
        </button>
      </div>
      <div
        class="shadow-inner border-black border-[10px] border-b-0 py-8 flex-1"
        :style="{ height: 'calc(100vh - 200px)', maxHeight: '80vh', minWidth: '40rem' }"
      >
        <NewBoard v-show="activeTab == 'newBoard'" />
        <AdjustBoard v-show="activeTab == 'adjustBoard'" />
      </div>
    </div>
    <div
      class="bg-black w-full h-8 flex-none pl-[0.6rem] text-white text-xs flex items-center"
    >
      <label>Firestore ID:</label>
      <input
        type="text"
        class="ml-2 px-1 w-[11rem] bg-transparent border border-gray-700 rounded-sm"
        :value="$store.state.firestoreId"
        @keydown.enter="rebindStore"
        @keydown.esc="e => e.target.blur()"
        @blur="e => (e.target.value = $store.state.firestoreId)"
      />
    </div>
  </div>
</template>

<script>
import NewBoard from './NewBoard'
import AdjustBoard from './AdjustBoard'
import vClickOutside from 'v-click-outside'
import EventBus from '@/eventBus'
import db from '@/db'
import { scrollToCenter } from '@/helpers/scroll.js'

export default {
  name: 'Menu',
  components: {
    NewBoard,
    AdjustBoard,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data() {
    return {
      tabs: [
        {
          name: 'newBoard',
          label: 'Nytt Bräde',
        },
        {
          name: 'adjustBoard',
          label: 'Justera Bräde',
        },
      ],
      activeTab: 'newBoard',
    }
  },
  methods: {
    rebindStore(e) {
      const firestoreId = e.target.value

      this.$store.commit('setFirestoreId', firestoreId)
      this.$store.dispatch('bindStore', firestoreId)
      e.target.blur()
    },
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
    toggleVisibility(e, item) {
      this.$store.commit('toggleVisibility', item)
      e.target.blur()
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
      const savedStateMetaDocs = await db.collection('savedStateMeta').get()
      const savedStateMeta = savedStateMetaDocs.docs.map(d => d.data())

      if (!savedStateMeta?.length) {
        await this.$swal({
          text: 'Inga sparade inställningar att ladda',
          showCancelButton: false,
          confirmButtonText: 'OK',
          allowOutsideClick: true,
        })

        return
      }

      const inputOptions = Object.assign(
        ...savedStateMeta
          .sort((a, b) => a.date - b.date)
          .map(m => ({
            [m.id]: `${m.name} (${new Date(m.date?.seconds * 1000)
              ?.toString()
              .slice(0, 15)})`,
          }))
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

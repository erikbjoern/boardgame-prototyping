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
        <button class="btn w-full rounded-full" @click="saveState">
          Spara
        </button>
        <button class="btn w-full rounded-full" @click="loadState">
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
      class="bg-black w-full h-8 flex-none px-[0.6rem] text-white text-xs flex items-center"
    >
      <label class="flex-none">Firestore ID:</label>
      <input
        type="text"
        class="ml-2 px-1 w-[11rem] flex-none bg-transparent border border-gray-700 rounded-sm font-mono"
        :value="$store.state.firestoreId"
        @keydown.enter="rebindStore"
        @keydown.esc="e => e.target.blur()"
        @blur="e => (e.target.value = $store.state.firestoreId)"
      />
      <div class="flex space-x-3 ml-3 text-gray-500 w-full">
        <span v-if="$store.state.previousFirestoreIds.length">Tidigare ID:n</span>
        <span class="font-mono select-text">
          {{ $store.state.previousFirestoreIds.join(', ') }}
        </span>
        <button
          class="py-0 border rounded px-1 inline-block !ml-auto"
          @click="bindStoreToNewConnection"
        >
          Ny databasanslutning
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NewBoard from './NewBoard'
import AdjustBoard from './AdjustBoard'
import vClickOutside from 'v-click-outside'
import EventBus from '@/eventBus'
import db from '@/db'
import cuid from 'cuid'
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
    async rebindStore(e) {
      const firestoreId = e.target.value

      if (
        (firestoreId.length == 25 && firestoreId[0] == 'c') ||
        firestoreId == 'TheGlobalRoom'
      ) {
        await this.$store.dispatch('setFirestoreId', firestoreId)
        this.$store.dispatch('bindStore')
      } else {
        e.target.value = this.$store.state.firestoreId
      }

      e.target.blur()
    },
    async bindStoreToNewConnection() {
      const newFirestoreId = cuid()

      this.$store.commit('useInitialState', true)
      await this.$store.dispatch('setFirestoreId', newFirestoreId)
      this.$store.dispatch('bindStore')
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
    async saveState() {
      const dialog = await this.$swal({
        title: 'Spara nuvarande session',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
        },
        inputPlaceholder: 'Ny session',
        showCancelButton: true,
        confirmButtonText: 'Spara',
        cancelButtonText: 'Avbryt',
        showLoaderOnConfirm: true,
        allowOutsideClick: true,
        preConfirm: () => {},
      })

      if (dialog.isConfirmed) {
        const saveFileName = dialog.value || 'Ny session'
        this.$store.dispatch('saveState', saveFileName)
      }
    },
    async loadState() {
      const savedStateMetaDocs = await db.collection(`GlobalSaveFilesMeta`).get()
      const savedStateMeta = savedStateMetaDocs.docs.map(d => d.data())

      if (!savedStateMeta?.length) {
        await this.$swal({
          text: 'Inga sparade sessioner att ladda',
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
            [`${m.roomId}-${m.fileId}`]: `${m.name} (${new Date(m.date?.seconds * 1000)
              ?.toString()
              .slice(0, 21)})`,
          }))
      )

      const dialog = await this.$swal({
        title: 'Ladda sparade sessioner',
        input: 'select',
        inputOptions,
        inputPlaceholder: 'Välj session',
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
              resolve('Du har inte valt någon sparad session')
            }
          })
        },
      })

      if (dialog.isConfirmed) {
        const [roomId, fileId] = dialog.value.split('-')
        let stayOnThisConnection = false

        if (roomId !== this.$store.state.firestoreId) {
          const stayOnThisConnectionDialog = await this.$swal({
            title: 'Vill du ladda in datan på nuvarande databasuppkoppling?',
            text: 'Din nuvarande session auto-sparas på denna uppkoppling',
            showDenyButton: true,
            confirmButtonText: 'Ja - stanna',
            denyButtonText: 'Nej - gå till sparad uppkoppling',
            allowOutsideClick: false,
          })

          stayOnThisConnection = stayOnThisConnectionDialog.isConfirmed
        }

        this.$store.dispatch('loadState', { roomId, fileId, stayOnThisConnection })
      }
    },
  },
}
</script>

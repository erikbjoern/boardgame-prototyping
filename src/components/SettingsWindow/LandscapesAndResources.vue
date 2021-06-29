<template>
  <div class="relative rounded flex h-full items-stretch" id="resource-settings">
    <div class="flex-1">
      <div class="h-full flex flex-col space-y-3 w-36 mx-auto pt-[3.5rem]">
        <button
          class="!bg-[#197c4a] text-[#eaffea] !rounded-full flex px-3"
          @click="addNew('addLandscape', 'landscapes')"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="15"
            width="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"
              fill="#fff"
            ></path>
          </svg>
          <span class="inline-block flex-1 text-left ml-1">
            Nytt landskap
          </span>
        </button>
        <button
          class="!bg-[#197c4a] text-[#eaffea] !rounded-full flex px-3"
          @click="addNew('addResource', 'resources')"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="15"
            width="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"
              fill="#fff"
            ></path>
          </svg>
          <span class="inline-block flex-1 text-left ml-1">
            Ny resurs
          </span>
        </button>
        <button
          class="text-[#eaffea] !rounded-full flex px-3 bg-yellow-600"
          @click="
            e => {
              resetState()
              e.currentTarget.blur()
            }
          "
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="15"
            width="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M12.2071 2.29289C12.5976 2.68342 12.5976 3.31658 12.2071 3.70711L10.9142 5H12.5C17.1523 5 21 8.84772 21 13.5C21 18.1523 17.1523 22 12.5 22C7.84772 22 4 18.1523 4 13.5C4 12.9477 4.44772 12.5 5 12.5C5.55228 12.5 6 12.9477 6 13.5C6 17.0477 8.95228 20 12.5 20C16.0477 20 19 17.0477 19 13.5C19 9.95228 16.0477 7 12.5 7H10.9142L12.2071 8.29289C12.5976 8.68342 12.5976 9.31658 12.2071 9.70711C11.8166 10.0976 11.1834 10.0976 10.7929 9.70711L7.79289 6.70711C7.40237 6.31658 7.40237 5.68342 7.79289 5.29289L10.7929 2.29289C11.1834 1.90237 11.8166 1.90237 12.2071 2.29289Z"
              fill="#fff"
            ></path>
          </svg>
          <span class="ml-1">Återställ</span>
        </button>
        <button
          class="text-[#eaffea] !rounded-full flex px-3"
          :class="removalMode ? '!bg-[#369]' : '!bg-[#901312]'"
          @click="
            e => {
              removalMode = !removalMode
              e.currentTarget.blur()
            }
          "
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="15"
            width="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              v-if="!removalMode"
              xmlns="http://www.w3.org/2000/svg"
              d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
              fill="#fff"
            ></path>
            <path
              v-else
              xmlns="http://www.w3.org/2000/svg"
              d="M20.6644 5.2526C21.0772 5.61952 21.1143 6.25159 20.7474 6.66437L10.0808 18.6644C9.89099 18.8779 9.61898 19 9.33334 19C9.04771 19 8.7757 18.8779 8.58593 18.6644L3.2526 12.6644C2.88568 12.2516 2.92286 11.6195 3.33565 11.2526C3.74843 10.8857 4.3805 10.9229 4.74742 11.3356L9.33334 16.4948L19.2526 5.33565C19.6195 4.92286 20.2516 4.88568 20.6644 5.2526Z"
              fill="#fff"
            ></path>
          </svg>
          <span class="inline-block flex-1 text-left ml-1">
            {{ removalMode ? 'Klar' : 'Ta bort...' }}
          </span>
        </button>
        <button
          class="h-8 border rounded  text-sm tracking-wide bg-black !mt-auto"
          :class="
            $store.state.preferences.showOverview
              ? '!border-green-500 text-green-200'
              : 'border-gray-300 text-gray-300 !bg-opacity-10'
          "
          @click="e => toggleVisibility(e, 'Overview')"
        >
          {{ $store.state.preferences.showOverview ? 'Visar' : 'Visa' }} översikt
        </button>
        <button
          class="h-8 border rounded  text-sm tracking-wide bg-black"
          :class="
            $store.state.preferences.showSummary
              ? '!border-green-500 text-green-200'
              : 'border-gray-300 text-gray-300 !bg-opacity-10'
          "
          @click="e => toggleVisibility(e, 'Summary')"
        >
          {{ $store.state.preferences.showSummary ? 'Visar' : 'Visa' }} summering
        </button>
      </div>
    </div>
    <div class="flex flex-col items-center space-y-6 flex-1 min-h-0">
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
              tab == tabName
                ? '!bg-opacity-100 text-[#eeeeee] border-green-500 border hover:!bg-opacity-100'
                : '!bg-opacity-10 text-[#9f9f9f]',
              tabName == 'landscapes' ? 'rounded-tl rounded-bl' : 'rounded-tr rounded-br',
              tab == 'landscapes' && index == 1 && 'border-l-0',
              tab == 'resources' && index == 0 && 'border-r-0',
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
        <transition-group
          name="fade"
          mode="out-in"
          :duration="{ enter: 500, leave: 0 }"
          :key="renderKey"
        >
          <LandscapeOrResourceItem
            v-for="(item, index) in currentDataSet"
            class="pl-[1.25rem]"
            :class="index !== 0 && 'mt-3'"
            :key="item.name"
            :item="item"
            :tab="tab"
            :focusAddedItem="focusAddedItem"
            @didFocusAddedItem="focusAddedItem = false"
            :removalMode="removalMode"
          />
        </transition-group>
      </div>
      <transition name="height" mode="out-in">
        <div v-if="removalMode" class="!m-0">
          <button
            class="text-[#eaffea] !rounded-full flex px-3 !bg-[#901312] my-6"
            @click="removeAll"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="15"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                fill="#fff"
              ></path>
            </svg>
            <span class="inline-block flex-1 text-left ml-1">
              Ta bort alla
            </span>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import LandscapeOrResourceItem from './LandscapeOrResourceItem'

export default {
  name: 'LandscapesAndResources',
  components: {
    LandscapeOrResourceItem,
  },
  data() {
    return {
      tab: 'landscapes',
      focusAddedItem: false,
      removalMode: false,
      renderKey: 0,
    }
  },
  computed: {
    currentDataSet() {
      return this.$store.state[this.tab].data
    },
  },
  methods: {
    toggleVisibility(e, item) {
      this.$store.commit('toggleVisibility', item)
      e.target.blur()
    },
    switchTab(e, tabName) {
      this.tab = tabName
      e?.currentTarget.blur()
      this.renderKey++
    },
    addNew(mutation, tabName) {
      this.$store.commit(mutation)

      if (tabName !== this.tab) {
        this.focusAddedItem = true
        this.switchTab(undefined, tabName)
      }
    },
    resetState() {
      const action = this.tab == 'landscapes' ? 'resetLandscapes' : 'resetResources'
      this.$store.dispatch(action)
      this.renderKey++
    },
    async removeAll() {
      const action =
        this.tab == 'landscapes' ? 'removeAllLandscapes' : 'removeAllResources'
      this.$store.dispatch(action)
    },
  },
}
</script>

<style>
.height-enter-active,
.height-leave-active {
  transition: max-height 0.3s;
  max-height: 5rem !important;
  overflow: hidden;
}

.height-enter,
.height-leave-to {
  max-height: 0 !important;
}
</style>

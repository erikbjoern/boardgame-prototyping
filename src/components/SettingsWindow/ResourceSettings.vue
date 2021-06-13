<template>
  <div class="relative rounded flex h-full items-stretch" id="resource-settings">
    <div class="flex-1">
      <div class="h-full flex flex-col space-y-6 w-36 mx-auto">
        <button
          class="h-8 border rounded !font-thin text-sm tracking-wide bg-black"
          :class="
            $store.state.showOverview
              ? '!border-green-500 text-green-200'
              : 'border-gray-300 text-gray-300 !bg-opacity-10'
          "
          @click="toggleOverviewVisibility"
        >
          {{ $store.state.showOverview ? 'Visar' : 'Visa' }} översikt
        </button>
        <div class="w-full flex flex-col space-y-3">
          <button
            class="!bg-[#197c4a] text-[#eaffea] !rounded-full flex px-3"
            @click="addNew('addLandscape', 'LANDSCAPES')"
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
            @click="addNew('addResource', 'RESOURCES')"
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
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center space-y-6 flex-1 min-h-0">
      <div class="h-8 w-full flex items-center px-[1.25rem]">
        <div class="flex w-full rounded overflow-hidden">
          <button
            v-for="([tabName, label], index) in [
              ['LANDSCAPES', 'Landskap'],
              ['RESOURCES', 'Resurser'],
            ]"
            :key="label"
            class="flex-1 bg-black border h-8"
            :class="[
              tab == tabName
                ? '!bg-opacity-100 text-[#eeeeee] border-green-500 border hover:!bg-opacity-100'
                : '!bg-opacity-10 text-[#9f9f9f]',
              tabName == 'LANDSCAPES' ? 'rounded-tl rounded-bl' : 'rounded-tr rounded-br',
              tab == 'LANDSCAPES' && index == 1 && 'border-l-0',
              tab == 'RESOURCES' && index == 0 && 'border-r-0',
            ]"
            @click="e => switchTab(e, tabName)"
          >
            <span class="relative inlinbe-block bottom-px">{{ label }}</span>
          </button>
        </div>
      </div>
      <div
        class="w-full flex flex-col space-y-3 flex-1 min-h-0 max-h-full overflow-auto items-start"
      >
        <ResourceSettingsItem
          class="pl-[1.25rem]"
          v-for="(landscape, index) in tab == 'LANDSCAPES'
            ? landscapeParameters
            : resourceParameters"
          :key="landscape.name + '' + index"
          :item="landscape"
          :tab="tab"
          :focusAddedItem="focusAddedItem"
          @didFocusAddedItem="focusAddedItem = false"
          :removalMode="removalMode"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ResourceSettingsItem from './ResourceSettingsItem'

export default {
  name: 'ResourceSettings',
  components: {
    ResourceSettingsItem,
  },
  data() {
    return {
      tab: 'LANDSCAPES',
      focusAddedItem: false,
      removalMode: false,
    }
  },
  computed: mapState({
    landscapeParameters: state => state.landscapes.data,
    resourceParameters: state => state.resources.data,
  }),
  methods: {
    toggleOverviewVisibility(e) {
      this.$store.commit('toggleOverviewVisibility')
      e.target.blur()
    },
    switchTab(e, tabName) {
      this.tab = tabName
      e?.currentTarget.blur()
    },
    addNew(mutation, tabName) {
      this.$store.commit(mutation)
      this.switchTab(undefined, tabName)
      this.focusAddedItem = true
    },
  },
}
</script>

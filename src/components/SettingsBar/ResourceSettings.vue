<template>
  <div
    class="rounded bg-[#000000ef] py-6 pl-8 pr-[0.75rem] flex space-x-6"
    :style="{ maxHeight: 'calc(100vh - 200px)' }"
  >
    <div class="flex flex-col w-36 space-y-4">
      <label class="flex items-center space-x-2 h-8">
        <input
          type="checkbox"
          :checked="$store.state.grid.visibleResourceValues"
          @click="toggleResourceValuesVisibility"
        />
        <span class="text-white text-sm font-sans font-light">Synliga resursvärden</span>
      </label>
      <button
        class="!bg-[#669922] text-[#eaffea] !rounded-full flex px-4"
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
        <span class="inline-block flex-1 text-center">
          Nytt landskap
        </span>
      </button>
      <button
        class="!bg-[#669922] text-[#eaffea] !rounded-full flex px-4"
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
        <span class="inline-block flex-1 text-center">
          Ny resurs
        </span>
      </button>
    </div>
    <div class="flex flex-col items-center space-y-4 w-72 h-full">
      <div class="h-8 w-full flex items-center pr-[1.25rem]">
        <div class="flex w-full rounded overflow-hidden">
          <button
            class="block h-full flex-1 !rounded-none"
            :class="
              tab == 'LANDSCAPES'
                ? '!bg-[#707070] text-[#eeeeee]'
                : '!bg-[#333333] text-[#9f9f9f]'
            "
            @click="e => switchTab(e, 'LANDSCAPES')"
          >
            Landskap
          </button>
          <button
            class="block h-full flex-1 !rounded-none"
            :class="
              tab == 'RESOURCES'
                ? '!bg-[#777777] text-[#eeeeee]'
                : '!bg-[#333333] text-[#9f9f9f]'
            "
            @click="e => switchTab(e, 'RESOURCES')"
          >
            Resurser
          </button>
        </div>
      </div>
      <div class="flex flex-col space-y-4 w-full max-h-[400px] overflow-auto items-start">
        <ResourceSettingsDropdownItem
          class="w-[16.75rem]"
          v-for="(landscape, index) in tab == 'LANDSCAPES'
            ? landscapeParameters
            : resourceParameters"
          :key="landscape.name + '' + index"
          :item="landscape"
          :tab="tab"
          :focusAddedItem="focusAddedItem"
          @didFocusAddedItem="focusAddedItem = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ResourceSettingsDropdownItem from './ResourceSettingsDropdownItem'

export default {
  name: 'ResourceSettings',
  components: {
    ResourceSettingsDropdownItem,
  },
  data() {
    return {
      tab: 'LANDSCAPES',
      focusAddedItem: false
    }
  },
  computed: mapState({
    landscapeParameters: state => state.landscapes.data,
    resourceParameters: state => state.resources.data,
  }),
  methods: {
    toggleResourceValuesVisibility() {
      this.$store.commit('toggleResourceValuesVisibility')
    },
    switchTab(e, tabName) {
      this.tab = tabName
      e?.target.blur()
    },
    addNew(mutation, tabName) {
      this.$store.commit(mutation)
      this.switchTab(undefined, tabName)
      this.focusAddedItem = true
    }
  },
}
</script>

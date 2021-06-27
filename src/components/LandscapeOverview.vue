<template>
  <div
    class="max-h-[80vh] fixed left-2 top-5 z-[1000] p-2 pl-2 bg-[#efefef] bg-opacity-20 rounded overflow-hidden"
    style="direction: rtl"
    v-if="$store.state.initialised"
  >
    <div
      class="overflow-auto pl-2"
      style="max-width: 13rem; max-height: calc(80vh - 1rem)"
      :class="expandedLandscapes.length <= 2 ? 'w-[max-content]' : 'w-[min-content]'"
    >
      <div class="flex flex-col">
        <transition-group name="fade" mode="out-in">
          <div
            v-for="(landscape, index) in landscapes"
            :key="landscape.name"
            class="rounded-sm p-2 pt-1 shadow cursor-pointer flex gap-1 justify-end"
            :class="[
              isExpanded(landscape.name)
                ? 'flex-col items-start'
                : 'flex-wrap items-center',
              index !== 0 && 'mt-2',
            ]"
            :style="{
              backgroundColor: landscape.color,
              color: landscape.invertedColor,
              direction: 'ltr',
            }"
            @click="toggleExpanded(landscape.name)"
          >
            <div
              class="flex justify-between items-baseline pb-1 flex-1"
              :class="isExpanded(landscape.name) && 'w-full'"
            >
              <p class="font-bold truncate">
                {{ landscape.name }}
              </p>
              <span v-if="isExpanded(landscape.name)">
                <span
                  class="text-sm font-mono px-[3px]"
                  v-text="
                    $store.state.board.tileRows
                      .flat()
                      .filter(tile => tile.landscapeType == landscape.name).length
                  "
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  class="fill-current inline"
                >
                  <path
                    d="M16.839 4l4.857 8.5-4.857 8.5h-9.678l-4.857-8.5 4.857-8.5h9.678zm1.161-2h-12l-6 10.5 6 10.5h12l6-10.5-6-10.5z"
                  />
                </svg>
              </span>
            </div>
            <div
              v-for="resource in landscape.resources.filter(v => !!v.name)"
              :key="resource.name"
              class="rounded px-2 flex justify-between font-mono space-x-6"
              :class="isExpanded(landscape.name) && 'w-full'"
              :style="{
                backgroundColor: $store.getters.resourceColors[resource.name],
                color: $store.getters.invertedResourceColors[resource.name],
              }"
            >
              <p v-if="isExpanded(landscape.name)" class="font-semibold truncate">
                {{ resource.name }}
              </p>
              <span class="whitespace-nowrap">
                {{ resource.min
                }}{{ resource.min !== resource.max ? `-${resource.max}` : '' }}
              </span>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { getInvertedHexcolorGrayscale } from '@/helpers/getDynamicColor.js'

export default {
  name: 'LandscapeOverview',
  data() {
    return {
      expandedLandscapes: [],
    }
  },
  computed: {
    landscapes() {
      return this.$store.state.landscapes.data
    },
  },
  methods: {
    getInvertedHexcolorGrayscale,
    isExpanded(landscapeName) {
      return this.expandedLandscapes.includes(landscapeName)
    },
    toggleExpanded(landscapeName) {
      const index = this.expandedLandscapes.findIndex(name => name == landscapeName)
      if (index == -1) {
        this.expandedLandscapes.push(landscapeName)
      } else {
        this.expandedLandscapes.splice(index, 1)
      }
    },
  },
  mounted() {
    const totalNumberOfResourcesOnLandscapes = this.landscapes
      .map(l => l.resources)
      .flat().length

    if (this.landscapes.length * 2 + totalNumberOfResourcesOnLandscapes < 20) {
      this.expandedLandscapes.push(...this.landscapes.map(l => l.name))
    }
  },
}
</script>

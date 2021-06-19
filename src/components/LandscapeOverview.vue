<template>
  <div
    class="max-h-[80vh] fixed left-2 top-1/2 transform -translate-y-1/2 z-[1000] p-2 pl-2 bg-[#efefef] bg-opacity-20 rounded overflow-hidden"
    style="direction: rtl"
  >
    <div class="overflow-auto pl-2" style="width: 13rem; max-height: calc(80vh - 1rem)">
      <div class="flex flex-col space-y-2">
        <div
          v-for="landscape in landscapes"
          :key="landscape.name"
          class="rounded-sm p-2 pt-1 shadow cursor-pointer flex flex-wrap gap-1 items-center justify-end"
          :style="{
            backgroundColor: landscape.color,
            color: landscape.invertedColor,
            direction: 'ltr',
          }"
          @click="toggleExpanded(landscape.name)"
        >
          <div class="flex justify-between items-baseline pb-1 flex-1">
            <p class="font-bold truncate">
              {{ landscape.name }}
            </p>
            <p v-if="isExpanded(landscape.name)" class="text-sm font-mono">
              {{
                $store.state.board.tileRows
                  .flat()
                  .filter(tile => tile.landscapeType == landscape.name).length
              }}st
            </p>
          </div>
          <div
            v-for="resource in landscape.resources"
            :key="resource.name"
            class="rounded px-2 flex justify-between font-mono"
            :class="isExpanded(landscape.name) && 'w-full'"
            :style="{
              backgroundColor: $store.getters.resourceColors[resource.name],
              color: $store.getters.invertedResourceColors[resource.name],
            }"
          >
            <p v-if="isExpanded(landscape.name)" class="font-semibold">
              {{ resource.name }}
            </p>
            <span class="whitespace-nowrap">
              {{ resource.min
              }}{{ resource.min !== resource.max ? `-${resource.max}` : '' }}
            </span>
          </div>
        </div>
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

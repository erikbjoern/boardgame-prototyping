<template>
  <div
    class="rounded-sm opacity-[0.99] p-1 transition-all w-48 h-96 fixed left-2 top-1/2 transform -translate-y-1/2 z-[1000] flex flex-col"
  >
    <div class="flex flex-col space-y-2">
      <div
        v-for="landscape in $store.state.landscapes.data"
        :key="landscape.name"
        class="rounded-sm p-2 pt-1 shadow"
        :style="{
          backgroundColor: landscape.color,
          color: landscape.invertedColor,
        }"
      >
        <div class="flex justify-between items-baseline pb-1">
          <p class="font-bold truncate">{{ landscape.name }}</p>
          <p class="text-sm font-mono">
            {{
              $store.state.grid.hexRows
                .flat()
                .filter(tile => tile.landscapeType == landscape.name).length
            }}st
          </p>
        </div>
        <div class="flex flex-col space-y-1">
          <div
            v-for="resource in landscape.resources"
            :key="resource.name"
            class="rounded px-2 flex justify-between font-mono"
            :style="{
              backgroundColor: $store.getters.invertedResourceColors[resource.name],
              color: $store.getters.resourceColors[resource.name],
            }"
          >
            <p class="font-semibold">{{ resource.name }}</p>
            <p>
              {{
                resource.min == resource.max
                  ? resource.min
                  : `${resource.min}-${resource.max}`
              }}
            </p>
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
  methods: {
    getInvertedHexcolorGrayscale,
  },
}
</script>

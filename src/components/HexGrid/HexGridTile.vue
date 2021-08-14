<template>
  <div
    class="h-full relative drop-shadow-lg"
    :style="{ zIndex: tile.number }"
    @click="toggleTileSelection(tile)"
  >
    <div
      class="h-full w-full grid place-items-center clip-hexagon"
      :class="isSelected ? 'bg-green-500' : 'bg-white'"
      :style="`margin: -${borderWidth}`"
    >
      <div
        class="flex flex-col items-center clip-hexagon overflow-hidden"
        :style="{ ...tileContentStyle }"
      >
        <span
          :style="{
            color: `${landscapeColors.grayscale}77`,
            fontSize: `0.4rem`,
          }"
          :class="scale < 1.125 && 'opacity-0'"
        >
          {{ tile.number }}
        </span>
        <transition name="fade" mode="out-in">
          <div
            v-show="$store.state.preferences.showResourceValues"
            class="grid gap-[2px] grid-flow-row grid-cols-2 w-2/3 py-px px-1"
            :style="{ fontSize: `clamp(0.2rem, ${0.8 - scale / 6}rem, 0.7rem)` }"
          >
            <div
              v-for="resource in resources"
              :key="resource.name"
              class="flex items-center justify-evenly shadow rounded text-center py-px"
              :style="{
                backgroundColor: resourceColors[resource.name].main,
                color: resourceColors[resource.name].grayscale,
              }"
            >
              <input
                class="w-full bg-transparent text-center"
                :value="resource.amount"
                @change="e => updateResource(e, resource)"
                v-show="$store.state.keysPressed.length == 0"
              />
              <span v-show="$store.state.keysPressed.length > 0" class="mx-auto">
                {{ resource.amount }}
              </span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getInvertedHexcolorGrayscale } from '@/helpers/getDynamicColor.js'

export default {
  name: 'HexGridTile',
  props: {
    tile: {
      number: {
        type: Number,
        required: true,
      },
      landscapeType: {
        type: String,
        required: true,
      },
      resources: {
        type: Array,
        validator(value) {
          value.every(r => r.hasOwnProperty('name') && r.hasOwnProperty('amount'))
        },
      },
      required: true,
    },
  },
  computed: {
    ...mapState({
      borderWidth: state => state.grid.tileBorderWidth,
      viewportWidth: state => state.viewportWidth,
      scale: state => state.grid.scale,
      selectedTiles: state => state.board.selectedTiles,
      resourceColors: state => state.board.colors.resources,
      landscapeColors(state) {
        return state.board.colors.landscapes[this.tile.landscapeType]
      },
    }),
    tileContentStyle() {
      return {
        display: 'flex',
        gap: `${1 / 50}vw`,
        backgroundColor: this.landscapeColors.main,
        fontSize: `clamp(8px, ${1 / 10}vw, 20px`,
        height: `${100 - this.borderWidth}%`,
        width: `${100 - this.borderWidth}%`,
      }
    },
    isSelected() {
      return this.selectedTiles.includes(this.tile.id)
    },
    resources() {
      return this.tile.resources
        ?.filter(r => r.amount > 0)
        .sort((a, b) => b.amount - a.amount)
    },
  },
  methods: {
    getInvertedHexcolorGrayscale,
    toggleTileSelection(tile) {
      if (!this.$store.state.keysPressed.includes(17)) return

      const foundIndex = this.selectedTiles.indexOf(tile.id)

      if (foundIndex !== -1) {
        this.$store.commit('removeTileFromSelection', foundIndex)
      } else {
        this.$store.commit('addTileToSelection', tile.id)
      }
    },
    updateResource(e, resource) {
      const tile = (({ rowIndex, index }) => ({ rowIndex, index }))(this.tile)
      const value = parseInt(e.target.value)

      this.$store.commit('setResourceValueOnTile', { tile, resource, value })
    },
  },
}
</script>

<template>
  <div
    class="hex-grid__item"
    :style="{ zIndex: tile.number }"
    @click="toggleTileSelection(tile)"
  >
    <div
      class="hex-grid-item__background"
      :class="isSelected ? 'bg-green-500' : 'bg-white'"
      :style="`margin: -${borderWidth}`"
    >
      <div class="hex-grid-item__content" :style="{ ...tileContentStyle }">
        <span :style="`margin-top: ${size / 5}px; color: ${landscapeColors.grayscale}77`">
          {{ tile.number }}
        </span>
        <transition name="fade" mode="out-in">
          <div
            v-show="$store.state.preferences.showResourceValues"
            class="resourceContainer"
            :style="{
              fontSize: `clamp(10px, ${size / 10}vw, 40px`,
              gap: `${size / 40}vw`,
            }"
          >
            <div
              v-for="resource in resources"
              :key="resource.name"
              class="resourceItem"
              :style="{
                backgroundColor: resourceColors[resource.name].main,
                color: resourceColors[resource.name].grayscale,
              }"
            >
              <div class="w-8 text-center">
                <input
                  class="w-full bg-transparent text-center"
                  :value="resource.amount"
                  @change="e => updateResource(e, resource)"
                  v-show="$store.state.keysPressed.length == 0"
                />
                <span
                  v-show="$store.state.keysPressed.length > 0"
                  class="w-full"
                  :style="{ color: landscapeColors.grayscale }"
                >
                  {{ resource.amount }}
                </span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
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
      selectedTiles: state => state.board.selectedTiles,
      resourceColors: state => state.board.colors.resources,
      landscapeColors(state) {
        return state.board.colors.landscapes[this.tile.landscapeType]
      },
    }),
    ...mapGetters({ size: 'tileSize' }),
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

<style scoped>
.resourceContainer {
  align-content: flex-start;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 66%;
}

.resourceItem {
  align-items: center;
  border-radius: 5px;
  box-shadow: 0.5px 0.5px 2px #44444499;
  display: flex;
  justify-content: space-evenly;
  line-height: 1rem;
}

.hex-grid__item {
  filter: drop-shadow(2px 2px 5px rgba(22, 22, 22, 0.2));
  height: 100%;
  margin: 0 auto;
  position: relative;
  width: 66.6666%;
}

.hex-grid-item__background {
  clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
  display: grid;
  height: 100%;
  place-items: center;
  width: 100%;
}

.hex-grid-item__content {
  align-items: center;
  clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
  display: flex;
  flex-direction: column;
  font-size: 0.7vw;
  justify-content: flex-start;
}
</style>

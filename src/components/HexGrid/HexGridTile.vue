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
        <span :style="`margin-top: ${size / 5}px;`">{{ tile.number }}</span>
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
                backgroundColor: $store.getters.landscapeColors.main[resource.name],
                color: $store.getters.landscapeColors.grayscale[resource.name],
              }"
            >
              <WoodIcon v-if="resource.name == 'wood' && tileIsLargeEnough" />
              <StoneIcon v-if="resource.name == 'stone' && tileIsLargeEnough" />
              <WheatIcon v-if="resource.name == 'wheat' && tileIsLargeEnough" />
              <div class="w-8 text-center">
                <input
                  class="w-full bg-transparent text-center"
                  :value="resource.amount"
                  @change="e => updateResource(e, resource)"
                  v-show="$store.state.keysPressed.length == 0"
                />
                <span class="w-full" v-show="$store.state.keysPressed.length > 0">
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
import WoodIcon from '@/assets/icons/log.svg'
import StoneIcon from '@/assets/icons/stone-block.svg'
import WheatIcon from '@/assets/icons/wheat.svg'

export default {
  name: 'HexGridTile',
  components: {
    WoodIcon,
    StoneIcon,
    WheatIcon,
  },
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
    }),
    ...mapGetters({ size: 'tileSize' }),
    tileContentStyle() {
      return {
        display: 'flex',
        gap: `${1 / 50}vw`,
        backgroundColor: this.$store.getters.landscapeColors.main[this.tile.landscapeType],
        fontSize: `clamp(8px, ${1 / 10}vw, 20px`,
        height: `${100 - this.borderWidth}%`,
        width: `${100 - this.borderWidth}%`,
      }
    },
    tileIsLargeEnough() {
      return 1 > 6 && this.viewportWidth > 800
    },
    isSelected() {
      return this.$store.state.board.selectedTiles.includes(this.tile.id)
    },
    resources() {
      return [...this.tile.resources]
        .filter(r => r.amount > 0)
        .sort((a, b) => a.amount - b.amount)
    },
  },
  methods: {
    getInvertedHexcolorGrayscale,
    toggleTileSelection(tile) {
      if (!this.$store.state.keysPressed.includes(93)) return

      const foundIndex = this.$store.state.board.selectedTiles.indexOf(tile.id)

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
svg path:last-child {
  fill: #eee !important;
}

svg {
  width: inherit !important;
  height: inherit !important;
  fill: transparent;
}

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
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  font-size: 0.7vw;
  justify-content: flex-start;
}
</style>

<template>
  <div class="hex-grid__item" :style="{ zIndex: tile.number }">
    <div class="hex-grid-item__background">
      <div class="hex-grid-item__content" :style="{ ...tileContentStyle }">
        <span :style="`margin-top: ${size / 5}px;`">{{ tile.number }}</span>
        <transition name="fade" mode="out-in">
          <div
            v-show="$store.state.grid.visibleResourceValues"
            class="resourceContainer"
            :style="{
              fontSize: `clamp(10px, ${size / 10}vw, 40px`,
              gap: `${size / 40}vw`,
            }"
          >
            <div
              v-for="resource in tile.resources"
              :key="resource.name"
              class="resourceItem"
              :style="{
                backgroundColor: $store.getters.resourceColors[resource.name],
                color: $store.getters.invertedResourceColors[resource.name],
              }"
            >
              <WoodIcon v-if="resource.name == 'wood' && tileIsLargeEnough" />
              <StoneIcon v-if="resource.name == 'stone' && tileIsLargeEnough" />
              <WheatIcon v-if="resource.name == 'wheat' && tileIsLargeEnough" />
              <span>{{ resource.amount }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import WoodIcon from '@/assets/icons/log.svg'
import StoneIcon from '@/assets/icons/stone-block.svg'
import WheatIcon from '@/assets/icons/wheat.svg'
import colors from '@/assets/colors'

export default {
  name: 'ResourceTile',
  components: {
    WoodIcon,
    StoneIcon,
    WheatIcon,
  },
  data() {
    return {
      colors,
    }
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
        gap: `${this.size / 50}vw`,
        backgroundColor: this.$store.getters.landscapeColors[this.tile.landscapeType],
        fontSize: `clamp(8px, ${this.size / 10}vw, 20px`,
        height: `${100 - this.borderWidth}%`,
        width: `${100 - this.borderWidth}%`,
      }
    },
    tileIsLargeEnough() {
      return this.size > 6 && this.viewportWidth > 800
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
  height: 80%;
  justify-content: center;
  width: 66%;
}

.resourceItem {
  align-items: center;
  border-radius: 5px;
  box-shadow: 0.5px 0.5px 2px #44444499;
  display: flex;
  justify-content: space-evenly;
  padding: 1px;
  width: 40%;
}

.hex-grid__item {
  filter: drop-shadow(2px 2px 5px rgba(22, 22, 22, 0.2));
  height: 100%;
  margin: 0 auto;
  position: relative;
  width: 66.6666%;
}

.hex-grid-item__background {
  background-color: #efefef;
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
  justify-content: start;
}
</style>

<template>
  <div class="hex-grid__item" :style="{ zIndex: tile.number }">
    <div class="hex-grid-item__background">
      <div class="hex-grid-item__content" :style="tileContentStyle">
        {{ tile.number }}
        <div
          class="resourceContainer"
          :style="{ fontSize: `clamp(10px, ${size / 10}vw, 40px`, gap: `${size / 40}vw` }"
        >
          <div v-if="tile.resources.wood > 0" class="resourceItem wood">
            <WoodIcon v-if="tileIsLargeEnough" />
            <span>{{ tile.resources.wood }}</span>
          </div>
          <div v-if="tile.resources.stone > 0" class="resourceItem stone">
            <StoneIcon v-if="tileIsLargeEnough" />
            <span>{{ tile.resources.stone }}</span>
          </div>
          <div v-if="tile.resources.wheat > 0" class="resourceItem wheat">
            <WheatIcon v-if="tileIsLargeEnough" />
            <span>{{ tile.resources.wheat }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import WoodIcon from "@/assets/icons/log.svg";
import StoneIcon from "@/assets/icons/stone-block.svg";
import WheatIcon from "@/assets/icons/wheat.svg";

export default {
  name: "ResourceTile",
  components: {
    WoodIcon,
    StoneIcon,
    WheatIcon,
  },
  computed: {
    ...mapState(["borderWidth", "viewportWidth"]),
    ...mapGetters({ size: 'tileSize' }),
    tileContentStyle() {
      return {
        display: "flex",
        gap: `${this.size / 50}vw`,
        backgroundColor: `${this.tile.color}9a`,
        fontSize: `clamp(8px, ${this.size / 10}vw, 20px`,
        height: `${100 - this.borderWidth}%`,
        width: `${100 - this.borderWidth}%`,
      };
    },
    tileIsLargeEnough() {
      return this.size > 6 && this.viewportWidth > 800
    }
  },
  props: {
    tile: {
      color: String,
      number: Number,
      resources: {
        stone: Number,
        wood: Number,
        wheat: Number,
      },
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
svg path:last-child {
  fill: #eee !important;
}

.stone {
  background-color: #252627;
  fill: #252627;
}

.wood {
  background-color: #47352c;
  fill: #47352c;
}

.wheat {
  background-color: #928d5c;
  fill: #928d5c;
}

svg {
  width: inherit !important;
  height: inherit !important;
}

.resourceContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  height: 85%;
  width: 66%;
}

.resourceItem {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 1px;
  border-radius: 5px;
  width: 40%;
  box-shadow: 0.5px 0.5px 2px #44444499;
}

.hex-grid__item {
  position: relative;
  height: 100%;
  width: percentage($number: 2/3);
  margin: 0 auto;
  filter: drop-shadow(2px 2px 5px rgba(22, 22, 22, 0.2));
}

.hex-grid-item__background {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #efefef;
  height: 100%;
  width: 100%;
  clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
}

.hex-grid-item__content {
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  display: flex;
  font-size: 0.7vw;
  clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
}
</style>

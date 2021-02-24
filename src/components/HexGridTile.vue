<template>
  <div class="hex-grid__item" :style="{ zIndex: tile.number }">
    <div class="hex-grid-item__background">
      <div class="hex-grid-item__content" :style="{ ...tileContentStyle }">
        {{ tile.number }}
        <div
          class="resourceContainer"
          :style="{
            fontSize: `clamp(10px, ${size / 10}vw, 40px`,
            gap: `${size / 40}vw`,
          }"
        >
          <div
            v-for="resource in resources"
            :key="resource.type"
            :class="['resourceItem', resource.type]"
          >
            <WoodIcon v-if="resource.type == 'wood' && tileIsLargeEnough" />
            <StoneIcon v-if="resource.type == 'stone' && tileIsLargeEnough" />
            <WheatIcon v-if="resource.type == 'wheat' && tileIsLargeEnough" />
            <span>{{ resource.amount }}</span>
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
  computed: {
    ...mapState({
      borderWidth: (state) => state.grid.tileBorderWidth,
      viewportWidth: (state) => state.viewportWidth,
    }),
    ...mapGetters({ size: "tileSize" }),
    resources() {
      return Object.entries(this.tile.resources)
        .map(([type, amount]) => amount > 0 && { type, amount })
        .filter((truthy) => truthy);
    },
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
      return this.size > 6 && this.viewportWidth > 800;
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
}

.wood {
  background-color: #47352c;
}

.wheat {
  background-color: #928d5c;
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
  width: percentage(2/3);
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
  justify-content: center;
}
</style>

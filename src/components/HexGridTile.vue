<template>
  <div class="hex-grid__item" :style="`z-index: ${hex.number}`">
    <div class="hex-grid-item__background">
      <div class="hex-grid__content" :style="hexGridItemContent">
        <span :style="{ position: 'relative', bottom: `${0.01 * size}vw` }">{{
          hex.number
        }}</span>
        <div
          class="resourceContainer"
          :style="{ fontSize: `${0.03 * size }vw`, gap: `${0.3 * size}px` }"
        >
          <div v-if="hex.resources.wood > 0" class="resourceItem wood">
            <WoodIcon v-if="size > 19" />
            <span>{{ hex.resources.wood }}</span>
          </div>
          <div v-if="hex.resources.stone > 0" class="resourceItem stone">
            <StoneIcon v-if="size > 19" />
            <span>{{ hex.resources.stone }}</span>
          </div>
          <div v-if="hex.resources.wheat > 0" class="resourceItem wheat">
            <WheatIcon v-if="size > 19" />
            <span>{{ hex.resources.wheat }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    hexGridItemContent() {
      return {
        "background-color": `${this.hex.color}9a`,
        fontSize: `${0.02 * this.size}vw`,
        height: `${100 - this.borderWidth}%`,
        width: `${100 - this.borderWidth}%`,
      };
    },
  },
  props: {
    hex: {
      color: String,
      number: Number,
      resources: {
        stone: Number,
        wood: Number,
        wheat: Number,
      },
      required: true,
    },
    size: Number,
    borderWidth: Number,
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
  height: 75%;
  width: 66%;
}

.resourceItem {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 1px;
  border-radius: 5px;
  width: 44%;
  height: min-content;
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

.hex-grid__content {
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

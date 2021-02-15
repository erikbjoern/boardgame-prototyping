<template>
<div class="hex-grid__item"> 
  <div class="hex-grid__content" :style="`background-color: ${hex.color}9a`">
    <span>{{ hex.number }}</span>
    <div class="resourceContainer">
      <div v-if="hex.resources.wood > 0" class="resourceItem wood">
        <WoodIcon />
        <span>{{ hex.resources.wood }}</span>
      </div>
      <div v-if="hex.resources.stone > 0" class="resourceItem stone">
        <StoneIcon />
        <span>{{ hex.resources.stone }}</span>
      </div>
      <div v-if="hex.resources.wheat > 0" class="resourceItem wheat">
        <WheatIcon />
        <span>{{ hex.resources.wheat }}</span>
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
  props: ['hex']
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
  width: 0.75vw !important;
  height: 0.75vw !important;
}

.resourceContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.1vw;
  height: 70%;
  width: 66%;
  font-size: 1vw;
}

.resourceContainer:hover {
  cursor: pointer;
  transform: scale(1.5);
  z-index: 10;
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
  filter: drop-shadow(1px 1px 2px rgba(50, 50, 0, 0.5));
}

.hex-grid__content {
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
  font-size: .7vw;
}

.hex-grid__content > * {
  position: relative;
  bottom: .2vw;
}

</style>

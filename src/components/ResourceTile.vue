<template>
  <div class="resourceContainer">
    <div v-if="resources.wood > 0" class="resourceItem wood">
      <WoodIcon /> 
      <span>{{ resources.wood }}</span>
    </div>
    <div v-if="resources.stone > 0" class="resourceItem stone">
      <StoneIcon /> 
      <span>{{ resources.stone }}</span>
    </div>
    <div v-if="resources.wheat > 0" class="resourceItem wheat">
      <WheatIcon /> 
      <span>{{ resources.wheat }}</span>
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
  props: {
    hex: Number,
    resources: {
      stone: Number,
      wood: Number,
      wheat: Number
    }
  },
}

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
  width: .75vw !important;
  height: .75vw !important;
}

.resourceContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: .1vw;
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
  box-shadow: .5px .5px 2px #44444499;
}
</style>
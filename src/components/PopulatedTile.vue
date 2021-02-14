<template>
  <div>
    <VillageIcon v-if="type === 'village'" />
    <TownIcon v-if="type === 'town'" />
  </div>
</template>

<script>
import VillageIcon from "@/assets/icons/village.svg";
import TownIcon from "@/assets/icons/castle.svg";

export default {
  name: "PopulatedTile",
  components: {
    VillageIcon,
    TownIcon,
  },
  props: {
    type: String,
  },
};
</script>

<style scoped>
svg {
  width: 2vw !important;
  height: 4vw !important; /* höjden håller siffran i toppen på avstånd */
  fill: transparent;
  stroke-opacity: 0;
  margin-top: -0.75vw;
}

svg path:last-child {
  fill-opacity: 0.7;
}
</style>

<template>
  <VillageIcon />
</template>

<script>
import VillageIcon from "@/assets/icons/village.svg"

export default {
  name: "CityTile",
  components: {
    VillageIcon,
  }
}
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
  fill-opacity: .7;
}
</style>
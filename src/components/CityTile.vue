<template>
  <CityIcon />
</template>

<script>
import CityIcon from "@/assets/icons/castle.svg"

export default {
  name: "CityTile",
  components: {
    CityIcon,
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
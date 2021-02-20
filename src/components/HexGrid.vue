<template>
  <div class="grid-container">
    <div :style="{ ...gridRowsStyle, ...gridRowsOddStyle }">
      <div v-for="hex in hexRows.rowsOdd.flat()" :key="hex.number">
        <HexGridTile :hex="hex" />
      </div>
    </div>
    <div :style="{ ...gridRowsStyle, ...gridRowsEvenStyle }">
      <div v-for="hex in hexRows.rowsEven.flat()" :key="hex.number">
        <HexGridTile :hex="hex" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HexGridTile from "@/components/HexGridTile.vue";

export default {
  name: "HexGrid",
  components: {
    HexGridTile,
  },
  computed: {
    ...mapState({
      tileSize: (state) => state.style.tileSize,
      gap: (state) => state.style.gap,
      columns: (state) => state.columns,
      hexRows: (state) => state.hexRows,
    }),
    gridRowsStyle() {
      return {
        display: "grid",
        gridAutoRows: `${this.tileSize}vw`,
        gap: `${this.gap}vw`,
      };
    },
    gridRowsOddStyle() {
      return {
        gridTemplateColumns: `repeat(${this.rowsOddLength}, ${this.tileSpaceX}vw)`,
      };
    },
    gridRowsEvenStyle() {
      return {
        gridTemplateColumns: `repeat(${this.rowsEvenLength}, ${this.tileSpaceX}vw)`,
        position: "absolute",
        top: `${this.tileSize / 2 + this.gap / 2}vw`,
        left: `${-this.tileSpaceX / 2 - this.gap / 2}vw`,
      };
    },
    rowsOddLength() {
      return Math.ceil(this.columns / 2) - (this.columns % 2);
    },
    rowsEvenLength() {
      return Math.ceil(this.columns / 2);
    },
    tileSpaceX() {
      return this.tileSize * 1.5;
    },
  } 
}
</script>

<style lang="scss" scoped>
.grid-container {
  position: relative;
  width: min-content;
  margin: 50vh auto;
  padding-bottom: 10vh;
}
</style>
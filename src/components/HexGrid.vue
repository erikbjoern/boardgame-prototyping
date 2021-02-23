<template>
  <div class="grid-container">
    <div :style="{ ...gridRowsStyle, ...gridRowsOddStyle }">
      <div v-for="hex in rowsOdd().flat()" :key="hex.number">
        <HexGridTile :tile="hex" />
      </div>
    </div>
    <div :style="{ ...gridRowsStyle, ...gridRowsEvenStyle }">
      <div v-for="hex in rowsEven().flat()" :key="hex.number">
        <HexGridTile :tile="hex" />
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
      tileSize: (state) => state.tileSize,
      gap: (state) => state.gap,
      columnCount: (state) => state.columnCount,
      hexRows: (state) => state.hexRows,
    }),
    gridRowsStyle() {
      return {
        display: "grid",
        gridAutoRows: `${this.tileHeight()}vw`,
        gap: `${this.gapValue}vw`,
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
        top: `${this.tileHeight() / 2 + this.gapValue / 2}vw`,
        left: `${-this.tileSpaceX / 2 - this.gapValue / 2}vw`,
      };
    },
    rowsOddLength() {
      return Math.ceil(this.columnCount / 2) - (this.columnCount % 2);
    },
    rowsEvenLength() {
      return Math.ceil(this.columnCount / 2);
    },
    tileSpaceX() {
      return this.tileHeight() * 1.5;
    },
    gapValue() {
      return this.gap * this.tileHeight()
    }
  },
  methods: {
    rowsOdd() {
      return this.hexRows.filter((a, index) => index % 2 == 0);
    },
    rowsEven() {
      return this.hexRows.filter((a, index) => index % 2 == 1);
    },
    tileHeight() {
      return (this.tileSize * visualViewport.width) / 100 > 40
        ? this.tileSize
        : (40 / visualViewport.width) * 100;
    },
  },
};
</script>

<style lang="scss" scoped>
.grid-container {
  position: relative;
  width: min-content;
  margin: 50vh auto;
  padding-bottom: 10vh;
}
</style>

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
import { colors } from "@/helpers/colors";
import HexGridTile from "@/components/HexGridTile.vue";

export default {
  name: "HexGrid",
  components: {
    HexGridTile,
  },
  data() {
    return {
      colors,
      hexNumber: 0,
    };
  },
  computed: {
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
    ...mapState({
      tileSize: (state) => state.style.tileSize,
      gap: (state) => state.style.gap,
      rows: (state) => state.rows,
      columns: (state) => state.columns,
    }),
    rowsOddLength() {
      return Math.ceil(this.columns / 2) - (this.columns % 2);
    },
    rowsEvenLength() {
      return Math.ceil(this.columns / 2);
    },
    tileSpaceX() {
      return this.tileSize * 1.5;
    },
    hexRows: {
      get() {
        return this.$store.state.hexRows;
      },
      set(value) {
        this.$store.commit("setHexRows", value);
      },
    },
  },
  methods: {
    getResource() {
      const chance = 25;
      const range = 9;
      return Math.floor((Math.random() * 100) / chance) == 0
        ? Math.ceil(Math.random() * range)
        : 0;
    },
    getRandomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
    buildHexRow(tileRow, iterator) {
      const columns = this.columns;
      const rowLength = tileRow.length;
      const tileCount =
        Math.floor(columns / 2) + (((columns % 2) * iterator) % 2);

      for (let t = rowLength; t < tileCount; t++) {
        const tile = {
          number: ++this.hexNumber,
          color: this.getRandomColor(),
          resources: {
            stone: this.getResource(),
            wood: this.getResource(),
            wheat: this.getResource(),
          },
        };
        tileRow.push(tile);
      }

      return tileRow;
    },
    addHexColumns() {
      const { rowsOdd, rowsEven } = this.hexRows;

      for (let i = 0; i < this.rows; i++) {
        const index = Math.floor(i / 2);
        const targetRow = i % 2 == 0 ? rowsOdd[index] : rowsEven[index];
        this.buildHexRow(targetRow, i);
      }
    },
    addHexRows(difference, oldRowTotal) {
      const { rowsOdd, rowsEven, rowsOddStash, rowsEvenStash } = this.hexRows;
      const { rowsOddLength, rowsEvenLength } = this
      const newRowTotal = oldRowTotal + difference;

      for (let i = oldRowTotal; i < newRowTotal; i++) {
        let tileRow = [];

        if (i % 2 == 0 && rowsOddStash.length) {
          tileRow = rowsOddStash.pop();
        } else if (i % 2 == 1 && rowsEvenStash.length) {
          tileRow = rowsEvenStash.pop();
        }

        const rowLength = tileRow.length;
        const tileCount = i % 2 == 0 ? rowsOddLength : rowsEvenLength
        const needsUpdate = rowLength != 0 && rowLength != tileCount;

        if (rowLength < tileCount) {
          tileRow = this.buildHexRow(tileRow, i);
        } else if (rowLength > tileCount) {
          for (let t = rowLength; t > tileCount; t--) {
            tileRow.pop();
          }
        }

        const index = Math.floor(i / 2);

        i % 2 == 0 ? (rowsOdd[index] = tileRow) : (rowsEven[index] = tileRow);
        this.hexRows = { ...this.hexRows };
        needsUpdate && this.updateTileNumbers({ updateAll: false });
      }
    },
    removeHexColumns(difference, oldColumnTotal) {
      const { rowsOdd, rowsEven } = this.hexRows;

      for (let i = 0; i < Math.ceil(difference / 2); i++) {
        (i + oldColumnTotal) % 2 == 0
          ? rowsOdd.forEach((a) => a.pop())
          : rowsEven.forEach((a) => a.pop());
      }
    },
    removeHexRows(difference, oldRowTotal) {
      const m = oldRowTotal % 2;
      const { rowsOdd, rowsEven, rowsOddStash, rowsEvenStash } = this.hexRows;

      for (let i = m; i < difference + m; i++) {
        i % 2 == 1
          ? rowsOddStash.push(rowsOdd.pop())
          : rowsEvenStash.push(rowsEven.pop());
      }
    },
    updateTileNumbers({ updateAll }) {
      const { rows, columns } = this;
      const { rowsOdd, rowsEven } = this.hexRows;

      const hexTotal = Math.floor((rows * columns) / 2);
      let hexNumber = hexTotal;
      let targetRow = rows;

      do {
        const index = Math.floor((targetRow - 1) / 2);
        const hexRows = targetRow % 2 == 1 ? rowsOdd : rowsEven;

        hexRows[index].reverse().map((tile) => {
          tile.number = hexNumber--;
        });
        hexRows[index].reverse();

        targetRow--;
      } while (targetRow > 0 && updateAll);

      this.hexNumber = hexTotal;
    },
  },
  watch: {
    rows(newValue, oldValue) {
      if (oldValue == 0 || oldValue == null) return;

      const difference = Math.abs(newValue - oldValue);

      if (newValue > oldValue) {
        this.addHexRows(difference, oldValue);
      } else {
        this.removeHexRows(difference, oldValue);
      }
    },
    columns(newValue, oldValue) {
      if (oldValue == 0 || oldValue == null) return;

      const difference = Math.abs(newValue - oldValue);

      if (newValue > oldValue) {
        this.addHexColumns();
      } else {
        this.removeHexColumns(difference, oldValue);
      }

      this.updateTileNumbers({ updateAll: true });
    },
  },
  created() {
    this.$store.dispatch("setStateFromLocalStorage");

    !this.hexRows.rowsOdd.length && this.addHexRows(this.rows, 0);
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

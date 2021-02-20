<template>
  <HexGrid />
</template>

<script>
import { mapState } from "vuex";
import { colors } from "@/helpers/colors";
import HexGrid from "@/components/HexGrid.vue";

export default {
  name: "HexGridContainer",
  components: {
    HexGrid,
  },
  data() {
    return {
      colors,
      hexNumber: 0,
    };
  },
  computed: {
    ...mapState(["rowCount", "columnCount", "hexRows"]),
    hexTotal() {
      return Math.floor((this.rowCount * this.columnCount) / 2);
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
    buildHexRow(row, iteration) {
      const columnCount = this.columnCount;
      const rowLength = row.length;
      const tileCount =
        Math.floor(columnCount / 2) + (columnCount % 2) * (iteration % 2);

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
        row.push(tile);
      }

      return row;
    },
    addHexColumns() {
      const { rowCount, hexRows } = this;

      for (let i = 0; i < rowCount; i++) {
        const targetRow = hexRows[i];
        const extendedRow = this.buildHexRow([...targetRow], i);

        this.$store.commit("replaceHexRow", { row: extendedRow, index: i });
      }

      this.updateTileNumbers({ updateAll: true });
    },
    addHexRows(difference, oldRowTotal) {
      const p = oldRowTotal % 2;

      for (let i = p; i < difference + p; i++) {
        const newRow = this.buildHexRow([], i % 2);

        this.$store.commit("addHexRow", newRow);
      }
    },
    removeHexColumns(difference, previousTotal) {
      const p = previousTotal % 2;
      for (let i = p; i < difference + p; i++) {
        this.$store.commit("removeHexColumn", { indexParity: i % 2 });
      }
      
      this.updateTileNumbers({ updateAll: true });
    },
    removeHexRows(difference) {
      for (let i = 0; i < difference; i++) {
        this.$store.commit("removeHexRow");
      }
      this.hexNumber = this.hexTotal
    },
    updateTileNumbers({ updateAll }) {
      const { rowCount, hexTotal, hexRows } = this;
      let hexNumber = hexTotal;
      let index = rowCount;

      do {
        const targetRow = hexRows[--index];
        const updatedRow = [...targetRow]
          .reverse()
          .map((tile) => (tile = { ...tile, number: hexNumber-- }))
          .reverse();
        this.$store.commit("replaceHexRow", { row: updatedRow, index });
      } while (index > 0 && updateAll);

      this.hexNumber = hexTotal;
      this.$store.dispatch("updateLocalStorage");
    },
  },
  watch: {
    rowCount(newValue, oldValue) {
      if (oldValue == null) return;

      const difference = Math.abs(newValue - oldValue);

      if (newValue > oldValue) {
        this.addHexRows(difference, oldValue);
      } else {
        this.removeHexRows(difference);
      }
    },
    columnCount(newValue, oldValue) {
      if (oldValue == null) return;

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
    this.$store.dispatch("setInitialState");

    !this.hexRows.length && this.addHexRows(this.rowCount, 0);

    this.hexNumber = this.hexTotal;
  },
};
</script>

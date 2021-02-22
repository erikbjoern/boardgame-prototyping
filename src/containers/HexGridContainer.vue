<template>
  <HexGrid />
</template>

<script>
import { mapActions, mapState } from "vuex";
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
    };
  },
  computed: {
    ...mapState(["rowCount", "columnCount", "hexRows", "hexRowsStash"]),
  },
  methods: {
    ...mapActions([
      "getRowFromStash",
      "setInitialState",
      "storeHexRow",
      "storeModifiedHexRow",
      "updateLocalStorage",
    ]),
    getCurrentHexTotal() {
      return [...this.hexRows].flat().length;
    },
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
    getTileCount(rowIndex) {
      const { columnCount } = this;
      return Math.floor(columnCount / 2) + (columnCount % 2) * (rowIndex % 2);
    },
    buildHexRow(row, rowIndex) {
      const tileCount = this.getTileCount(rowIndex);
      let hexNumber = this.getCurrentHexTotal();

      for (let t = row.length; t < tileCount; t++) {
        const stashedRow = this.hexRowsStash[rowIndex];
        const stashedTile = stashedRow ? stashedRow[row.length] : null;
        const tile = stashedTile || {
          number: ++hexNumber,
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

      for (let index = 0; index < rowCount; index++) {
        const targetRow = hexRows[index];
        const extendedRow = this.buildHexRow([...targetRow], index);

        this.storeModifiedHexRow({ row: extendedRow, index });
      }
    },
    async addHexRows(difference, oldRowTotal) {
      const newTotal = oldRowTotal + difference;

      for (let index = oldRowTotal; index < newTotal; index++) {
        const stashedRow = await this.getRowFromStash(index);
        const tileCount = this.getTileCount(index);

        let row, needsUpdate;

        if (!stashedRow) {
          row = this.buildHexRow([], index);
        } else if (stashedRow.length < tileCount) {
          row = this.buildHexRow([...stashedRow], index);
          needsUpdate = true;
        } else if (stashedRow.length > tileCount) {
          row = [...stashedRow].slice(0, tileCount);
          needsUpdate = true;
        } else {
          row = stashedRow;
        }

        this.storeHexRow({ row, index });
        needsUpdate &&
          this.updateTileNumbers({ updateAll: false, row: index + 1 });
      }
    },
    removeHexColumns(difference, previousTotal) {
      const p = previousTotal % 2;
      for (let i = p; i < difference + p; i++) {
        this.$store.commit("removeHexColumn", { indexParity: i % 2 });
      }
    },
    removeHexRows(difference) {
      for (let i = 0; i < difference; i++) {
        this.$store.commit("removeHexRow");
      }
    },
    updateTileNumbers({ updateAll, row }) {
      const { rowCount, getCurrentHexTotal, hexRows } = this;
      let hexNumber = getCurrentHexTotal();
      let index = row || rowCount;

      do {
        const targetRow = hexRows[--index];
        const updatedRow = [...targetRow]
          .reverse()
          .map((tile) => (tile = { ...tile, number: hexNumber-- }))
          .reverse();
        this.storeModifiedHexRow({ row: updatedRow, index });
      } while (index > 0 && updateAll);

      this.updateLocalStorage();
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
    this.setInitialState();

    const currentRowCount = this.hexRows.length
    const difference = this.rowCount - currentRowCount
    this.addHexRows(difference, currentRowCount);
  },
};
</script>

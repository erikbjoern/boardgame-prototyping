<template>
  <HexGrid />
</template>

<script>
import { mapActions, mapState } from "vuex";
import colors from "@/assets/colors";
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
    ...mapState({
      rowCount: (state) => state.grid.rowCount,
      columnCount: (state) => state.grid.columnCount,
      hexRows: (state) => state.grid.hexRows,
      hexRowsStash: (state) => state.grid.hexRowsStash,
      resourceParameters: (state) => state.resources.parameters,
    }),
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
      return [...this.$store.state.grid.hexRows].flat().length;
    },
    getResources() {
      const resources = {};

      for (const resource of this.resourceParameters) {
        resources[resource.type] =
          Math.floor((Math.random() * 100) / resource.chance) == 0
            ? Math.ceil(Math.random() * resource.max)
            : 0;
      }

      return resources;
    },
    getRandomColor() {
      return this.colors.random[
        Math.floor(Math.random() * this.colors.random.length)
      ];
    },
    getTileCount(rowIndex) {
      const { columnCount } = this;
      return Math.floor(columnCount / 2) + (columnCount % 2) * (rowIndex % 2);
    },
    buildHexRow(row, rowIndex) {
      const tileCount = this.getTileCount(rowIndex);
      let newRow = [];

      for (let t = 0; t < tileCount; t++) {
        let tile;

        if (!!row[t]) {
          tile = row[t];
        } else {
          const stashedRow = this.hexRowsStash[rowIndex];
          const stashedTile = stashedRow ? stashedRow[newRow.length] : null;

          let resources;
          let color;

          if (!stashedTile) {
            resources = this.getResources();
            const highestResourceValue = Math.max(...Object.values(resources));
            const highestResourceType = Object.keys(resources).find(
              (type) => resources[type] == highestResourceValue
            );
            color =
              highestResourceValue == 0
                ? `${this.getRandomColor()}9a`
                : `${colors[highestResourceType]}ea`;
          }

          tile = stashedTile || {
            color,
            resources,
          };
        }

        (tile.number = ++this.hexNumber), (tile.index = newRow.length);
        tile.rowIndex = rowIndex;

        newRow.push(tile);
      }

      return newRow;
    },
    reduceHexRow(targetRow, rowIndex) {
      const tileCount = this.getTileCount(rowIndex);
      let reducedRow = [];

      for (let i = 0; i < tileCount; i++) {
        const tile = { ...targetRow[i], number: ++this.hexNumber };
        reducedRow.push(tile);
      }

      return reducedRow
    },
    addHexColumns() {
      const { rowCount, hexRows } = this;
      this.hexNumber = 0;

      for (let index = 0; index < rowCount; index++) {
        const targetRow = hexRows[index];
        const extendedRow = this.buildHexRow([...targetRow], index);

        this.storeModifiedHexRow({ row: extendedRow, index });
      }
    },
    async addHexRows(difference, oldRowTotal) {
      const newTotal = oldRowTotal + difference;
      this.hexNumber = this.getCurrentHexTotal()

      for (let index = oldRowTotal; index < newTotal; index++) {
        const stashedRow = await this.getRowFromStash(index);
        const row = stashedRow
          ? this.buildHexRow([...stashedRow], index)
          : this.buildHexRow([], index);

        this.storeHexRow({ row, index });
      }
    },
    removeHexColumns() {
      this.hexNumber = 0;

      for (let index = 0; index < this.rowCount; index++) { 
        const targetRow = this.hexRows[index];
        const reducedRow = this.reduceHexRow(targetRow, index);
        
        this.storeModifiedHexRow({ row: reducedRow, index });
      }
    },
    removeHexRows(difference) {
      while(difference--) {
        this.$store.commit("removeHexRow");
      }
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

      if (newValue > oldValue) {
        this.addHexColumns();
      } else {
        this.removeHexColumns();
      }
    },
  },
  created() {
    this.setInitialState();

    const stashedRowsCount = this.hexRows.length;
    const difference = this.rowCount - stashedRowsCount;
    this.addHexRows(difference, stashedRowsCount);
  },
};
</script>

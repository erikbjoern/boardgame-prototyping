<template>
  <div class="main-container">
    <div class="input-bar">
      <label htmlFor="rows">Rader</label>
      <input id="rows" type="number" min="1" max="23" v-model="rows" />
      <label htmlFor="columns">Kolumner</label>
      <input id="columns" type="number" min="1" max="30" v-model="columns" />
      <label htmlFor="tile-size">Storlek</label>
      <input id="tile-size" type="number" min="1" max="50" v-model="tileSize" />
      <label htmlFor="gap">Mellanrum</label>
      <input id="gap" type="number" min="0" max="10" v-model="gap" />
      <!-- <label htmlFor="distance">Distans</label>
      <input
        id="distance"
        type="number"
        min="1"
        :max="villageDistanceMaximum"
        v-model="villageDistance"
      /> -->
      <button @click="reset">Reset</button>
    </div>
    <div class="grid-container">
      <div :style="{ ...gridRowsClass, ...gridRowsOddClass }">
        <div v-for="hex in hexes.rowsOdd.flat()" :key="hex.number">
          <ResourceTile :hex="hex" />
        </div>
      </div>
      <div :style="{ ...gridRowsClass, ...gridRowsEvenClass }">
        <div v-for="hex in hexes.rowsEven.flat()" :key="hex.number">
          <ResourceTile :hex="hex" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { colors } from "@/helpers/colors";
import ResourceTile from "./components/ResourceTile.vue";

export default {
  name: "App",
  components: {
    ResourceTile,
  },
  data() {
    return {
      tileSize: 13,
      gap: 4,
      columnCount: null,
      rowCount: null,
      colors: colors,
      hexes: {
        rowsOdd: [],
        rowsEven: [],
        stashRowsOdd: [],
        stashRowsEven: [],
      },
      hexNumber: 0,
      // villageDistance: null, //sätts i created()
    };
  },
  computed: {
    gridRowsClass() {
      return {
        display: "grid",
        "grid-auto-rows": `${this.tileSize * 0.3}vw`,
        gap: `${this.gap / 10}vw`,
      };
    },
    gridRowsOddClass() {
      return {
        "grid-template-columns": `repeat(${Math.ceil(this.columns / 2) -
          (this.columns % 2)}, ${this.tileSize * 0.45}vw)`,
      };
    },
    gridRowsEvenClass() {
      return {
        "grid-template-columns": `repeat(${Math.ceil(
          this.columns / 2
        )}, ${this.tileSize * 0.45}vw)`,
        position: "absolute",
        top: `${this.tileSize * 0.15 + this.gap / 20}vw`,
        left: `${- this.tileSize * 0.225 - this.gap / 20 }vw`,
      };
    },
    columns: {
      get() {
        return this.columnCount;
      },
      set(value) {
        this.columnCount = parseInt(value);
      },
    },
    rows: {
      get() {
        return this.rowCount;
      },
      set(value) {
        this.rowCount = parseInt(value);
      },
    },
    villageDistanceMaximum() {
      return Math.ceil(this.rows / 4 - 1);
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
      const { rowsOdd, rowsEven } = this.hexes;

      for (let i = 0; i < this.rows; i++) {
        const index = Math.floor(i / 2);
        const targetRow = i % 2 == 0 ? rowsOdd[index] : rowsEven[index];
        this.buildHexRow(targetRow, i);
      }
    },
    addHexRows(difference, oldRowTotal) {
      const { rowsOdd, rowsEven, stashRowsOdd, stashRowsEven } = this.hexes;
      const newRowTotal = oldRowTotal + difference;

      for (let i = oldRowTotal; i < newRowTotal; i++) {
        let tileRow = [];

        if (i % 2 == 0 && stashRowsOdd.length) {
          tileRow = stashRowsOdd.pop();
        } else if (i % 2 == 1 && stashRowsEven.length) {
          tileRow = stashRowsEven.pop();
        }

        const columns = this.columns;
        const rowLength = tileRow.length;
        const tileCount = Math.floor(columns / 2) + (((columns % 2) * i) % 2);
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
        needsUpdate && this.updateTileNumbers({ updateAll: false });
      }
    },
    removeHexColumns(difference, oldColumnTotal) {
      const { rowsOdd, rowsEven } = this.hexes;

      for (let i = 0; i < Math.ceil(difference / 2); i++) {
        (i + oldColumnTotal) % 2 == 0
          ? rowsOdd.forEach((a) => a.pop())
          : rowsEven.forEach((a) => a.pop());
      }
    },
    removeHexRows(difference, oldRowTotal) {
      const m = oldRowTotal % 2;
      const { rowsOdd, rowsEven, stashRowsOdd, stashRowsEven } = this.hexes;

      for (let i = m; i < difference + m; i++) {
        i % 2 == 1
          ? stashRowsOdd.push(rowsOdd.pop())
          : stashRowsEven.push(rowsEven.pop());
      }
    },
    reset() {
      localStorage.removeItem("hexRows");
      localStorage.removeItem("rowCount");
      localStorage.removeItem("columnCount");
      // localStorage.removeItem("villageDistance");
      window.location.reload();
    },
    updateLocalStorage() {
      const { rows, columns, tileSize, gap } = this;
      const { rowsOdd, rowsEven, stashRowsOdd, stashRowsEven } = this.hexes;

      localStorage.setItem("rowCount", rows);
      localStorage.setItem("columnCount", columns);
      localStorage.setItem("style", JSON.stringify({ tileSize, gap }))
      localStorage.setItem(
        "hexRows",
        JSON.stringify({ rowsOdd, rowsEven, stashRowsOdd, stashRowsEven })
      );
    },
    updateTileNumbers({ updateAll }) {
      const { rows, columns } = this;
      const { rowsOdd, rowsEven } = this.hexes;

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

      this.updateLocalStorage();
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
      this.updateLocalStorage();
    },
    tileSize: 'updateLocalStorage',
    gap: 'updateLocalStorage',
    // villageDistance(newValue) {
    //   localStorage.setItem("villageDistance", newValue.toString());
    // },
    // rows(newValue, oldValue) {
    //   if (this.villageDistance > this.villageDistanceMaximum)
    //     this.villageDistance = this.villageDistanceMaximum;

    //   if (newValue > oldValue && oldValue == 8 && this.villageDistance == 1)
    //     this.villageDistance = 2;
    // },
  },
  created() {
    const savedHexRows = JSON.parse(localStorage.getItem("hexRows"));
    // const savedVillageDistance = localStorage.getItem("villageDistance");
    const savedRowCount = parseInt(localStorage.getItem("rowCount"));
    const savedColumnCount = parseInt(localStorage.getItem("columnCount"));
    const savedStyle = JSON.parse(localStorage.getItem("style"));

    // this.villageDistance = savedVillageDistance || 2;
    this.rows = savedRowCount || 17;
    this.columns = savedColumnCount || 13;

    savedStyle && (this.tileSize = savedStyle.tileSize, this.gap = savedStyle.gap)
    savedHexRows
      ? this.hexes = savedHexRows
      : this.addHexRows(this.rows, 0);

    this.updateLocalStorage();
  },
};
</script>

<style lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.input-bar {
  margin: 10px auto -40px;
  z-index: 10;
}

.grid-container {
  position: relative;
  height: min-content;
  width: min-content;
  margin: auto;
}

body {
  background-color: #ddd;
  margin: 0;
}

input {
  width: 30px;
  margin: 0 5px;
}
</style>

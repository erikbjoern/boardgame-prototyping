<template>
  <div class="main-container">
    <div class="input-bar">
      <label htmlFor="rows">Rader</label>
      <input id="rows" type="number" min="9" max="23" v-model="rows" />
      <label htmlFor="columns">Kolumner</label>
      <input id="columns" type="number" min="11" max="30" v-model="columns" />
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
      <div
        class="odd-rows-grid"
        :style="
          `grid-template-columns: repeat(${Math.ceil(columns / 2) -
            (columns % 2)}, 4.5vw);`
        "
      >
        <div v-for="hex in hexes.rowsOdd.flat()" :key="hex.number">
          <ResourceTile :hex="hex" />
        </div>
      </div>
      <div
        class="even-rows-grid"
        :style="
          `grid-template-columns: repeat(${Math.ceil(columns / 2)}, 4.5vw);`
        "
      >
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
    addHexColumns(difference, oldColumnTotal) {
      const { rowsOdd, rowsEven, stashRowsOdd, stashRowsEven } = this.hexes;

      for (let i = 0; i < this.rows; i++) {
        const tileCount =
          Math.floor(difference / 2) +
          (difference % 2) * ((i + (oldColumnTotal % 2)) % 2);
        const index = Math.floor(i / 2);
        const tileRow = i % 2 == 0 ? rowsOdd[index] : rowsEven[index];

        for (let t = 0; t < tileCount; t++) {
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
      }

      localStorage.setItem(
        "hexRows",
        JSON.stringify({ rowsOdd, rowsEven, stashRowsOdd, stashRowsEven })
      );
    },
    addHexRows(difference, oldRowTotal) {
      const { rowsOdd, rowsEven, stashRowsOdd, stashRowsEven } = this.hexes;
      const columns = this.columns;
      const newRowTotal = oldRowTotal + difference;

      for (let i = oldRowTotal; i < newRowTotal; i++) {
        let tileRow = [];
        const tileCount = Math.floor(columns / 2) + (((columns % 2) * i) % 2);

        if (i % 2 == 0 && stashRowsOdd.length) {
          tileRow = stashRowsOdd.pop();
        } else if (i % 2 == 1 && stashRowsEven.length) {
          tileRow = stashRowsEven.pop();
        }

        const rowLength = tileRow.length
        const needsUpdate = rowLength != 0 && rowLength != tileCount
        
        if (rowLength < tileCount) {
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
        } else if (rowLength > tileCount) {
          for (let t = rowLength; t > tileCount; t--) {
            tileRow.pop()
          }
        }

        const index = Math.floor(i / 2);

        i % 2 == 0 ? (rowsOdd[index] = tileRow) : (rowsEven[index] = tileRow);
        needsUpdate && this.updateTileNumbers()
      }

      localStorage.setItem(
        "hexRows",
        JSON.stringify({ rowsOdd, rowsEven, stashRowsOdd, stashRowsEven })
      );
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

      localStorage.setItem(
        "hexRows",
        JSON.stringify({ rowsOdd, rowsEven, stashRowsOdd, stashRowsEven })
      );
    },
    reset() {
      localStorage.removeItem("hexRows");
      localStorage.removeItem("rowCount");
      localStorage.removeItem("columnCount");
      // localStorage.removeItem("villageDistance");
      window.location.reload();
    },
    updateTileNumbers() {
      const { rows, columns } = this;
      const { rowsOdd, rowsEven, stashRowsOdd, stashRowsEven } = this.hexes;

      const hexTotal = Math.floor((rows * columns) / 2);
      let hexNumber = hexTotal

      for (let i = rows; i > 0; i--) {
        const index = Math.floor((i - 1) / 2);
        const hexRows = i % 2 == 1 ? rowsOdd : rowsEven;

        hexRows[index].reverse().map((tile) => {
          tile.number = hexNumber--;
        });
        hexRows[index].reverse();
      }

      this.hexNumber = hexTotal

      localStorage.setItem(
        "hexRows",
        JSON.stringify({ rowsOdd, rowsEven, stashRowsOdd, stashRowsEven })
      );
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

      localStorage.setItem("rowCount", newValue.toString());
    },
    columns(newValue, oldValue) {
      if (oldValue == 0 || oldValue == null) return;

      const difference = Math.abs(newValue - oldValue);

      if (newValue > oldValue) {
        this.addHexColumns(difference, oldValue);
      } else {
        this.removeHexColumns(difference, oldValue);
      }

      this.updateTileNumbers();
      localStorage.setItem("columnCount", newValue.toString());
    },
    villageDistance(newValue) {
      localStorage.setItem("villageDistance", newValue.toString());
    },
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

    // this.villageDistance = savedVillageDistance || 2;
    this.rows = savedRowCount || 17;
    this.columns = savedColumnCount || 13;

    if (savedHexRows) {
      this.hexes = savedHexRows;
    } else {
      this.addHexRows(this.rows, 0);
    }
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
}

.grid-container {
  position: relative;
  height: min-content;
  width: min-content;
  margin: auto;
}

.even-rows-grid,
.odd-rows-grid {
  display: grid;
  grid-auto-rows: 3vw;
  gap: 1vw;
}

.even-rows-grid {
  position: absolute;
  top: 2vw;
  left: -2.75vw;
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

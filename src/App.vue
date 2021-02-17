<template>
  <div>
    <div class="input-bar">
      <div>
        <label>Rader</label>
        <div class="input-buttons">
          <div
            @click="rows < 23 && (rows += 1)"
            :class="{ disabled: rows == 23 }"
          >
            <span>+</span>
          </div>
          <div
            @click="rows > 3 && (rows -= 1)"
            :class="{ disabled: rows == 3 }"
          >
            <span>−</span>
          </div>
        </div>
        <input readonly type="number" min="3" max="23" v-model="rows" />
      </div>
      <div>
        <label>Kolumner</label>
        <div class="input-buttons">
          <div
            @click="columns < 23 && (columns += 1)"
            :class="{ disabled: columns == 23 }"
          >
            <span>+</span>
          </div>
          <div
            @click="columns > 3 && (columns -= 1)"
            :class="{ disabled: columns == 3 }"
          >
            <span>−</span>
          </div>
        </div>
        <input readonly type="number" min="3" max="30" v-model="columns" />
      </div>
      <div>
        <label htmlFor="tile-size">Storlek</label>
        <input
          id="tile-size"
          type="range"
          min="5"
          max="50"
          v-model.number="tileSize"
        />
      </div>
      <div>
        <label htmlFor="gap">Mellanrum</label>
        <input id="gap" type="range" min="0" max="20" v-model.number="gap" />
      </div>
      <div>
        <label htmlFor="border">Bård</label>
        <input
          id="border"
          type="range"
          min="0"
          max="20"
          v-model.number="borderWidth"
        />
      </div>
      <!-- <label htmlFor="distance">Distans</label>
      <input
        id="distance"
        type="number"
        min="1"
        :max="villageDistanceMaximum"
        v-model.number="villageDistance"
      /> -->
      <button @click="reset">Reset</button>
    </div>
    <div class="mainContainer" ref="mainContainer">
      <div class="grid-container">
        <div :style="{ ...gridRowsClass, ...gridRowsOddClass }">
          <div v-for="hex in hexes.rowsOdd.flat()" :key="hex.number">
            <ResourceTile
              :hex="hex"
              :size="tileSize"
              :borderWidth="borderWidth"
            />
          </div>
        </div>
        <div :style="{ ...gridRowsClass, ...gridRowsEvenClass }">
          <div v-for="hex in hexes.rowsEven.flat()" :key="hex.number">
            <ResourceTile
              :hex="hex"
              :size="tileSize"
              :borderWidth="borderWidth"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { colors } from "@/helpers/colors";
import ResourceTile from "@/components/ResourceTile.vue";
import { scrollToCenter } from "@/helpers/scroll.js";
import { dragToScrollStart, dragToScroll } from "@/helpers/scroll.js";

export default {
  name: "App",
  components: {
    ResourceTile,
  },
  data() {
    return {
      tileSize: null,
      gap: null,
      borderWidth: null,
      columns: null,
      rows: null,
      colors: colors,
      hexes: {
        rowsOdd: [],
        rowsEven: [],
        stashRowsOdd: [],
        stashRowsEven: [],
      },
      hexNumber: 0,
      mousePosition: { x: 0, y: 0 },
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
        "grid-template-columns": `repeat(${Math.ceil(this.columns / 2)}, ${this
          .tileSize * 0.45}vw)`,
        position: "absolute",
        top: `${this.tileSize * 0.15 + this.gap / 20}vw`,
        left: `${-this.tileSize * 0.225 - this.gap / 20}vw`,
      };
    },
    villageDistanceMaximum() {
      return Math.ceil(this.rows / 4 - 1);
    },
  },
  methods: {
    scrollToCenter,
    dragToScrollStart,
    dragToScroll,
    mouseMoveHandler(e) {
      this.dragToScroll.bind(this)(e);
    },
    mouseUpHandler() {
      this.$refs.mainContainer.style.cursor = "grab";

      document.removeEventListener("mousemove", this.mouseMoveHandler);
      document.removeEventListener("mouseup", this.mouseUpHandler);
    },
    mouseDownHandler(e) {
      this.dragToScrollStart.bind(this)(e);

      document.addEventListener("mousemove", this.mouseMoveHandler);
      document.addEventListener("mouseup", this.mouseUpHandler);
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
      localStorage.removeItem("style");
      // localStorage.removeItem("villageDistance");
      window.location.reload();
    },
    updateLocalStorage() {
      const { rows, columns, tileSize, gap, borderWidth } = this;
      const { rowsOdd, rowsEven, stashRowsOdd, stashRowsEven } = this.hexes;
      const style = { tileSize, gap, borderWidth };
      const hexRows = { rowsOdd, rowsEven, stashRowsOdd, stashRowsEven };

      localStorage.setItem("rowCount", rows);
      localStorage.setItem("columnCount", columns);
      localStorage.setItem("style", JSON.stringify(style));
      localStorage.setItem("hexRows", JSON.stringify(hexRows));
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
    tileSize: "updateLocalStorage",
    gap: "updateLocalStorage",
    borderWidth: "updateLocalStorage",
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
    this.rows = savedRowCount || 13;
    this.columns = savedColumnCount || 13;
    this.tileSize = savedStyle?.tileSize || 20;
    this.gap = savedStyle?.gap || 0;
    this.borderWidth = savedStyle?.borderWidth || 6;

    savedHexRows ? (this.hexes = savedHexRows) : this.addHexRows(this.rows, 0);

    this.updateLocalStorage();
    this.scrollToCenter();

    window.addEventListener("resize", this.scrollToCenter);
  },
  mounted() {
    const mainContainer = this.$refs.mainContainer;
    mainContainer.addEventListener("mousedown", this.mouseDownHandler);
  },
  destroyed() {
    document.removeEventListener("mousedown", this.mouseDownHandler);
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseup", this.mouseUpHandler);
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mainContainer {
  cursor: grab;
  background-color: #efefef;
  height: 200vh;
  width: 200vw;
  padding: calc(3vw + 30px) 0;
}

.input-bar {
  background-color: #efefef55;
  border-radius: 5px;
  display: inline-flex;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  gap: 10px;
  left: 50%;
  padding: 0.5vw;
  position: fixed;
  top: 1vw;
  transform: translateX(-50%);
  z-index: 1000;

  & > div {
    align-items: center;
    background-color: #aaaaaa55;
    border-radius: 3px;
    display: inline-flex;
    gap: 5px;
    padding: 3px;
  }
}

.input-buttons {
  display: inline-flex;
  gap: 2px;

  & > div {
    background-color: #eeeeee;
    border-radius: 4px;
    border: outset;
    cursor: pointer;
    height: 0.8em;
    padding: 0 2px;
    user-select: none;

    & > span {
      bottom: 0.2em;
      position: relative;
    }

    &:hover {
      background-color: #ffffffff;
    }

    &:active {
      border: inset;
    }

    &.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
}

.grid-container {
  position: relative;
  width: min-content;
  margin: 50vh auto;
  padding-bottom: 10vh;
}

input,
button {
  background-color: #eef1ef;
  border-radius: 3px;
  border: 1px solid #999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

button:hover {
  cursor: pointer;
  opacity: 0.6;
}

input[type="range"]:not(#tile-size) {
  width: 60px;
}

input[type="number"] {
  width: 20px;
  text-align: center;

  &::-webkit-inner-spin-button {
    display: none;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>

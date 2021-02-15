<template>
  <div>
    <div style="margin: 5px 15vw">
      <label htmlFor="rows">Rader</label>
      <input id="rows" type="number" min="7" max="23" v-model="rows" />
      <!-- <label htmlFor="columns">Kolumner</label>
      <input id="columns" type="number" min="7" step="2" v-model="columns" /> -->
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
        <div v-for="hex in hexRowsEven.flat()" :key="hex.number">
          <ResourceTile :hex="hex" />
        </div>
      </div>
      <div
        class="even-rows-grid"
        :style="
          `grid-template-columns: repeat(${Math.ceil(columns / 2)}, 4.5vw);`
        "
      >
        <div v-for="hex in hexRowsOdd.flat()" :key="hex.number">
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
      columns: 13,
      colors: colors,
      hexRowsEven: [],
      hexRowsOdd: [],
      hexStash: {
        rowsEven: [],
        rowsOdd: [],
      },
      rows: null, //sätts i created()
      // villageDistance: null, //sätts i created()
    };
  },
  computed: {
    // hexCount() {
    //   return this.rows * this.columns - Math.ceil(this.rows / 2);
    // },
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
    randomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
    addHexRows(difference, oldRowTotal) {
      const { hexRowsEven, hexRowsOdd } = this;
      const columns = parseInt(this.columns);
      const newRowTotal = oldRowTotal + difference;
      const previouslyHighestHexNumber = 
        Math.ceil(((oldRowTotal / 2) * (2 * columns - (columns % 2))) / 2);
      let hexNumber = previouslyHighestHexNumber + 1;

      for (let i = oldRowTotal + 1; i <= newRowTotal; i++) {
        const tileRow = [];
        const tileCount = Math.ceil(columns / 2) - (i % 2);

        for (let t = 0; t < tileCount; t++, hexNumber++) {
          const tile = {
            number: hexNumber,
            color: this.randomColor(),
            resources: {
              stone: this.getResource(),
              wood: this.getResource(),
              wheat: this.getResource(),
            },
          };
          tileRow.push(tile);
        }

        i % 2 == 0
          ? (hexRowsOdd[Math.floor(i / 2)] = tileRow)
          : (hexRowsEven[Math.floor(i / 2)] = tileRow);
      }

      // localStorage.setItem("hexData", JSON.stringify({ hexRowsEven, hexRowsOdd }));
    },
    removeHexRows(difference, oldRowTotal) {
      const m = oldRowTotal % 2
      
      for (let i = m; i < difference + m; i++) {
        i % 2 == 0
          ? this.hexRowsOdd.pop()
          : this.hexRowsEven.pop()
      }
    },
    reset() {
      // localStorage.removeItem("hexData");
      localStorage.removeItem("rowCount");
      // localStorage.removeItem("villageDistance");
      window.location.reload();
    },
  },
  watch: {
    rows: {
      handler(newValue, oldValue) {
        if (oldValue == 0 || oldValue == null) return;
        oldValue = parseInt(oldValue);

        const difference = Math.abs(newValue - oldValue);
        const { hexRowsEven, hexRowsOdd } = this;

        if (newValue > oldValue) {
          this.addHexRows(difference, oldValue);
        } else {
          this.removeHexRows(difference, oldValue);

          localStorage.setItem(
            "hexData",
            JSON.stringify({ hexRowsEven, hexRowsOdd })
          );
        }

      localStorage.setItem("rowCount", newValue.toString());
      },
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
    // const savedHexData = JSON.parse(localStorage.getItem("hexData"));
    // const savedVillageDistance = localStorage.getItem("villageDistance");
    const savedRowCount = parseInt(localStorage.getItem("rowCount"));

    // this.villageDistance = savedVillageDistance || 2;
    this.rows = savedRowCount || 17;

    // if (savedHexData) {
    //   this.hexes = savedHexData.hexes;
    //   this.hexStash = savedHexData.hexStash;
    // } else {
    this.addHexRows(this.rows, 0);
    // }
  },
};
</script>

<style lang="scss">
.grid-container {
  position: relative;
  width: min-content;
  margin: 0 auto;
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

<template>
  <div>
    <div style="margin: 5px 15vw">
      <!-- <label htmlFor="rows">Rader</label>
      <input id="rows" type="number" min="7" max="23" v-model="rows" />
      <label htmlFor="columns">Kolumner</label>
      <input id="columns" type="number" min="7" step="2" v-model="columns" /> -->
      <label htmlFor="distance">Distans</label>
      <input
        id="distance"
        type="number"
        min="1"
        :max="villageDistanceMaximum"
        v-model="villageDistance"
      />
      <button @click="reset">Reset</button>
    </div>
    <!-- <ul class="hex-grid__list">
      <li v-for="hex in hexesEvenRows.flat()" :key="hex.number" class="hex-grid__item">
        <div
          class="hex-grid__content"
          :style="`background-color: ${hex.color}9a`"
          :class="{
            center: isCenterHex(hex.number),
            hidden: isOverflowing(hex.number),
            village: isVillageHex(hex.number),
          }"
        >
          <span>{{ hex.number }}</span>
          <PopulatedTile v-if="isCenterHex(hex.number)" type="town" />
          <PopulatedTile v-else-if="isVillageHex(hex.number)" type="village" />
          <ResourceTile v-else :resources="hex.resources" />
        </div>
      </li>
    </ul> -->
    <div class="grid-container">
      <div class="odd-rows-grid">
        <div v-for="hex in hexesEvenRows.flat()" :key="hex.number">
          <ResourceTile :hex="hex" />
        </div>
      </div>
      <div class="even-rows-grid">
        <div v-for="hex in hexesOddRows.flat()" :key="hex.number">
          <ResourceTile :hex="hex" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { colors } from "@/helpers/colors";
// import { isCenter, isVillage } from "@/helpers/tilePositions";
// import PopulatedTile from "@/components/PopulatedTile.vue";
import ResourceTile from "./components/ResourceTile.vue";

export default {
  name: "App",
  components: {
    ResourceTile,
    // PopulatedTile,
  },
  data() {
    return {
      columns: 12, //se till att ändra i CSS-variabeln också om denna ska ändras
      colors: colors,
      hexesEvenRows: [],
      hexesOddRows: [],
      rows: null, //sätts i created()
      villageDistance: null, //sätts i created()
    };
  },
  computed: {
    // rows() {
    //   return this.rows;
    // },
    villageDistanceMaximum() {
      return Math.ceil(this.rows / 4 - 1);
    },
    // hexCount() {
    //   return this.rows * this.columns;
    // },
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
    // isCenterHex(hex) {
    //   const halfHexCount = Math.ceil(this.hexCount / 2);
    //   const { rows, columns } = this;
    //   return isCenter({ hex, halfHexCount, rows, columns });
    // },
    // isVillageHex(hex) {
    //   const halfHexCount = Math.ceil(this.hexCount / 2);
    //   const dist = parseInt(this.villageDistance);
    //   const { rows, columns } = this;

    //   return isVillage({ hex, halfHexCount, dist, rows, columns });
    // },
    layOutHexes(oldValue = 0) {
      const { hexesEvenRows, hexesOddRows, rows, columns } = this;
      const amount = rows * columns - Math.ceil(rows / 2);
      (hexesEvenRows[0] = []), (hexesOddRows[0] = []);

      const breakPoints = [];

      for (let i = 1; i <= rows; i++) {
        breakPoints.push(
          i % 2 == 1
            ? columns - 1 + Math.floor(i / 2) * (2 * columns - 1)
            : Math.floor(i / 2) * (2 * columns - 1)
        );
      }
      let breakPointCounter = 0;
      const rowCounter = () => Math.floor(breakPointCounter / 2);

      for (let hex = 1; hex <= amount; hex++) {
        debugger;
        const tile = {
          number: oldValue + hex,
          color: this.randomColor(),
          resources: {
            stone: this.getResource(),
            wood: this.getResource(),
            wheat: this.getResource(),
          },
        };

        if (hex > breakPoints[breakPointCounter]) {
          breakPointCounter % 2 == 0
            ? hexesEvenRows.push([])
            : hexesOddRows.push([]);

          breakPointCounter++;
        }

        breakPointCounter % 2 == 0
          ? hexesEvenRows[rowCounter()].push(tile)
          : hexesOddRows[rowCounter()].push(tile);
      }

      // localStorage.setItem("hexData", JSON.stringify({ hexesEvenRows, hexesOddRows }));
    },
    reset() {
      // localStorage.removeItem("hexData");
      localStorage.removeItem("rowCount");
      localStorage.removeItem("villageDistance");
      window.location.reload();
    },
  },
  watch: {
    // hexCount: {
    //   handler(newValue, oldValue) {
    //     if (oldValue == 0) return;

    //     const difference = Math.abs(newValue - oldValue);
    //     const { hexesEvenRows, hexesOddRows } = this;

    //     if (newValue > oldValue) {
    //       this.layOutHexes(difference, oldValue);
    //     } else {
    //       for (let i = 1; i <= difference; i++) {
    //         hexStash.push(hexes[oldValue - i]);
    //         hexes.pop();
    //       }

    //       localStorage.setItem(
    //         "hexData",
    //         JSON.stringify({ hexesEvenRows, hexesOddRows })
    //       );
    //     }
    //   },
    // },
    villageDistance(newValue) {
      localStorage.setItem("villageDistance", newValue.toString());
    },
    rows(newValue, oldValue) {
      if (this.villageDistance > this.villageDistanceMaximum)
        this.villageDistance = this.villageDistanceMaximum;

      if (newValue > oldValue && oldValue == 8 && this.villageDistance == 1)
        this.villageDistance = 2;

      localStorage.setItem("rowCount", newValue.toString());
    },
  },
  created() {
    // const savedHexData = JSON.parse(localStorage.getItem("hexData"));
    const savedVillageDistance = localStorage.getItem("villageDistance");
    const savedRowCount = parseInt(localStorage.getItem("rowCount"));

    this.villageDistance = savedVillageDistance || 2;
    this.rows = savedRowCount || 17;

    // if (savedHexData) {
    //   this.hexes = savedHexData.hexes;
    //   this.hexStash = savedHexData.hexStash;
    // } else {
      this.layOutHexes();
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
  grid-template-columns: repeat(11, 4.5vw);
  grid-auto-rows: 3vw;
  gap: 1vw;
}

.even-rows-grid {
  grid-template-columns: repeat(12, 4.5vw);
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

// .center {
//   background-color: #9e0007 !important;
// }

// .village {
//   background-color: #af6c00 !important;
// }

// .hex-grid__list {
//   display: grid;
//   gap: 0.2vw 0;
//   grid-template-columns: repeat(auto-fill, 2vw);
//   list-style-type: none;
//   margin: 2vh calc(10vw - 30px);
// }
</style>

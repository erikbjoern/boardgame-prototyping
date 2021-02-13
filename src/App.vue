<template>
  <div>
    <div style="margin: 5px 15vw">
      <label htmlFor="rows">Rader</label>
      <input id="rows" type="number" min="7" max="23" v-model="visibleRows" />
      <label htmlFor="distance">Distans</label>
      <input
        id="distance"
        type="number"
        min="1"
        :max="villageDistanceMaximum"
        v-model="villageDistance"
      />

      <!-- DENNA GÅR INTE ATT ÄNDRA FÖRRÄN MAN FÅR SASS-VARIABELN TILL JAVASCRIPT -->
      <!-- <label htmlFor="columns">Kolumner</label>
    <input id="columns" type="number" min="7" step="2" v-model="columns" /> -->
    </div>
    <ul class="hex-grid__list">
      <li v-for="hex in hexes" :key="hex" class="hex-grid__item">
        <div
          class="hex-grid__content"
          :style="`background-color: ${randomColor()}9a`"
          :class="{
            center: isCenter(hex),
            hidden: isOverflowing(hex),
            village: isVillageHex(hex),
          }"
        >
          {{ hex }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { colors } from "@/helpers/colors";
import {
  isCenter,
  isVillage,
} from "@/helpers/tilePositions";

export default {
  name: "App",
  data() {
    return {
      columns: 19, //se till att ändra i CSS-variabeln också om denna ska ändras
      colors: colors,
      visibleRows: 16,
      villageDistance: 2, //kan vara 2-4 ungefär
    };
  },
  computed: {
    hexes() {
      const array = new Array(this.hexCount);
      let i = array.length;

      while (i--) {
        array[i] = i + 1;
      }

      return array;
    },
    rows() {
      return Math.ceil(this.visibleRows / 2);
    },
    villageDistanceMaximum() {
      return Math.ceil(this.visibleRows / 4 - 1);
    },
    hexCount() {
      return this.rows * this.columns;
    },
  },
  methods: {
    randomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
    isCenter(hex) {
      const halfHexCount = Math.ceil(this.hexCount / 2);
      const { rows, columns } = this;
      return isCenter({ hex, halfHexCount, rows, columns });
    },
    isOverflowing(hex) {
      return (
        this.visibleRows % 2 == 1 &&
        hex >= this.hexCount - this.columns &&
        hex % 2 == this.rows % 2
      );
    },
    isVillageHex(hex) {
      const halfHexCount = Math.ceil(this.hexCount / 2);
      const dist = parseInt(this.villageDistance);
      const { rows, columns } = this;

      return isVillage({ hex, halfHexCount, dist, rows, columns });
    },
  },
  watch: {
    visibleRows(newValue, oldValue) {
      if (this.villageDistance > this.villageDistanceMaximum)
        this.villageDistance = this.villageDistanceMaximum;

      if (newValue > oldValue && oldValue == 8 && this.villageDistance == 1)
        this.villageDistance = 2;
    },
  },
};
</script>

<style lang="scss">
//se till att ändra i data.columns också om denna ska ändras
$columns: 19;
//denna är inte länkad och behöver inte vara det, så länge den är mer än antalet rader. 20 räcker.
$rows: 20;

body {
  background-color: #ddd;
  margin: 0;
}

input {
  width: 30px;
  margin-left: 5px;
}

.hidden {
  visibility: hidden;
}

.center {
  background-color: #9e0007 !important; 
}

.village {
  background-color: #af6c00 !important;
}

.hex-grid__list {
  display: grid;
  gap: 0.5vw 0.1vw;
  grid-template-columns: repeat(auto-fill, 2vw);
  list-style-type: none;
  margin: 5vh calc(8vw - 30px);
}

.hex-grid__item {
  --counter: 1;
  position: relative;
  grid-column: 1 / span 4;
  grid-row: calc(var(--counter) + var(--counter)) / span 2;
  height: 4.5vw;
  width: 5vw;

  //columns
  @for $i from 1 through $columns {
    &:nth-of-type(#{$columns}n + #{$i}) {
      grid-column: #{$i + $i - 1} / span 4;
      @if $i % 2 == 0 {
        grid-row: calc(var(--counter) + var(--counter) - 1) / span 2;
      }
    }
  }

  //rows
  @for $i from 1 through $rows {
    &:nth-of-type(n + #{$i * $columns + 1}) {
      --counter: #{$i + 1};
    }
  }
}

.hex-grid__content {
  align-items: center;
  color: rgba(255, 255, 255, 0.3);
  justify-content: center;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
  font-size: 1vw;
}
</style>

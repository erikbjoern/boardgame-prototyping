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
      <li v-for="hex in hexes" :key="hex.number" class="hex-grid__item">
        <div
          class="hex-grid__content"
          :style="`background-color: ${hex.color}9a`"
          :class="{
            center: isCenter(hex.number),
            hidden: isOverflowing(hex.number),
            village: isVillageHex(hex.number),
          }"
        >
          {{ hex.number }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { colors } from "@/helpers/colors";
import { isCenter, isVillage } from "@/helpers/tilePositions";

export default {
  name: "App",
  data() {
    return {
      columns: 19, //se till att ändra i CSS-variabeln också om denna ska ändras
      colors: colors,
      hexes: [],
      hexStash: [],
      visibleRows: 18,
      villageDistance: 2, //kan vara 2-4 ungefär
    };
  },
  computed: {
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
    hexCount: {
      handler(newValue, oldValue = 0) {
        const difference = Math.abs(newValue - oldValue);
        const { hexes, hexStash } = this;

        if (newValue > oldValue) {
          for (let i = 1; i <= difference; i++) {
            hexStash.length > 0
              ? hexes.push(hexStash[hexStash.length - 1]) && hexStash.pop()
              : hexes.push({ number: oldValue + i, color: this.randomColor() });
          }
        } else {
          for (let i = 1; i <= difference; i++) {
            hexStash.push(hexes[oldValue - i]);
            hexes.pop();
          }
        }
      },
      immediate: true,
    },
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
  margin: 0 5px;
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
  gap: 0.2vw 0;
  grid-template-columns: repeat(auto-fill, 2vw);
  list-style-type: none;
  margin: 2vh calc(10vw - 30px);
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

<template>
  <div>
    <div style="margin-left: 15vw">
      <label htmlFor="rows">Rader</label>
      <input id="rows" type="number" min="7" max="21" v-model="visibleRows" />
      <label htmlFor="distance" min="1">Distans</label>
      <input id="distance" type="number" :max="villageDistanceMaximum" v-model="villageDistance" />

      <!-- DENNA GÅR INTE ATT ÄNDRA FÖRRÄN MAN FÅR SASS-VARIABELN TILL JAVASCRIPT -->
      <!-- <label htmlFor="columns">Kolumner</label>
    <input id="columns" type="number" min="7" step="2" v-model="columns" /> -->

    </div>
    <ul class="hex-grid__list">
      <li v-for="hex in hexes" :key="hex" class="hex-grid__item">
        <div
          class="hex-grid__content"
          :style="
            `background-color: ${
              isCenter(hex) ? '#9e0007' : `${randomColor()}9a`
            };`
          "
          :class="{
            hidden: isOverflowing(hex),
            village: isVillageHex(hex),
          }"
        >
          {{ hex | hexNumber }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      columns: 19, //se till att ändra i CSS-variabeln också om denna ska ändras
      visibleRows: 18,
      villageDistance: 4, //kan vara 2-4 ungefär
      colors: [
        "#67A05A",
        "#8baf97",
        "#ccae7a",
        "#B18588",
        "#e2c37a",
        "#2C699D",
        "#234F75",
        "#2C815A",
        "#683335",
        "#66384f",
        "#B899AA",
        "#53793D",
        "#AAAAAA",
        "#888888",
        "#432630",
        "#739FB1",
        "#9ba37b",
        "#394823",
        "#70865e",
        "#c1b281",
        "#c1b58f",
        "#76964c",
        "#4f5b40",
        "#5d8264",
        "#7f644f",
        "#775134",
        "#55665a",
        "#6a7c6f",
        "#516060",
      ],
    };
  },
  computed: {
    hexes() {
      const array = new Array(this.hexCount());
      let i = array.length;
      while (i--) {
        array[i] = i;
      }

      return array;
    },
    rows() {
      return Math.ceil(this.visibleRows / 2);
    },
    villageDistanceMaximum() {
      return Math.ceil(this.visibleRows / 4 - 1)
    }
  },
  methods: {
    hexCount() {
      return this.rows * this.columns;
    },
    randomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
    isCenter(hex) {
      return this.rows % 2 
        ? hex == Math.floor(this.hexCount() / 2) 
        : [
          Math.floor(this.hexCount() / 2) - Math.ceil(this.columns / 2),
          Math.floor(this.hexCount() / 2) - Math.ceil(this.columns / 2) + 1,
          Math.floor(this.hexCount() / 2) - Math.ceil(this.columns / 2) - 1,
          Math.floor(this.hexCount() / 2) + Math.floor(this.columns / 2),
        ].some(n => n == hex);
    },
    isOverflowing(hex) {
      return this.visibleRows % 2 == 1
        ? hex >= this.hexCount() - this.columns && hex % 2 !== this.rows % 2
        : false
    },
    isVillageHex(hex) {
      const halfCount = Math.floor(this.hexCount() / 2);
      const dist = parseInt(this.villageDistance)

      return this.rows % 2 == 1 
        ? [

            halfCount - this.columns * (Math.floor(dist / 2) + (dist % 2)) - dist,
            // halfCount - this.columns * (dist - 1) - dist,
            halfCount - this.columns * dist,
            halfCount - this.columns * (Math.floor(dist / 2) + (dist % 2)) + dist,
            halfCount + this.columns * (Math.floor(dist / 2)) + dist,
            halfCount + this.columns * dist,
            halfCount + this.columns * (Math.floor(dist / 2)) - dist,
          ].some((n) => n == hex)
        : [
            halfCount - Math.ceil(this.columns * (dist + 1 - (dist % 2)) / 2) - (dist + 1),
            halfCount - Math.ceil(this.columns * (2 * dist + 1) / 2),
            halfCount - Math.ceil(this.columns * (dist + 1 - (dist % 2)) / 2) + (dist + 1),
            halfCount + Math.floor(this.columns * (dist - 1 + (dist % 2)) / 2) + (dist + 1),
            halfCount + Math.floor(this.columns * (2 * dist + 1) / 2),
            halfCount + Math.floor(this.columns * (dist - 1 + (dist % 2)) / 2) - (dist + 1),
        ].some((n) => n == hex)
    },
  },
  filters: {
    hexNumber(hex) {
      return hex > 184 && (hex - 184) % 2 == 0 ? 184 + (hex - 184) / 2 : hex;
    },
  },
  watch: {
    visibleRows(newValue, oldValue) {

      if (this.villageDistance > this.villageDistanceMaximum) 
        this.villageDistance = this.villageDistanceMaximum

      if (newValue > oldValue && oldValue == 8 && this.villageDistance == 1)
        this.villageDistance = 2
    }
  }
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

.village {
  background-color: #af6c00 !important;
}

.hex-grid__list {
  display: grid;
  gap: 0.5vw 0.1vw;
  grid-template-columns: repeat(auto-fill, 2vw);
  list-style-type: none;
  margin: 5vh 7vw;
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

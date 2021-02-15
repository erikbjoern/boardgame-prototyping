<template>
  <div>
    <div class="input-bar">
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
      <div
        v-for="resource in resourceParameters"
        :key="resource.type"
        class="resource-input"
        :style="
          `background-color: ${(resource.type === 'stone' && '#252627') ||
            (resource.type === 'wood' && '#553a2d') ||
            (resource.type === 'wheat' && '#928d5c')}`
        "
      >
        <div>
          <label> max</label>
          <input type="number" v-model="resource.max" />
        </div>
        <div>
          <label> chans</label>
          <input type="number" v-model="resource.chance" />
          <span>%</span>
        </div>
      </div>
      <button @click="reset" style="margin-left: auto;">Reset</button>

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
    </ul>
  </div>
</template>

<script>
import { colors } from "@/helpers/colors";
import { isCenter, isVillage } from "@/helpers/tilePositions";
import ResourceTile from "@/components/ResourceTile";
import PopulatedTile from "@/components/PopulatedTile.vue";

export default {
  name: "App",
  components: {
    ResourceTile,
    PopulatedTile,
  },
  data() {
    return {
      columns: 19, //se till att ändra i CSS-variabeln också om denna ska ändras
      colors: colors,
      hexes: [],
      hexStash: [],
      visibleRows: null, //sätts i created()
      villageDistance: null, //sätts i created()
      resourceParameters: [
        {
          type: "stone",
          max: 9,
          chance: 25,
        },
        {
          type: "wood",
          max: 9,
          chance: 25,
        },
        {
          type: "wheat",
          max: 9,
          chance: 25,
        },
      ],
      previousResourceParameters: []
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
    randomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
    isCenterHex(hex) {
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
    layOutHexes(amount, oldValue = 0) {
      const { hexes, hexStash } = this;

      for (let i = 1; i <= amount; i++) {
        hexStash.length > 0
          ? hexes.push(hexStash[hexStash.length - 1]) && hexStash.pop()
          : hexes.push({
              number: oldValue + i,
              color: this.randomColor(),
              resources: this.getResources(),
            });
      }

      localStorage.setItem("hexData", JSON.stringify({ hexes, hexStash }));
    },
    reset() {
      localStorage.removeItem("villageDistance");
      localStorage.removeItem("rowCount");
      localStorage.removeItem("hexData");
      localStorage.removeItem("resourceParameters");
      window.location.reload();
    },
  },
  watch: {
    hexCount: {
      handler(newValue, oldValue) {
        if (oldValue == 0) return;

        const difference = Math.abs(newValue - oldValue);
        const { hexes, hexStash } = this;

        if (newValue > oldValue) {
          this.layOutHexes(difference, oldValue);
        } else {
          for (let i = 1; i <= difference; i++) {
            hexStash.push(hexes[oldValue - i]);
            hexes.pop();
          }

          localStorage.setItem("hexData", JSON.stringify({ hexes, hexStash }));
        }
      },
    },
    resources: {
      handler(newValue) {
        let detectedChange;
        newValue.forEach((resource) =>
          Object.entries(resource).forEach(([k, v], index, resource) => {
            if (typeof v === "string" && k !== "type") {
              detectedChange = { resource, index };
              return;
            }
          })
        );

        debugger;

        localStorage.setItem("resourceParameters", JSON.stringify(newValue));
      },
      deep: true,
    },
    villageDistance(newValue) {
      localStorage.setItem("villageDistance", newValue.toString());
    },
    visibleRows(newValue, oldValue) {
      if (this.villageDistance > this.villageDistanceMaximum)
        this.villageDistance = this.villageDistanceMaximum;

      if (newValue > oldValue && oldValue == 8 && this.villageDistance == 1)
        this.villageDistance = 2;

      localStorage.setItem("rowCount", newValue.toString());
    },
  },
  created() {
    const savedVillageDistance = localStorage.getItem("villageDistance");
    const savedRowCount = parseInt(localStorage.getItem("rowCount"));
    const savedHexData = JSON.parse(localStorage.getItem("hexData"));
    const savedResourceParameters = JSON.parse(
      localStorage.getItem("resourceParameters")
    );

    this.villageDistance = savedVillageDistance || 2;
    this.visibleRows = savedRowCount || 17;

    if (savedHexData) {
      this.hexes = savedHexData.hexes;
      this.hexStash = savedHexData.hexStash;
    } else {
      this.layOutHexes(this.hexCount);
    }

    if (savedResourceParameters) {
      this.resourceParameters = savedResourceParameters;
    }
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

input,
button {
  font-size: 1vw;
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
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
  font-size: 0.7vw;
}

.hex-grid__content > * {
  position: relative;
  bottom: 0.2vw;
}

.input-bar {
  display: flex;
  font-size: 1vw;
  margin: 5px 11.5vw;
  width: 76vw;
}

.resource-input {
  border-radius: 2px;
  color: white;
  display: flex;
  padding: 0 2px;
  margin: 0 4px;

  & span {
    margin-left: -4px;
  }

  & input {
    width: 15px;
  }

  & input::-webkit-inner-spin-button,
  & input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>

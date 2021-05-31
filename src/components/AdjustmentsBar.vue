<template>
  <div class="input-bar-container">
    <div class="board-inputs">
      <AdjustmentsBarInput
        v-for="property in gridProperties"
        :key="property.name"
        :property="property"
      />
      <div class="buttons-box">
        <button @click="resetAdjustments">Återställ ändringar</button>
        <button @click="center">Centrera bräde</button>
        <button @click="resetTiles">Förnya brickor</button>
        <button v-if="!resourceInputsIsVisible" @click="showResourceInputs">
          Hantera resurser
        </button>
        <button v-else id="close" @click="hideResourceInputs">Stäng</button>
      </div>
    </div>
    <div v-if="resourceInputsIsVisible" class="resource-inputs">
      <div
        style="display: flex; justify-content: space-between; padding-right: 5px;"
      >
        <label
          ><input
            type="radio"
            name="mode"
            :checked="$store.state.resources.distributionMode == 'INDIVIDUAL'"
            @click="toggleResourceDistributionMode"
          />Individuella värden</label
        >
        <label
          ><input
            type="radio"
            name="mode"
            :checked="$store.state.resources.distributionMode == 'FRACTION'"
            @click="toggleResourceDistributionMode"
          />Fördelning</label
        >
      </div>
      <div style="height: 20px;">
        <label v-if="$store.state.resources.distributionMode == 'INDIVIDUAL'"
          ><input
            type="checkbox"
            :checked="$store.state.resources.visibleValues"
            @click="toggleResourceValuesVisibility"
          />Visa värden</label
        >
      </div>
      <AdjustmentsBarResourceInput
        v-for="resource in resourceParameters"
        :key="resource.type"
        :resource="resource"
        :mode="$store.state.resources.distributionMode"
      />
    </div>
  </div>
</template>

<script>
import AdjustmentsBarInput from "@/components/AdjustmentsBarInput.vue";
import AdjustmentsBarResourceInput from "@/components/AdjustmentsBarResourceInput.vue";
import { mapActions, mapState } from "vuex";
import { scrollToCenter } from "@/helpers/scroll";

export default {
  components: {
    AdjustmentsBarInput,
    AdjustmentsBarResourceInput,
  },
  name: "AdjustmentsBar",
  data() {
    return {
      resourceInputsIsVisible: false,
      gridProperties: [
        {
          name: "rowCount",
          min: 3,
          max: 23,
          text: "Rader",
          showValue: true,
          multiple: 1,
          flexGrow: 10,
        },
        {
          name: "columnCount",
          min: 3,
          max: 23,
          text: "Kolumner",
          showValue: true,
          multiple: 1,
          flexGrow: 10,
        },
        {
          name: "tileSize",
          min: 60,
          max: 225,
          text: "Storlek",
          multiple: 15,
          flexGrow: 7,
        },
        {
          name: "gap",
          min: 0,
          max: 20,
          text: "Mellanrum",
          multiple: 70,
          flexGrow: 1,
        },
        {
          name: "tileBorderWidth",
          min: 0,
          max: 20,
          text: "Bård",
          multiple: 1,
          flexGrow: 1,
        },
      ],
    };
  },
  computed: mapState({
    resourceParameters: (state) => state.resources.parameters,
  }),
  methods: {
    scrollToCenter,
    ...mapActions(["resetTiles", "resetAdjustments"]),
    center(e) {
      this.scrollToCenter();
      e.target.blur();
    },
    showResourceInputs() {
      this.resourceInputsIsVisible = true;
    },
    hideResourceInputs(e) {
      this.resourceInputsIsVisible = false;
      e.target.blur();
    },
    toggleResourceValuesVisibility() {
      this.$store.commit("toggleResourceValuesVisibility");
    },
    toggleResourceDistributionMode() {
      this.$store.commit("toggleResourceDistributionMode");
    },
  },
};
</script>

<style scoped>
.input-bar-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  left: 50%;
  padding: 0.5vw;
  position: fixed;
  top: 1vw;
  transform: translateX(-50%);
  width: 90vw;
  z-index: 1000;
}

.board-inputs {
  background-color: #efefef55;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  gap: 10px;
  justify-content: flex-end;
  padding: 0.5vw;
  width: 90vw;
}

.board-inputs .buttons-box {
  align-items: stretch;
  background-color: transparent;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  grid-template-columns: 1fr 1fr;
  justify-content: flex-end;
  width: 284px;
  z-index: 1001;
}

.board-inputs .buttons-box button {
  color: #071b35;
  transition: all 0.2s;
  width: 140px;
  height: 30px;
}

.board-inputs .buttons-box button:hover {
  background-color: #092446d3;
  color: #fefefeee;
  opacity: 1;
}

@keyframes expand {
  from {
    max-height: 20px;
  }
}

.resource-inputs {
  animation: expand 0.15s forwards;
  background-color: #092446ef;
  border-radius: 4px 0 4px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 170px;
  min-width: 170px;
  padding: 20px;
  position: relative;
  right: 0.5vw;
  top: -0.25vw;
}

.resource-inputs::before {
  content: "";
  background-color: #092446ef;
  border-radius: 3px 3px 0 0;
  height: calc(30px + 0.25vw);
  position: absolute;
  right: 0;
  top: calc(-30px - 0.25vw);
  width: 140px;
}

.resource-inputs::after {
  content: "";
  border-bottom: 3px solid #092446ef;
  border-left: 3px solid transparent;
  border-top: 3px solid transparent;
  height: 0px;
  position: absolute;
  right: 139px;
  top: -6px;
  width: 0px;
}

.resource-input div#field-list {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input,
button {
  background-color: #eef1ef;
  border-radius: 3px;
  border: 1px solid #09244643;
  box-shadow: 1px 1px 3px #09244622;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

label {
  user-select: none;
  color: whitesmoke;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 300;
  font-size: 0.85rem;
}

button:hover {
  cursor: pointer;
  opacity: 0.6;
}

button#close {
  background-color: transparent;
  color: white;
  border: none;
}

button#close:focus {
  outline: none;
}
</style>

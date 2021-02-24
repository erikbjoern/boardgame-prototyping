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
      <AdjustmentsBarResourceInput
        v-for="resource in resourceParameters"
        :key="resource.type"
        :resource="resource"
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
        },
        {
          name: "columnCount",
          min: 3,
          max: 23,
          text: "Kolumner",
          showValue: true,
          multiple: 1,
        },
        {
          name: "tileSize",
          min: 12,
          max: 45,
          text: "Storlek",
          multiple: 3,
        },
        {
          name: "gap",
          min: 0,
          max: 20,
          text: "Mellanrum",
          multiple: 70,
        },
        {
          name: "tileBorderWidth",
          min: 0,
          max: 20,
          text: "Bård",
          multiple: 1,
        },
      ],
    };
  },
  computed: mapState({
    resourceParameters: state => state.resources.parameters,
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
  },
};
</script>

<style lang="scss" scoped>
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

  .buttons-box {
    display: flex;
    flex-wrap: wrap;
    background-color: transparent;
    grid-template-columns: 1fr 1fr;
    justify-content: flex-end;
    align-items: stretch;
    gap: 4px;
    z-index: 1001;
    flex: 1 0 280px;

    & button {
      color: #071b35;
      transition: all 0.3s;
      width: 140px;
      height: 30px;

      &:hover {
        background-color: #092446d3;
        color: #fefefeee;
        opacity: 1;
      }
    }
  }
}

@keyframes expand {
  from {
    max-height: 20px;
  }
}

.resource-inputs {
  animation: expand 0.15s forwards;
  background-color: #092446e3;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 8px;
  position: relative;
  right: 0.5vw;
  top: -0.25vw;
  border-radius: 4px 0 4px 4px;
  min-width: 170px;
  max-height: 120px;

  &::before {
    content: "";
    position: absolute;
    top: calc(-30px - 0.25vw);
    right: 0;
    height: calc(30px + 0.25vw);
    width: 140px;
    background-color: #092446e3;
    border-radius: 3px 3px 0 0;
  }

  &::after {
    content: "";
    border-left: 3px solid transparent;
    border-top: 3px solid transparent;
    border-bottom: 3px solid #092446e3;
    width: 0px;
    height: 0px;
    position: absolute;
    top: -6px;
    right: 140px;
  }
}

input,
button {
  background-color: #eef1ef;
  border-radius: 3px;
  border: 1px solid #09244643;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  box-shadow: 1px 1px 3px #09244622;
}

button:hover {
  cursor: pointer;
  opacity: 0.6;
}

button#close {
  background-color: transparent;
  color: white;
  border: none;

  &:focus {
    outline: none;
  }
}
</style>

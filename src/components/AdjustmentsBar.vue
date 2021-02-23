<template>
  <div class="inputs-bar">
    <AdjustmentsBarInput
      v-for="property in properties"
      :key="property.name"
      :property="property"
    />
    <div class="buttons-box">
      <button @click="resetAdjustments">Återställ ändringar</button>
      <button @click="resetTiles">Förnya brickor</button>
      <button @click="center">Centrera bräde</button>
    </div>
  </div>
</template>

<script>
import AdjustmentsBarInput from "@/components/AdjustmentsBarInput.vue";
import { mapActions } from "vuex";
import { scrollToCenter } from "@/helpers/scroll";

export default {
  components: { AdjustmentsBarInput },
  name: "AdjustmentsBar",
  data() {
    return {
      properties: [
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
          name: "borderWidth",
          min: 0,
          max: 20,
          text: "Bård",
          multiple: 1,
        },
      ],
    };
  },
  methods: {
    scrollToCenter,
    ...mapActions(["resetTiles", "resetAdjustments"]),
    center(e) {
      this.scrollToCenter();
      e.target.blur();
    },
  },
};
</script>

<style lang="scss" scoped>
.inputs-bar {
  background-color: #efefef55;
  border-radius: 5px;
  display: inline-flex;
  flex-wrap: wrap;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  gap: 10px;
  justify-content: flex-end;
  left: 50%;
  padding: 0.5vw;
  position: fixed;
  top: 1vw;
  transform: translateX(-50%);
  width: 90vw;
  z-index: 1000;

  .buttons-box {
    display: flex;
    background-color: transparent;
    flex-direction: row;
    flex-basis: 100px;
    align-items: stretch;
    gap: 10px;

    & button {
      flex: 1 1 auto;
      color: #071b35;
      transition: all .3s;

      &:hover {
        background-color: #092446c3;
        color: #fefefeee;
        opacity: 1;
      }
    }
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

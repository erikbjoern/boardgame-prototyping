<template>
  <div class="inputs-bar">
    <InputBox
      v-for="property in properties"
      :key="property.name"
      :property="property"
    />
    <button @click="resetAdjustments">Återställ ändringar</button>
    <button @click="resetTiles">Förnya brickor</button>
  </div>
</template>

<script>
import InputBox from "@/components/base/InputBox.vue";
import { mapActions } from 'vuex';

export default {
  components: { InputBox },
  name: "InputsBar",
  data() {
    return {
      properties: [
        {
          name: "rowCount",
          min: 3,
          max: 23,
          text: "Rader",
          showValue: true,
          multiple: 1
        },
        {
          name: "columnCount",
          min: 3,
          max: 23,
          text: "Kolumner",
          showValue: true,
          multiple: 1
        },
        {
          name: "tileSize",
          min: 12,
          max: 50,
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
          multiple: 1
        },
      ],
    };
  },
  methods: mapActions(["resetTiles", "resetAdjustments"]),
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

  & > div {
    align-items: center;
    background-color: #aaaaaa55;
    border-radius: 3px;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 5px;
    padding: 3px;
  }
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
</style>

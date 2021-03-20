<template>
  <div
    class="resource-input"
    :style="{ backgroundColor: colors[resource.type]}"
  >
    <WoodIcon v-if="resource.type == 'wood'" />
    <StoneIcon v-if="resource.type == 'stone'" />
    <WheatIcon v-if="resource.type == 'wheat'" />
    <div>
      <label> max</label>
      <input
        type="number"
        id="max"
        :value="resource.max"
        @change="handleChange"
        @keydown="keydownHandler"
      />
    </div>
    <div>
      <label> chans</label>
      <input
        type="number"
        id="chance"
        :value="resource.chance"
        @change="handleChange"
        @keydown="keydownHandler"
      />
      <span>%</span>
    </div>
  </div>
</template>

<script>
import WoodIcon from "@/assets/icons/log.svg";
import StoneIcon from "@/assets/icons/stone-block.svg";
import WheatIcon from "@/assets/icons/wheat.svg";
import colors from "@/assets/colors";

export default {
  name: "AdjustmentsBarResourceInput",
  components: {
    WoodIcon,
    StoneIcon,
    WheatIcon,
  },
  data() {
    return {
      colors
    }
  },
  props: ['resource'],
  methods: {
    handleChange(e) {
      const value = parseInt(e.target.value)
      const resource = this.resource
      const property = e.target.id;

      if (!value) {
        e.target.value = resource[property]
        return
      }

      this.$store.commit("setResourceParameter", { value, resource, property });
    },
    keydownHandler(e) {
      const value = parseInt(e.target.value)
      const resource = this.resource
      const property = e.target.id;

      if (e.which == 27 || e.code == "Escape") {
        e.target.value = resource[property]
        e.target.blur();
      }

      if (e.which == 13 || e.code == "Enter") {
        this.$store.commit("setResourceParameter", { value, resource, property });
        e.target.blur()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
  width: 20px !important;
  height: 20px !important;
  fill: transparent;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
}

.resource-input {
  animation: fadeIn .2s forwards;
  border-radius: 2px;
  color: white;
  display: flex;
  padding: 4px;
  gap: 10px;
  margin: 0 4px;
  opacity: 1;

  & input {
    width: 25px;
    margin-left: 3px;
  }

  & input::-webkit-inner-spin-button,
  & input::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
}
</style>

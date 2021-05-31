<template>
  <div
    class="resource-input"
    :style="{
      backgroundColor:
        distributionMode == 'FRACTION'
          ? colors.backgrounds[resource.type]
          : colors.resources[resource.type],
    }"
  >
    <WoodIcon v-if="resource.type == 'wood'" />
    <StoneIcon v-if="resource.type == 'stone'" />
    <WheatIcon v-if="resource.type == 'wheat'" />
    <div v-if="mode == 'INDIVIDUAL'">
      <label> max</label>
      <input
        type="number"
        name="max"
        :value="resource.max"
        @change="handleChange"
        @keydown="keydownHandler"
      />
    </div>
    <div v-if="mode == 'INDIVIDUAL'">
      <label> chans</label>
      <input
        type="number"
        name="chance"
        :value="resource.chance"
        @change="handleChange"
        @keydown="keydownHandler"
      />
      <span>%</span>
    </div>
    <div v-if="mode == 'FRACTION'">
      <label> fördelning</label>
      <input
        type="text"
        name="fraction"
        :value="resource.fraction"
        @change="handleChange"
        @keydown="keydownHandler"
      />
      <span style="margin-left: 2px;">
        / {{ $store.getters.resourceDistributionSum }}</span
      >
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
      colors,
    };
  },
  props: ["resource", "mode"],
  computed: {
    distributionMode() {
      return this.$store.state.resources.distributionMode;
    },
  },
  methods: {
    handleChange(e) {
      const value = parseInt(e.target.value);
      const resource = this.resource;
      const property = e.target.name;

      if (!value) {
        e.target.value = resource[property];
        return;
      }

      this.$store.commit("setResourceParameter", { value, resource, property });
    },
    keydownHandler(e) {
      const value =
        property !== "fraction" ? parseInt(e.target.value) : e.target.value;
      const resource = this.resource;
      const property = e.target.name;

      if (e.which == 27 || e.code == "Escape") {
        e.target.value = resource[property];
        e.target.blur();
      }

      if (e.which == 13 || e.code == "Enter") {
        this.$store.commit("setResourceParameter", {
          value,
          resource,
          property,
        });
        e.target.blur();
      }
    },
  },
};
</script>

<style scoped>
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
  animation: fadeIn 0.2s forwards;
  border-radius: 2px;
  color: #ffffff;
  display: flex;
  padding: 4px;
  gap: 10px;
  margin: 0 4px;
  opacity: 1;
}
.resource-input input {
  width: 25px;
  margin-left: 3px;
}
.resource-input input::-webkit-inner-spin-button,
.resource-input input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>

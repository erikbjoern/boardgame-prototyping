<template>
  <div class="input-container" :style="{ flex: `${property.flexGrow} 1 auto` }">
    <label :htmlFor="property.name">
      {{ property.text }}
    </label>
    <div class="inputs">
      <div
        @mousedown="decreaseValueStart()"
        :class="{ disabled: propertyValue == property.min }"
      >
        <span>−</span>
      </div>
      <input
        v-if="property.showValue"
        id="show-value"
        type="number"
        :min="property.min"
        :max="property.max"
        v-model.number="inputFieldValue"
        @blur="setPropertyValue"
        @keydown="keydownHandler"
      />
      <input
        v-if="!property.showValue"
        :id="property.name"
        type="range"
        :min="property.min"
        :max="property.max"
        v-model.number="propertyValue"
      />
      <div
        @mousedown="increaseValueStart()"
        :class="{ disabled: propertyValue == property.max }"
      >
        <span>+</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsInputGrid",
  props: {
    property: {
      name: String,
      min: Number,
      max: Number,
      text: String,
      multiple: Number,
      showValue: Boolean,
    },
  },
  computed: {
    inputFieldValue: {
      get() {
        return this.propertyValue;
      },
      set() {
        null;
      },
    },
    propertyValue: {
      get() {
        const value = this.$store.state.grid[this.property.name];
        return value * this.property.multiple;
      },
      set(value) {
        this.$store.commit(
          `set${this.pascalCasedPropertyName}`,
          value / this.property.multiple
        );
      },
    },
    pascalCasedPropertyName() {
      const p = this.property.name;
      return p[0].toUpperCase() + p.slice(1, p.length);
    },
  },
  methods: {
    clearTimeouts() {
      clearTimeout(this.willDecrease);
      clearInterval(this.isDecreasing);
      clearTimeout(this.willIncrease);
      clearInterval(this.isIncreasing);
      window.removeEventListener("mouseup", this.clearTimeouts);
    },
    decreaseValueStart() {
      this.propertyValue > this.property.min && (this.propertyValue -= 2);

      this.willDecrease = setTimeout(() => {
        this.isDecreasing = setInterval(() => {
          this.propertyValue > this.property.min
            ? (this.propertyValue -= 2)
            : clearInterval(this.isDecreasing);
        }, 70);
      }, 300);

      window.addEventListener("mouseup", this.clearTimeouts);
    },
    increaseValueStart() {
      this.propertyValue < this.property.max && (this.propertyValue += 2);

      this.willIncrease = setTimeout(() => {
        this.isIncreasing = setInterval(() => {
          this.propertyValue < this.property.max
            ? (this.propertyValue += 2)
            : clearInterval(this.isIncreasing);
        }, 70);
      }, 300);

      window.addEventListener("mouseup", this.clearTimeouts);
    },
    keydownHandler(e) {
      if (e.which == 27 || e.code == "Escape") {
        const propertyValue = this.propertyValue;
        e.target.blur();
        this.propertyValue = propertyValue;
      }

      if (e.which == 13 || e.code == "Enter") {
        e.target.blur(); //triggers this.setPropertyValue()
      }
    },
    setPropertyValue(e) {
      this.propertyValue = parseInt(e.target.value) || this.propertyValue;
    },
  },
};
</script>

<style scoped>
.input-container {
  align-items: center;
  justify-content: center;
  background-color: #00000023;
  border-radius: 3px;
  box-shadow: 1px 1px 3px #00000022;
  color: #1d232a;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 3px;
  opacity: 0.85;
  transition: all 0.2s;
}
.input-container:hover {
  background-color: #000000d3;
  color: #fefefeee;
  opacity: 1;
}
.input-container:hover input#show-value {
  color: #fefefeee;
}

.inputs {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  user-select: none;
}
.inputs > div {
  background-color: #00000023;
  border-radius: 5px;
  border: outset #4284cf;
  cursor: pointer;
  height: 1.2rem;
  padding: 0 2px;
}
.inputs > div > span {
  bottom: 0.3rem;
  position: relative;
}
.inputs > div:hover {
  background-color: #274e7b;
  color: #4e8dd4;
}
.inputs > div:active {
  border: inset #4284cf;
}
.inputs > div.disabled {
  opacity: 0.6;
  pointer-events: none;
}

input[type="range"]#gap,
input[type="range"]#tileBorderWidth {
  width: 60px;
}
label {
  font-size: 85%;
  letter-spacing: 0.5px;
}
input#show-value {
  background-color: transparent;
  border-radius: 3px;
  border: 1px solid #00000082;
  margin: 5px;
  text-align: center;
  width: 2rem;
}
input#show-value::-webkit-inner-spin-button {
  display: none;
}
input#show-value:hover,
input#show-value:focus {
  background-color: #22222222;
}
</style>

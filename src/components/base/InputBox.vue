<template>
  <div>
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
  name: "InputBox",
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
        const value = this.$store.state[this.property.name];
        return value * this.property.multiple;
      },
      set(value) {
        this.$store.commit(
          `set${this.pascalCasedPropertyName}`,
          (value / this.property.multiple)
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
      this.propertyValue > this.property.min && (this.propertyValue -= 1);

      this.willDecrease = setTimeout(() => {
        this.isDecreasing = setInterval(() => {
          this.propertyValue > this.property.min
            ? (this.propertyValue -= 1)
            : clearInterval(this.isDecreasing);
        }, 70);
      }, 300);

      window.addEventListener("mouseup", this.clearTimeouts);
    },
    increaseValueStart() {
      this.propertyValue < this.property.max && (this.propertyValue += 1);

      this.willIncrease = setTimeout(() => {
        this.isIncreasing = setInterval(() => {
          this.propertyValue < this.property.max
            ? (this.propertyValue += 1)
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

<style lang="scss" scoped>
.inputs {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  user-select: none;

  & > div {
    background-color: #eeeeee;
    border-radius: 4px;
    border: outset;
    cursor: pointer;
    height: 0.8em;
    padding: 0 2px;

    & > span {
      bottom: 0.2em;
      position: relative;
    }

    &:hover {
      background-color: #ffffffff;
    }

    &:active {
      border: inset;
    }

    &.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
}

input[type="range"]#gap,
input[type="range"]#borderWidth {
  width: 60px;
}

label {
  font-size: 85%;
}

input#show-value {
  background-color: transparent;
  border: 1px solid slategray;
  border-radius: 3px;
  margin: 5px;
  text-align: center;
  width: 1rem;
  &::-webkit-inner-spin-button {
    display: none;
  }

  &:hover,
  &:focus {
    background-color: #22222222;
  }
}
</style>

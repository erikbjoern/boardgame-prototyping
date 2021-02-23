<template>
  <div class="container">
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
  name: "AdjustmentsBarInput",
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
.container {
  align-items: center;
  background-color: #09244623;
  border-radius: 3px;
  box-shadow: 1px 1px 3px #09244622;
  color: #1d232a;
  display: flex;
  flex-direction: column;
  flex: 10 1 auto;
  gap: 5px;
  padding: 3px;
  opacity: 0.85;
  transition: all .3s;

  &:hover {
    background-color: #092446d3;
    color: #fefefeee;
    opacity: 1;

    & input#show-value {
      color: #fefefeee;
    }
  }
}

.inputs {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  user-select: none;

  & > div {
    background-color: #09244623;
    border-radius: 5px;
    border: outset #4284cf;
    cursor: pointer;
    height: 0.8em;
    padding: 0 2px;

    & > span {
      bottom: 0.2em;
      position: relative;
    }

    &:hover {
      background-color: #274e7b;
      color: #4e8dd4;
    }

    &:active {
      border: inset #4284cf;
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
  letter-spacing: .5px;
}

input#show-value {
  background-color: transparent;
  border-radius: 3px;
  border: 1px solid #09244682;
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

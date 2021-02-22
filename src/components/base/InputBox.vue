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
      <span 
        v-if="property.valueInText"
        id="show-value"
      >
        {{ propertyValue }}
      </span>
      <input
        v-show="!property.valueInText"
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
      double: Boolean,
      valueInText: Boolean,
    },
  },
  computed: {
    propertyValue: {
      get() {
        const value = this.$store.state[this.property.name];
        return this.property.double ? value * 2 : value;
      },
      set(val) {
        const value = this.property.double ? val / 2 : val;
        this.$store.commit(`set${this.pascalCasedPropertyName}`, value);
      },
    },
    pascalCasedPropertyName() {
      const p = this.property.name;
      return p[0].toUpperCase() + p.slice(1, p.length);
    },
  },
  methods: {
    clearTimeouts() {
      clearTimeout(this.willDecrease)
      clearInterval(this.isDecreasing)
      clearTimeout(this.willIncrease)
      clearInterval(this.isIncreasing)
      window.removeEventListener("mouseup", this.clearTimeouts)
    },
    decreaseValueStart() {
      this.propertyValue > this.property.min && (this.propertyValue -= 1)

      this.willDecrease = setTimeout(() => {
        this.isDecreasing = setInterval(() => {
          this.propertyValue > this.property.min 
            ? (this.propertyValue -= 1)
            : clearInterval(this.isDecreasing)
        }, 70)
      }, 300)
      
      window.addEventListener("mouseup", this.clearTimeouts)
    },
    increaseValueStart() {
      this.propertyValue < this.property.max && (this.propertyValue += 1)

      this.willIncrease = setTimeout(() => {
        this.isIncreasing = setInterval(() => {
          this.propertyValue < this.property.max 
            ? (this.propertyValue += 1)
            : clearInterval(this.isIncreasing)
        }, 70)
      }, 300)

      window.addEventListener("mouseup", this.clearTimeouts)
    },
  }
};
</script>

<style lang="scss" scoped>
.inputs {
  display: inline-flex;
  align-items: center;
  gap: 2px;

  & > div {
    background-color: #eeeeee;
    border-radius: 4px;
    border: outset;
    cursor: pointer;
    height: 0.8em;
    padding: 0 2px;
    user-select: none;

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

#show-value {
  margin: 5px;
  text-align: center;
  width: 1rem;
}
</style>

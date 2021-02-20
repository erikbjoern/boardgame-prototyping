<template>
  <div>
    <label :htmlFor="property.name">
      <span v-if="property.showValue">
        {{ propertyValue + " " }}
      </span>
      {{ property.text }}
    </label>
    <div class="inputs">
      <div
        @click="propertyValue > property.min && (propertyValue -= 1)"
        :class="{ disabled: propertyValue == property.min }"
      >
        <span>−</span>
      </div>
      <input
        :id="property.name"
        type="range"
        :min="property.min"
        :max="property.max"
        v-model.number="propertyValue"
      />
      <div
        @click="propertyValue < property.max && (propertyValue += 1)"
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
      showValue: Boolean,
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
</style>

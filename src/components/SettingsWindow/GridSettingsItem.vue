<template>
  <div class="w-full flex flex-col justify-between items-center">
    <label :htmlFor="property.name">
      {{ property.text }}
    </label>
    <div class="flex flex-1 items-center">
      <div
        @mousedown="decreaseValueStart()"
        :class="{ disabled: propertyValue == property.min }"
        class="cursor-pointer text-lg h-5 w-5 grid place-items-center rounded hover:bg-black transition-colors"
      >
        <span class="leading-none relative bottom-[2.5px] select-none">&minus;</span>
      </div>
      <input
        v-if="property.showValue"
        class="w-12 rounded bg-gray-900 text-center mx-2"
        type="number"
        :min="property.min"
        :max="property.max"
        v-model.number="inputFieldValue"
        @blur="setPropertyValue"
        @keydown="keydownHandler"
      />
      <input
        class="mx-2"
        v-if="!property.showValue"
        :id="property.name"
        type="range"
        :min="property.min"
        :max="property.max"
        v-model.number="propertyValue"
      />
      <div
        @mousedown="increaseValueStart()"
        :class="{ 'opacity-50': propertyValue == property.max }"
        class="cursor-pointer text-lg h-5 w-5 grid place-items-center rounded hover:bg-black transition-colors"
      >
        <span class="leading-none relative bottom-[2.5px] select-none">&plus;</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridSettingsItem',
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
        return this.propertyValue
      },
      set() {
        null
      },
    },
    propertyValue: {
      get() {
        const value = this.$store.state.grid[this.property.name]
        return value * this.property.multiple
      },
      set(value) {
        this.$store.commit(
          `set${this.pascalCasedPropertyName}`,
          value / this.property.multiple
        )
      },
    },
    pascalCasedPropertyName() {
      const p = this.property.name
      return p[0].toUpperCase() + p.slice(1, p.length)
    },
  },
  methods: {
    clearTimeouts() {
      clearTimeout(this.willDecrease)
      clearInterval(this.isDecreasing)
      clearTimeout(this.willIncrease)
      clearInterval(this.isIncreasing)
      window.removeEventListener('mouseup', this.clearTimeouts)
    },
    decreaseValueStart() {
      this.propertyValue > this.property.min && (this.propertyValue -= 2)

      this.willDecrease = setTimeout(() => {
        this.isDecreasing = setInterval(() => {
          this.propertyValue > this.property.min
            ? (this.propertyValue -= 2)
            : clearInterval(this.isDecreasing)
        }, 70)
      }, 300)

      window.addEventListener('mouseup', this.clearTimeouts)
    },
    increaseValueStart() {
      this.propertyValue < this.property.max && (this.propertyValue += 2)

      this.willIncrease = setTimeout(() => {
        this.isIncreasing = setInterval(() => {
          this.propertyValue < this.property.max
            ? (this.propertyValue += 2)
            : clearInterval(this.isIncreasing)
        }, 70)
      }, 300)

      window.addEventListener('mouseup', this.clearTimeouts)
    },
    keydownHandler(e) {
      if (e.which == 27 || e.code == 'Escape') {
        const propertyValue = this.propertyValue
        e.target.blur()
        this.propertyValue = propertyValue
      }

      if (e.which == 13 || e.code == 'Enter') {
        e.target.blur() //triggers this.setPropertyValue()
      }
    },
    setPropertyValue(e) {
      this.propertyValue = parseInt(e.target.value) || this.propertyValue
    },
  },
}
</script>

<style scoped>
input::-webkit-inner-spin-button {
  display: none;
}
</style>

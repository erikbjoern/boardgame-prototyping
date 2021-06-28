<template>
  <textarea
    @mousedown="e => $emit('dragstart', e, item)"
    @mouseup="e => $emit('dragend', e)"
    class="rounded-[1.5rem] absolute z-[999]"
    :class="item.text.length ? 'p-6' : 'w-12 h-12'"
    :style="{
      backgroundColor: item.color,
      color: item.invertedColorGrayScale,
      top: offsetTop,
      left: offsetLeft,
    }"
    v-model="itemText"
    @focus="$store.commit('inputFocused')"
    @blur="$store.commit('inputBlurred')"
  ></textarea>
</template>

<script>
export default {
  name: 'DraggableItem',
  props: {
    item: {
      id: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      invertedColorGrayScale: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: false,
      },
      text: {
        type: String,
        required: false,
      },
      position: {
        x: {
          type: Number,
          required: true,
        },
        y: {
          type: Number,
          required: true,
        },
      },
    },
    temporaryPosition: {
      type: [Object, null],
    },
  },
  computed: {
    offsetTop() {
      return `${this.temporaryPosition?.y ?? this.item.position?.y}px`
    },
    offsetLeft() {
      return `${this.temporaryPosition?.x ?? this.item.position?.x}px`
    },
    itemText: {
      get() {
        return this.item.text
      },
      set(value) {
        const id = this.item.id
        const property = 'text'

        this.$store.commit('updateDraggableItem', { id, property, value })
      },
    },
  },
}
</script>

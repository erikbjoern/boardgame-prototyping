<template>
  <textarea
    @mousedown="e => $emit('dragstart', e, item)"
    @mouseup="e => $emit('dragend', e)"
    class="rounded-[0.75rem] absolute resize-none text-xs z-[999]"
    :class="item.text.length ? 'p-1' : 'w-6 h-6'"
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
    isBeingDragged: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    offsetTop() {
      return `${
        this.isBeingDragged ? this.temporaryPosition?.y : this.item.position?.y
      }px`
    },
    offsetLeft() {
      return `${
        this.isBeingDragged ? this.temporaryPosition?.x : this.item.position?.x
      }px`
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

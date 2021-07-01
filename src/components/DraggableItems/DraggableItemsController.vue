<template>
  <div>
    <DraggableItem
      v-for="item in $store.state.board.draggableItems"
      :key="item.id + item.position.x + item.position.y"
      :item="item"
      :temporaryPosition="temporaryPosition"
      :isBeingDragged="itemBeingDragged && item.id == itemBeingDragged.id"
      @dragstart="onDragstart"
    />
  </div>
</template>

<script>
import DraggableItem from './DraggableItem'

export default {
  name: 'DraggableItems',
  components: {
    DraggableItem,
  },
  data() {
    return {
      temporaryPosition: null,
      originalPosition: null,
      originalPositionOnPage: null,
      itemBeingDragged: null,
    }
  },
  methods: {
    onDragstart(e, item) {
      this.originalPositionOnPage = { x: e.pageX, y: e.pageY }
      this.itemBeingDragged = item

      this.temporaryPosition = {
        x: item.position.x,
        y: item.position.y,
      }

      this.originalPosition = {
        x: item.position.x,
        y: item.position.y,
      }

      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.onDragend)
    },
    onDrag(e) {
      const dX = e.pageX - this.originalPositionOnPage.x
      const dY = e.pageY - this.originalPositionOnPage.y

      this.temporaryPosition = {
        x: this.originalPosition.x + dX / this.$store.state.grid.scale,
        y: this.originalPosition.y + dY / this.$store.state.grid.scale,
      }
    },
    onDragend() {
      const id = this.itemBeingDragged?.id
      const property = 'position'
      const value = this.temporaryPosition ?? this.itemBeingDragged.position

      this.$store.commit('updateDraggableItem', { id, property, value })

      this.temporaryPosition = null
      this.originalPosition = null
      this.itemBeingDragged = null

      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.onDragend)
    },
  },
}
</script>

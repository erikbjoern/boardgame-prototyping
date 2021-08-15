<template>
  <div id="board-container" class="cursor-default relative">
    <HexGrid v-if="$store.state.board.tileRows.length > 0" />
    <HexGridController />
    <DraggableItemsController />
  </div>
</template>

<script>
import HexGrid from './HexGrid/HexGrid'
import HexGridController from './HexGrid/HexGridController'
import DraggableItemsController from './DraggableItems/DraggableItemsController'

export default {
  name: 'Board',
  components: {
    HexGrid,
    HexGridController,
    DraggableItemsController,
  },
}
</script>

<template>
  <div id="board-container" class="cursor-default">
    <HexGrid />
    <HexGridController />
  </div>
</template>

<script>
import HexGrid from './HexGrid/HexGrid'
import HexGridController from './HexGrid/HexGridController'

export default {
  name: 'Board',
  components: {
    HexGrid,
    HexGridController,
  },
}
</script>

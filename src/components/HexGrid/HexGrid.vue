<template>
  <div id="grid-container">
    <div :style="{ ...gridRowsStyle, ...gridRowsOddStyle }">
      <div v-for="tile in rowsOdd().flat()" :key="tile.id">
        <HexGridTile :tile="tile" />
      </div>
    </div>
    <div :style="{ ...gridRowsStyle, ...gridRowsEvenStyle }">
      <div v-for="tile in rowsEven().flat()" :key="tile.id">
        <HexGridTile :tile="tile" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import HexGridTile from '@/components/HexGrid/HexGridTile.vue'

export default {
  name: 'HexGrid',
  components: {
    HexGridTile,
  },
  computed: {
    ...mapState({
      gap: state => state.grid.gap,
      columnCount: state => state.grid.columnCount,
      tileRows: state => state.board.tileRows,
    }),
    ...mapGetters(['tileSize']),
    gridRowsStyle() {
      return {
        display: 'grid',
        gridAutoRows: `${this.tileSize * 0.866}vw`,
        columnGap: `${this.gapValue * 2}vw`,
        rowGap: `${this.gapValue}vw`,
        gridColumnStart: 1,
        gridRowStart: 1,
      }
    },
    gridRowsOddStyle() {
      return {
        gridTemplateColumns: `repeat(${this.rowsOddLength}, ${this.tileSpaceX}vw)`,
        marginLeft: `${this.tileSpaceX / 2 + this.gapValue}vw`,
      }
    },
    gridRowsEvenStyle() {
      return {
        gridTemplateColumns: `repeat(${this.rowsEvenLength}, ${this.tileSpaceX}vw)`,
        marginTop: `${(this.tileSize * 0.866) / 2 + this.gapValue / 2}vw`,
      }
    },
    rowsOddLength() {
      return Math.ceil(this.columnCount / 2) - (this.columnCount % 2)
    },
    rowsEvenLength() {
      return Math.ceil(this.columnCount / 2)
    },
    gapValue() {
      return this.gap * this.tileSize
    },
    tileSpaceX() {
      return this.tileSize * 1.5
    },
  },
  methods: {
    rowsOdd() {
      return this.tileRows.filter((a, index) => index % 2 == 0)
    },
    rowsEven() {
      return this.tileRows.filter((a, index) => index % 2 == 1)
    },
  },
}
</script>

<style scoped>
#grid-container {
  cursor: default;
  display: grid;
  margin-bottom: 10vh;
}
</style>

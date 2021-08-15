<template></template>

<script>
import { mapState } from 'vuex'
import cuid from 'cuid'
import EventBus from '@/eventBus'

export default {
  name: 'HexGridController',
  data() {
    return {
      hexNumber: 0,
    }
  },
  computed: {
    ...mapState({
      rowCount: state => state.grid.rowCount,
      columnCount: state => state.grid.columnCount,
      tileRows: state => state.board.tileRows,
      tileRowsStash: state => state.board.tileRowsStash,
      landscapeParameters: state => state.landscapes.data,
      landscapePool: state => state.landscapes.pool,
    }),
  },
  methods: {
    // use as method instead of computed property to ensure data is up-to-date
    getCurrentHexTotal() {
      return this.tileRows.flat().length
    },
    getResources(landscapeType) {
      const resources = []
      const parameters = this.landscapeParameters.find(l => l.name == landscapeType)

      if (parameters?.resources) {
        for (const { name, min, max } of parameters.resources) {
          const amount = min + Math.floor(Math.random() * (max - min + 1))
          resources.push({
            name,
            amount,
          })
        }
      }

      return resources
    },
    getLandscapeType() {
      const landscapePool = this.landscapePool
      return landscapePool[Math.floor(Math.random() * landscapePool.length)]
    },
    getTileCount(rowIndex, direction) {
      if (direction == 'rows' && this.tileRows.length > 2) {
        return this.tileRows[rowIndex - 2].length
      }
      const { columnCount } = this
      return Math.floor(columnCount / 2) + (columnCount % 2) * (rowIndex % 2)
    },
    buildTileRow(row, rowIndex, direction) {
      const tileCount = this.getTileCount(rowIndex, direction)
      let newRow = []

      for (let t = 0; t < tileCount; t++) {
        let tile

        if (!!row[t]) {
          tile = row[t]
        } else {
          const stashedRow = this.tileRowsStash[rowIndex]
          const stashedTile = stashedRow ? stashedRow[newRow.length] : null
          let landscapeType
          let resources
          let id

          if (!stashedTile) {
            landscapeType = this.getLandscapeType()
            resources = this.getResources(landscapeType)
            id = cuid()
          }

          tile = stashedTile || {
            landscapeType,
            resources,
            id,
          }
        }

        tile.number = ++this.hexNumber
        tile.index = newRow.length
        tile.rowIndex = rowIndex

        newRow.push(tile)
      }

      return newRow
    },
    reduceTileRow(targetRow, rowIndex) {
      const tileCount = this.getTileCount(rowIndex)
      let reducedRow = []

      for (let i = 0; i < tileCount; i++) {
        const tile = { ...targetRow[i], number: ++this.hexNumber }
        reducedRow.push(tile)
      }

      return reducedRow
    },
    addTileColumns() {
      this.hexNumber = 0
      const rowCount = this.tileRows.length

      for (let index = 0; index < rowCount; index++) {
        const targetRow = this.tileRows[index] || []
        const extendedRow = this.buildTileRow([...targetRow], index, 'columns')

        this.$store.dispatch('storeModifiedTileRow', { row: extendedRow, index })
      }
    },
    async addTileRows(newTotal = this.rowCount, oldTotal = 0) {
      this.hexNumber = this.getCurrentHexTotal()

      for (let index = oldTotal; index < newTotal; index++) {
        const stashedRow = await this.$store.dispatch('getRowFromStash', index)
        const row = stashedRow
          ? this.buildTileRow([...stashedRow], index, 'rows')
          : this.buildTileRow([], index, 'rows')

        this.$store.dispatch('storeTileRow', { row, index })
      }
    },
    removeTileColumns() {
      this.hexNumber = 0

      for (let index = 0; index < this.rowCount; index++) {
        const targetRow = this.tileRows[index]
        const reducedRow = this.reduceTileRow(targetRow, index)

        this.$store.dispatch('storeModifiedTileRow', { row: reducedRow, index })
      }
    },
    removeTileRows(difference) {
      while (difference--) {
        this.$store.commit('removeTileRow')
      }
    },
    reassignResources() {
      const updatedTileRows = this.tileRows.map(row => {
        return row.map(tile => {
          return { ...tile, resources: this.getResources(tile.landscapeType) }
        })
      })

      const newBoardState = { ...this.$store.state.board, tileRows: updatedTileRows }

      this.$store.commit('setBoardState', newBoardState)
    },
    buildNewBoard() {
      this.$store.dispatch('arrangeLandscapePool')

      this.addTileRows()

      this.$store.dispatch('setBoardColors')
      this.$store.dispatch('setBoardLandscapes')
    },
  },
  watch: {
    rowCount(newValue, oldValue) {
      if (oldValue == null) return

      if (newValue > oldValue) {
        this.addTileRows(newValue, oldValue)
      } else {
        this.removeTileRows(oldValue - newValue)
      }
    },
    columnCount(newValue, oldValue) {
      if (oldValue == null) return

      if (newValue > oldValue) {
        this.addTileColumns()
      } else {
        this.removeTileColumns()
      }
    },
  },
  async created() {
    EventBus.$on('buildNewBoard', this.buildNewBoard)
    EventBus.$on('reassignResources', this.reassignResources)
  },
  destroyed() {
    EventBus.$off('buildNewBoard', this.buildNewBoard)
    EventBus.$off('reassignResources', this.reassignResources)
  },
}
</script>

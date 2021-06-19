<template>
  <div
    v-if="selectedTileIds.length > 0"
    class="flex space-x-2 p-1 bg-[#efefef55] relative mr-auto mt-1 z-[1000] rounded-sm"
  >
    <div
      class="py-px px-1 rounded-sm text-xs font-semibold"
      v-for="(value, name) in totalResources"
      :key="name"
      :style="{
        backgroundColor: $store.getters.resourceColors[name],
        color: $store.getters.invertedResourceColors[name],
      }"
    >
      {{ name }}:
      {{ value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandscapeSummary',
  computed: {
    selectedTileIds() {
      return this.$store.state.board.selectedTiles
    },
    totalResources() {
      const allVisibleTiles = this.$store.state.board.tileRows.flat()
      const selectedTiles = this.selectedTileIds.map(tileId =>
        allVisibleTiles.find(t => t.id == tileId)
      ).filter(v => !!v)
      
      if (selectedTiles.length) {
        const resourceTypesOnTiles = Array.from(
          new Set(
            selectedTiles
              .map(t => {
                const landscape = this.$store.state.landscapes.data.find(
                  l => l.name == t.landscapeType
                )
                if (landscape) return landscape.resources.map(r => r.name)
              })
              .flat()
              .filter(v => !!v)
          )
        )

        if (resourceTypesOnTiles.length) {
          const accumulator = Object.assign(
            ...resourceTypesOnTiles.map(name => ({ [name]: 0 }))
          )

          const resourceSums = selectedTiles.reduce((acc, current) => {
            current.resources.map(r => {
              if (r.name && r.amount) {
                acc[r.name] += r.amount
              }
            })

            return acc
          }, accumulator)

          return resourceSums
        }
      }
    },
  },
}
</script>

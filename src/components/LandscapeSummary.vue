<template>
  <div
    v-if="Object.values(totalResources).some(v => !!v)"
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
      {{ name }}
      {{ value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandscapeSummary',
  computed: {
    totalResources() {
      const allTiles = this.$store.state.grid.hexRows.flat()
      const selectedTiles = this.$store.state.selectedTiles.map(tileId =>
        allTiles.find(t => t.id == tileId)
      )
      const accumulator = Object.assign(
        ...this.$store.state.resources.data.map(r => ({ [r.name]: 0 }))
      )

      const resourceSums = selectedTiles.reduce((acc, current) => {
        current.resources.map(r => {
          acc[r.name] += r.amount
        })
        return acc
      }, accumulator)

      return resourceSums
    },
  },
}
</script>

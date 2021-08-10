<template>
  <div
    class="flex space-x-2 p-1 bg-[#efefef55] fixed top-2 left-1/2 transform -translate-x-1/2 z-[1000] rounded-sm"
  >
    <div
      class="py-px px-1 rounded-sm text-xs font-semibold"
      v-for="(value, name) in totalResources"
      :key="name"
      :style="{
        backgroundColor: resourceColors[name].main,
        color: resourceColors[name].inverted,
      }"
    >
      {{ name }}:
      {{ value }}
    </div>
    <button
      class="absolute right-[-.5rem] top-px transform translate-x-full px-[3.5px] border rounded-full flex items-center justify-start text-sm tracking-wide border-gray-900 text-gray-900 overflow-hidden max-w-[1.5rem] h-6 hover:max-w-[9rem] w-[9rem] bg-[#efefef55] hover:bg-[#ffffffbb] transition-all"
      @click="clearSelection"
    >
      <svg
        class="fill-current flex-none"
        viewBox="0 0 24 24"
        height="15"
        width="15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
        ></path>
      </svg>
      <span class="inline-block mt-[-2px] w-0 ml-1">
        rensa markering
      </span>
    </button>
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
      const selectedTiles = this.selectedTileIds
        .map(tileId => allVisibleTiles.find(t => t.id == tileId))
        .filter(v => !!v)

      if (selectedTiles.length) {
        let resourceTypesOnTiles = []

        for (let i = 0; i < selectedTiles.length; i++) {
          selectedTiles[i].resources?.forEach(r => {
            if (!resourceTypesOnTiles.includes(r?.name)) {
              resourceTypesOnTiles.push(r.name)
            }
          })

          if (resourceTypesOnTiles.length == this.$store.state.resources.data.length)
            break
        }

        if (resourceTypesOnTiles.length) {
          const accumulator = Object.assign(
            ...resourceTypesOnTiles.map(name => ({ [name]: 0 }))
          )

          const resourceSums = selectedTiles.reduce((acc, current) => {
            current.resources?.map(r => {
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
    resourceColors() {
      return this.$store.state.board.colors.resources
    },
  },
  methods: {
    clearSelection() {
      this.$store.commit('setBoardState', {
        ...this.$store.state.board,
        selectedTiles: [],
      })
    },
  },
}
</script>

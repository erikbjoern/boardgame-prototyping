<template>
  <div class="flex flex-col w-36 mx-auto space-y-3">
    <button
      class="h-8 border rounded-full !font-thin text-sm tracking-wide bg-black border-gray-100 text-gray-100"
      @click="resetTiles"
    >
      Generera nytt bräde
    </button>
  </div>
</template>

<script>

export default {
  name: 'SettingsActions',
  methods: {
    resetTiles() {
      this.$store.dispatch('resetTiles')
      this.$emit('close')
    }
  },
}
</script>

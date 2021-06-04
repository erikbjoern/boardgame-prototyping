<template>
  <div class="input-bar-container h-24">
    <div class="board-inputs">
      <SettingsInputGrid
        v-for="property in gridProperties"
        :key="property.name"
        :property="property"
      />
      <div class="buttons-box">
        <button @click="resetAdjustments">Återställ ändringar</button>
        <button @click="center">Centrera bräde</button>
        <button @click="resetTiles">Förnya brickor</button>
        <button v-if="!resourceSettingsIsOpen" @click="showResourceInputs">
          Hantera resurser
        </button>
        <button
          v-else
          class="!bg-[#000000ef] !text-white font-light"
          @click="hideResourceInputs"
        >
          Stäng
        </button>
      </div>
    </div>
    <div
      v-if="resourceSettingsIsOpen"
      class="rounded bg-[#000000e0] p-6 space-y-6 flex flex-col items-center"
    >
      <div class="flex w-72 rounded overflow-hidden">
        <button
          class="block h-full flex-1 !rounded-none"
          :class="
            mode == 'LANDSCAPES'
              ? '!bg-[#707070] text-[#eeeeee]'
              : '!bg-[#333333] text-[#9f9f9f]'
          "
          @click="toggleMode"
        >
          Landskap
        </button>
        <button
          class="block h-full flex-1 !rounded-none"
          :class="
            mode == 'RESOURCES'
              ? '!bg-[#777777] text-[#eeeeee]'
              : '!bg-[#333333] text-[#9f9f9f]'
          "
          @click="toggleMode"
        >
          Resurser
        </button>
      </div>
      <div v-if="mode == 'LANDSCAPES'" class="flex flex-col space-y-4 w-72">
        <SettingsInputLandscapes
          v-for="(landscape, index) in landscapeParameters"
          :key="landscape.name + '' + index"
          :landscape="landscape"
        />
      </div>
      <div v-if="mode == 'RESOURCES'" class="flex flex-col space-y-4 w-72">
        <label>
          <input
            type="checkbox"
            :checked="$store.state.grid.visibleResourceValues"
            @click="toggleResourceValuesVisibility"
          />
          Visa värden
        </label>
        <SettingsInputResources
          v-for="(resource, index) in resourceParameters"
          :key="resource.name + '' + index"
          :resource="resource"
        />
        <button @click="$store.commit('addResource')">Lägg till resurs</button>
      </div>
    </div>
  </div>
</template>

<script>
import SettingsInputGrid from './SettingsInputGrid'
import SettingsInputResources from './SettingsInputResources'
import SettingsInputLandscapes from './SettingsInputLandscapes'
import { mapActions, mapState } from 'vuex'
import { scrollToCenter } from '@/helpers/scroll'

export default {
  components: {
    SettingsInputGrid,
    SettingsInputResources,
    SettingsInputLandscapes,
  },
  name: 'SettingsBar',
  data() {
    return {
      resourceSettingsIsOpen: true,
      mode: 'LANDSCAPES',
      gridProperties: [
        {
          name: 'rowCount',
          min: 3,
          max: 23,
          text: 'Rader',
          showValue: true,
          multiple: 1,
          flexGrow: 10,
        },
        {
          name: 'columnCount',
          min: 3,
          max: 23,
          text: 'Kolumner',
          showValue: true,
          multiple: 1,
          flexGrow: 10,
        },
        {
          name: 'tileSize',
          min: 60,
          max: 225,
          text: 'Storlek',
          multiple: 15,
          flexGrow: 7,
        },
        {
          name: 'gap',
          min: 0,
          max: 20,
          text: 'Mellanrum',
          multiple: 70,
          flexGrow: 1,
        },
        {
          name: 'tileBorderWidth',
          min: 0,
          max: 20,
          text: 'Bård',
          multiple: 1,
          flexGrow: 1,
        },
      ],
    }
  },
  computed: mapState({
    landscapeParameters: state => state.landscapes.data,
    resourceParameters: state => state.resources.data,
  }),
  methods: {
    scrollToCenter,
    ...mapActions(['resetTiles', 'resetAdjustments']),
    center(e) {
      this.scrollToCenter()
      e.target.blur()
    },
    showResourceInputs() {
      this.resourceSettingsIsOpen = true
    },
    hideResourceInputs(e) {
      this.resourceSettingsIsOpen = false
      e.target.blur()
    },
    toggleResourceValuesVisibility() {
      this.$store.commit('toggleResourceValuesVisibility')
    },
    toggleMode(e) {
      this.mode = this.mode == 'LANDSCAPES' ? 'RESOURCES' : 'LANDSCAPES'
      e.target.blur()
    },
  },
}
</script>

<style scoped>
.input-bar-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  left: 50%;
  padding: 0.5vw;
  position: fixed;
  top: 1vw;
  transform: translateX(-50%);
  width: 90vw;
  z-index: 1000;
}

.board-inputs {
  background-color: #efefef55;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  gap: 10px;
  justify-content: flex-end;
  padding: 0.5vw;
  width: 90vw;
}

.board-inputs .buttons-box {
  align-items: stretch;
  background-color: transparent;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  grid-template-columns: 1fr 1fr;
  justify-content: flex-end;
  width: 284px;
  z-index: 1001;
}

.board-inputs .buttons-box button {
  color: #071b35;
  transition: all 0.2s;
  width: 140px;
  height: 30px;
}

.board-inputs .buttons-box button:hover {
  background-color: #000000d3;
  color: #fefefeee;
  opacity: 1;
}

@keyframes expand {
  from {
    max-height: 20px;
  }
}

.resource-inputs {
  animation: expand 0.15s forwards;
  background-color: #000000ef;
  border-radius: 4px 0 4px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 200px);
  min-width: 170px;
  padding: 20px;
  position: relative;
  right: 0.5vw;
  top: -0.25vw;
}

.resource-inputs div#field-list {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input,
button {
  background-color: #eef1ef;
  border-radius: 3px;
  border: 1px solid #00000043;
  box-shadow: 1px 1px 3px #00000022;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

label {
  user-select: none;
  color: whitesmoke;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 300;
  font-size: 0.85rem;
}

button:hover {
  cursor: pointer;
  opacity: 0.6;
}

button#close {
  background-color: transparent;
  color: white;
  border: none;
}

button#close:focus {
  outline: none;
}
</style>

<template>
  <div class="input-bar-container h-24 mx-auto relative" style="max-width: 1400px">
    <div class="board-inputs h-20">
      <GridSettingsItem
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
      <ResourceSettings v-if="resourceSettingsIsOpen" />
    </div>
    <LandscapeSummary />
  </div>
</template>

<script>
import GridSettingsItem from './GridSettingsItem'
import ResourceSettings from './ResourceSettings'
import { mapActions } from 'vuex'
import { scrollToCenter } from '@/helpers/scroll'
import LandscapeSummary from '@/components/LandscapeSummary.vue'

export default {
  components: {
    GridSettingsItem,
    ResourceSettings,
    LandscapeSummary,
  },
  name: 'SettingsBar',
  data() {
    return {
      resourceSettingsIsOpen: false,
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

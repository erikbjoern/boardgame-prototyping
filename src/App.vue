<template>
  <div class="relative">
    <svg
      class="fixed top-3 right-3 w-8 h-8 grid place-items-center z-[1000] text-gray-200 fill-current bg-black opacity-90 rounded p-[0.3rem] hover:opacity-75 cursor-pointer"
      :class="settingsAreOpen && 'border-2 border-green-500'"
      @click="toggleSettings"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 55.634 55.634"
      style="box-shadow: 0px 1px 6px  #00000066, 0 0 12px 5px #00000022"
    >
      <path
        d="M36.583,37.243c0.129-1.356,0.09-2.707-0.106-4.026l3.049-1.359c-0.288-1.477-0.741-2.934-1.369-4.344
			c-0.628-1.409-1.408-2.72-2.312-3.923l-3.051,1.358c-0.849-1.027-1.827-1.959-2.921-2.771l1.196-3.116
			c-1.249-0.84-2.599-1.55-4.04-2.103c-1.435-0.551-2.909-0.932-4.408-1.143l-1.197,3.119c-1.356-0.129-2.707-0.09-4.026,0.106
			l-1.351-3.034c-3.018,0.593-5.838,1.873-8.259,3.702l1.342,3.014c-1.029,0.849-1.961,1.828-2.773,2.921l-3.108-1.192
			c-0.848,1.246-1.559,2.597-2.113,4.037C0.587,29.929,0.211,31.407,0,32.896l3.116,1.196c-0.129,1.356-0.09,2.707,0.106,4.026
			l-3.049,1.358c0.288,1.478,0.741,2.934,1.369,4.344c0.629,1.41,1.408,2.72,2.313,3.923l3.049-1.358
			c0.849,1.028,1.827,1.96,2.922,2.772L8.63,52.275c1.249,0.841,2.599,1.55,4.04,2.103c1.435,0.551,2.909,0.932,4.408,1.143
			l1.197-3.119c1.356,0.128,2.707,0.089,4.026-0.107l1.351,3.033c3.018-0.593,5.84-1.873,8.26-3.702l-1.343-3.014
			c1.028-0.849,1.961-1.827,2.773-2.921l3.106,1.192c0.848-1.246,1.559-2.597,2.113-4.036c0.553-1.44,0.928-2.919,1.139-4.409
			L36.583,37.243z M28.3,38.91c-1.791,4.668-7.026,6.998-11.695,5.207c-4.663-1.79-6.996-7.024-5.206-11.691
			c1.791-4.667,7.026-6.997,11.692-5.208C27.758,29.008,30.09,34.244,28.3,38.91z"
      />
      <path
        d="M53.465,12.395c0-0.604-0.062-1.195-0.168-1.769l2.337-1.35c-0.566-2.152-1.69-4.079-3.227-5.601l-2.343,1.353
			c-0.894-0.766-1.93-1.366-3.063-1.766V0.559c-1.032-0.283-2.113-0.445-3.232-0.445c-1.119,0-2.199,0.164-3.232,0.445v2.704
			c-1.133,0.4-2.168,1.001-3.063,1.766L35.13,3.676c-1.535,1.522-2.66,3.449-3.227,5.601l2.338,1.35
			c-0.106,0.575-0.169,1.164-0.169,1.769s0.063,1.195,0.169,1.769l-2.338,1.35c0.567,2.152,1.692,4.08,3.227,5.601l2.343-1.353
			c0.895,0.766,1.93,1.366,3.063,1.766v2.704c1.033,0.282,2.113,0.445,3.232,0.445s2.201-0.164,3.232-0.445v-2.704
			c1.133-0.4,2.169-1.001,3.063-1.766l2.343,1.353c1.537-1.522,2.661-3.449,3.227-5.601l-2.337-1.35
			C53.403,13.589,53.465,13,53.465,12.395z M43.77,16.921c-2.5,0-4.527-2.026-4.527-4.525S41.27,7.87,43.77,7.87
			c2.497,0,4.524,2.026,4.524,4.525S46.267,16.921,43.77,16.921z"
      />
    </svg>
    <svg
      class="fixed top-3 right-[3.25rem] w-8 h-8 grid place-items-center z-[1000] text-gray-200 fill-current bg-black opacity-90 rounded p-[0.3rem] hover:opacity-75 cursor-pointer"
      viewBox="0 0 24 24"
      height="24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      @click="addDraggableItem"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"
      ></path>
    </svg>
    <SettingsWindow v-if="settingsAreOpen" @close="settingsAreOpen = false" />
    <LandscapeSummary
      v-if="
        $store.state.preferences.showSummary &&
          $store.state.board.selectedTiles.length > 0
      "
    />
    <LandscapeOverview v-if="$store.state.preferences.showOverview" />
    <transition name="fade" mode="out-in">
      <div
        v-show="$store.state.draggableIsBeingDragged"
        class="fixed bottom-5 left-5 z-[988] rounded-lg border-4 bg-transparent border-red-500 border-opacity-70"
      >
        <svg
          class="fill-current transition-colors m-1 rounded-sm bg-red-500 bg-opacity-70"
          :class="$store.state.draggableIsOnDropzone ? 'text-red-700' : 'text-red-900'"
          viewBox="0 0 24 24"
          height="80"
          width="80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H18.9897C18.9959 5.99994 19.0021 5.99994 19.0083 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H19.9311L19.0638 20.1425C18.989 21.1891 18.1182 22 17.0689 22H6.93112C5.88184 22 5.01096 21.1891 4.9362 20.1425L4.06888 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H4.99174C4.99795 5.99994 5.00414 5.99994 5.01032 6H7V4ZM9 6H15V4H9V6ZM6.07398 8L6.93112 20H17.0689L17.926 8H6.07398ZM10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10Z"
          ></path>
        </svg>
      </div>
    </transition>
    <div
      class="mainContainer"
      ref="mainContainer"
      :style="
        `transform: scale(${$store.state.grid.scale}); transition: transform 0.3s ease`
      "
    >
      <Board />
    </div>
  </div>
</template>

<script>
import SettingsWindow from '@/components/SettingsWindow/Settings'
import Board from '@/components/Board'
import { scrollToCenter } from '@/helpers/scroll.js'
import { dragToScrollStart, dragToScroll } from '@/helpers/scroll.js'
import LandscapeOverview from '@/components/LandscapeOverview'
import LandscapeSummary from '@/components/LandscapeSummary'

export default {
  name: 'App',
  components: {
    Board,
    SettingsWindow,
    LandscapeOverview,
    LandscapeSummary,
  },
  data() {
    return {
      mousePosition: { x: 0, y: 0 },
      settingsAreOpen: false,
    }
  },
  methods: {
    dragToScrollStart,
    dragToScroll,
    scrollToCenter,
    updateViewportWidth() {
      this.$store.commit('updateViewportWidth')
    },
    mouseMoveHandler(e) {
      this.dragToScroll.bind(this)(e)
    },
    mouseUpHandler() {
      this.$refs.mainContainer.style.cursor = 'grab'

      document.removeEventListener('mousemove', this.mouseMoveHandler)
      document.removeEventListener('mouseup', this.mouseUpHandler)
    },
    mouseDownHandler(e) {
      if (e.button !== 0 || e.which !== 1) return

      if (
        !this.$store.state.keysPressed.includes(32) &&
        !e.target.classList.contains('mainContainer')
      ) {
        return
      }

      this.dragToScrollStart.bind(this)(e)

      document.addEventListener('mousemove', this.mouseMoveHandler)
      document.addEventListener('mouseup', this.mouseUpHandler)
    },
    keydownHandler(e) {
      if (e.keyCode == 32 && !this.$store.state.hasFocusedInput) {
        e.preventDefault()

        if (this.$store.state.keysPressed.length == 0) {
          document.getElementById('board-container').style.cursor = 'grab'
          this.$store.commit('keydown', e.keyCode)
        }
      }

      if (e.keyCode == 93 && this.$store.state.keysPressed.length == 0) {
        document.getElementById('board-container').style.cursor = 'pointer'
        this.$store.commit('keydown', e.keyCode)
      }
    },
    keyupHandler(e) {
      this.$store.commit('keyup', e.keyCode)

      if (this.$store.state.keysPressed.length == 0) {
        document.getElementById('board-container').style.cursor = 'default'
      }
    },
    toggleSettings(e) {
      this.settingsAreOpen = !this.settingsAreOpen
      e.currentTarget.blur()
    },
    addDraggableItem() {
      this.$store.commit('addDraggableItem')
    },
  },
  mounted() {
    const mainContainer = this.$refs.mainContainer

    mainContainer.addEventListener('mousedown', this.mouseDownHandler)
    window.addEventListener('resize', this.scrollToCenter)
    window.addEventListener('resize', this.updateViewportWidth)
    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('keyup', this.keyupHandler)

    window.scrollTo({ left: visualViewport.width / 2 })
    this.scrollToCenter()
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.mouseDownHandler)
    document.removeEventListener('mousemove', this.mouseMoveHandler)
    document.removeEventListener('mouseup', this.mouseUpHandler)
    window.removeEventListener('resize', this.scrollToCenter)
    window.removeEventListener('resize', this.updateViewportWidth)
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('keyup', this.keyupHandler)
  },
}
</script>

<style>
body {
  background-color: #efefef;
  margin: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
body::-webkit-scrollbar {
  display: none;
}

.mainContainer {
  cursor: grab;
  display: grid;
  height: 300vh;
  place-items: center;
  padding-top: calc(3vw + 35px);
  width: 200vw;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

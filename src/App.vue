<template>
  <div>
    <AdjustmentsBar />
    <div class="mainContainer" ref="mainContainer">
      <HexGridContainer />
    </div>
  </div>
</template>

<script>
import AdjustmentsBar from "@/components/AdjustmentsBar.vue";
import HexGridContainer from "@/containers/HexGridContainer.vue";
import { scrollToCenter } from "@/helpers/scroll.js";
import { dragToScrollStart, dragToScroll } from "@/helpers/scroll.js";

export default {
  name: "App",
  components: {
    HexGridContainer,
    AdjustmentsBar,
  },
  data() {
    return {
      mousePosition: { x: 0, y: 0 },
    };
  },
  methods: {
    dragToScrollStart,
    dragToScroll,
    scrollToCenter,
    updateViewportWidth() {
      this.$store.commit("updateViewportWidth");
    },
    mouseMoveHandler(e) {
      this.dragToScroll.bind(this)(e);
    },
    mouseUpHandler() {
      this.$refs.mainContainer.style.cursor = "grab";

      document.removeEventListener("mousemove", this.mouseMoveHandler);
      document.removeEventListener("mouseup", this.mouseUpHandler);
    },
    mouseDownHandler(e) {
      if (e.button !== 0 || e.which !== 1) return;
      this.dragToScrollStart.bind(this)(e);

      document.addEventListener("mousemove", this.mouseMoveHandler);
      document.addEventListener("mouseup", this.mouseUpHandler);
    },
  },
  mounted() {
    const mainContainer = this.$refs.mainContainer;

    mainContainer.addEventListener("mousedown", this.mouseDownHandler);
    window.addEventListener("resize", this.scrollToCenter);
    window.addEventListener("resize", this.updateViewportWidth);
  
    window.scrollTo({ left: visualViewport.width / 2 })
    this.scrollToCenter();
  },
  beforeDestroy() {
    document.removeEventListener("mousedown", this.mouseDownHandler);
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseup", this.mouseUpHandler);
    window.removeEventListener("resize", this.scrollToCenter);
    window.removeEventListener("resize", this.updateViewportWidth);
  },
};
</script>

<style lang="scss">
body {
  background-color: #efefef;
  margin: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mainContainer {
  cursor: grab;
  display: grid;
  height: 300vh;
  place-items: center;
  padding-top: calc(3vw + 35px);
  width: 200vw;
}

::-webkit-scrollbar {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

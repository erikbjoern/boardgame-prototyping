<template>
  <div>
    <InputsBar />
    <div class="mainContainer" ref="mainContainer">
      <HexGridContainer />
    </div>
  </div>
</template>

<script>
import InputsBar from "@/components/InputsBar.vue";
import HexGridContainer from "@/containers/HexGridContainer.vue";
import { scrollToCenter } from "@/helpers/scroll.js";
import { dragToScrollStart, dragToScroll } from "@/helpers/scroll.js";

export default {
  name: "App",
  components: {
    HexGridContainer,
    InputsBar,
  },
  data() {
    return {
      mousePosition: { x: 0, y: 0 },
    };
  },
  methods: {
    scrollToCenter,
    dragToScrollStart,
    dragToScroll,
    mouseMoveHandler(e) {
      this.dragToScroll.bind(this)(e);
    },
    mouseUpHandler() {
      this.$refs.mainContainer.style.cursor = "grab";

      document.removeEventListener("mousemove", this.mouseMoveHandler);
      document.removeEventListener("mouseup", this.mouseUpHandler);
    },
    mouseDownHandler(e) {
      if (e.button !== 0 || e.which !== 1) return
      this.dragToScrollStart.bind(this)(e);

      document.addEventListener("mousemove", this.mouseMoveHandler);
      document.addEventListener("mouseup", this.mouseUpHandler);
    }
  },
  created() {
    this.scrollToCenter();
  },
  mounted() {
    const mainContainer = this.$refs.mainContainer;
    mainContainer.addEventListener("mousedown", this.mouseDownHandler);
    window.addEventListener("resize", this.scrollToCenter);
  },
  destroyed() {
    document.removeEventListener("mousedown", this.mouseDownHandler);
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseup", this.mouseUpHandler);
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mainContainer {
  cursor: grab;
  background-color: #efefef;
  height: 200vh;
  width: 200vw;
  padding: calc(3vw + 30px) 0;
}

::-webkit-scrollbar {
  display: none;
}
</style>

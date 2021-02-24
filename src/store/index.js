import Vue from "vue";
import Vuex from "vuex";

import { grid } from "@/store/modules/grid";
import { resources } from "@/store/modules/resources";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    viewportWidth: visualViewport.width,
  },
  mutations: {
    updateViewportWidth(state) {
      state.viewportWidth = visualViewport.width;
    },
  },
  actions: {
    setInitialState(context) {
      const savedRowCount = parseInt(localStorage.getItem("rowCount"));
      const savedColumnCount = parseInt(localStorage.getItem("columnCount"));
      const savedHexRows = JSON.parse(localStorage.getItem("hexRows"));
      const savedHexStash = JSON.parse(localStorage.getItem("hexStash"));
      const savedTileStyle = JSON.parse(localStorage.getItem("tileStyle"));
      const savedResourceData = JSON.parse(
        localStorage.getItem("resourceData")
      );

      const rowCount = savedRowCount || 13;
      const columnCount = savedColumnCount || 13;
      const hexRows = savedHexRows || [];
      const hexStash = savedHexStash || [];
      const tileStyle = savedTileStyle || {
        gap: 0,
        tileSize: 6,
        tileBorderWidth: 6,
      };
      const resourceParameters = savedResourceData || [
        {
          type: "stone",
          max: 9,
          chance: 25,
        },
        {
          type: "wood",
          max: 9,
          chance: 25,
        },
        {
          type: "wheat",
          max: 9,
          chance: 25,
        },
      ];

      context.commit("setRowCount", rowCount);
      context.commit("setColumnCount", columnCount);
      context.commit("setInitialHexRows", hexRows);
      context.commit("setInitialHexRowsStash", hexStash);
      context.commit("setGap", tileStyle.gap);
      context.commit("setTileSize", tileStyle.tileSize);
      context.commit("setTileBorderWidth", tileStyle.tileBorderWidth);
      context.commit("setInitialResourceParameters", resourceParameters);
    },
    updateLocalStorage(context) {
      const {
        rowCount,
        columnCount,
        hexRows,
        hexRowsStash,
        gap,
        tileSize,
        tileBorderWidth,
      } = context.state.grid;
      const resourceParameters = context.state.resources.parameters;
      const tileStyle = { gap, tileSize, tileBorderWidth };

      localStorage.setItem("rowCount", rowCount);
      localStorage.setItem("columnCount", columnCount);
      localStorage.setItem("hexRows", JSON.stringify(hexRows));
      localStorage.setItem("hexStash", JSON.stringify(hexRowsStash));
      localStorage.setItem("tileStyle", JSON.stringify(tileStyle));
      localStorage.setItem("resourceData", JSON.stringify(resourceParameters));
    },
    resetAdjustments() {
      localStorage.removeItem("rowCount");
      localStorage.removeItem("columnCount");
      localStorage.removeItem("hexRows");
      localStorage.removeItem("tileStyle");
      window.location.reload();
    },
    resetTiles() {
      localStorage.removeItem("hexRows");
      localStorage.removeItem("hexStash");
      window.location.reload();
    },
  },
  modules: {
    grid,
    resources,
  },
});

store.watch(
  (state) => state,
  () => {
    store.dispatch("updateLocalStorage");
  },
  {
    deep: true,
  }
);

export default store;

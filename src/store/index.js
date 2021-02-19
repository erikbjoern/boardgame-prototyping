import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tileSize: 20,
    gap: 0,
    borderWidth: 6,
    columns: 13,
    rows: 13,
    hexRows: {
      rowsOdd: [],
      rowsEven: [],
      rowsOddStash: [],
      rowsEvenStash: [],
    },
  },
  mutations: {
    setTileSize(state, payload) {
      state.tileSize = payload;
    },
    setGap(state, payload) {
      state.gap = payload;
    },
    setBorderWidth(state, payload) {
      state.borderWidth = payload;
    },
    setColumns(state, payload) {
      state.columns = payload;
    },
    setRows(state, payload) {
      state.rows = payload;
    },
    setHexRows(state, payload) {
      state.hexRows = payload;
    },
  },
  actions: {
    setStateFromLocalStorage(context) {
      const savedStyle = JSON.parse(localStorage.getItem("style"));
      const savedRowCount = parseInt(localStorage.getItem("rowCount"));
      const savedColumnCount = parseInt(localStorage.getItem("columnCount"));
      const savedHexRows = JSON.parse(localStorage.getItem("hexRows"));

      const tileSize = savedStyle?.tileSize || context.state.tileSize;
      const gap = savedStyle?.gap || context.state.gap;
      const borderWidth = savedStyle?.borderWidth || context.state.borderWidth;
      const rows = savedRowCount || context.state.rows;
      const columns = savedColumnCount || context.state.columns;
      const hexRows = savedHexRows || context.state.hexRows;

      context.commit("setTileSize", tileSize)
      context.commit("setGap", gap)
      context.commit("setBorderWidth", borderWidth)
      context.commit("setRows", rows)
      context.commit("setColumns", columns)
      context.commit("setHexRows", hexRows)
    },
    updateLocalStorage(context) {
      const {
        tileSize,
        gap,
        borderWidth,
        rows,
        columns,
        hexRows,
      } = context.state;
      const style = { tileSize, gap, borderWidth };

      localStorage.setItem("style", JSON.stringify(style));
      localStorage.setItem("rowCount", rows);
      localStorage.setItem("columnCount", columns);
      localStorage.setItem("hexRows", JSON.stringify(hexRows));
    },
    reset() {
      localStorage.removeItem("style");
      localStorage.removeItem("rowCount");
      localStorage.removeItem("columnCount");
      localStorage.removeItem("hexRows");
      window.location.reload();
    },
  },
  modules: {},
});

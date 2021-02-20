import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    style: {
      tileSize: 6,
      gap: 0,
      borderWidth: 6,
    },
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
      state.style.tileSize = payload;
    },
    setGap(state, payload) {
      state.style.gap = payload;
    },
    setBorderWidth(state, payload) {
      state.style.borderWidth = payload; 
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

      const style = savedStyle || context.state.style;
      const rows = savedRowCount || context.state.rows;
      const columns = savedColumnCount || context.state.columns;
      const hexRows = savedHexRows || context.state.hexRows;

      context.commit("setTileSize", style.tileSize);
      context.commit("setGap", style.gap);
      context.commit("setBorderWidth", style.borderWidth);
      context.commit("setRows", rows);
      context.commit("setColumns", columns);
      context.commit("setHexRows", hexRows);
    },
    updateLocalStorage(context) {
      const { style, rows, columns, hexRows } = context.state;

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

store.watch(
  (state) => ({ ...state }),
  () => {
    store.dispatch("updateLocalStorage");
  }
);

export default store;

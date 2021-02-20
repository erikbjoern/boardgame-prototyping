import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    tileSize: null,
    gap: null,
    borderWidth: null,
    columnCount: null,
    rowCount: null,
    hexRows: [],
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
    setColumnCount(state, payload) {
      state.columnCount = payload;
    },
    setRowCount(state, payload) {
      state.rowCount = payload;
    },
    addHexRow(state, payload) {
      state.hexRows.push(payload);
    },
    removeHexRow(state) {
      state.hexRows.pop();
    },
    replaceHexRow(state, { row, index }) {
      state.hexRows[index] = row;
    },
    removeHexColumn(state, { indexParity }) {
      state.hexRows
        .filter((row, i) => i % 2 == indexParity)
        .map((row) => row.pop());
    },
    setInitialHexRows(state, payload) {
      state.hexRows = [...payload];
    },
  },
  actions: {
    setInitialState(context) {
      const savedRowCount = parseInt(localStorage.getItem("rowCount"));
      const savedColumnCount = parseInt(localStorage.getItem("columnCount"));
      const savedHexRows = JSON.parse(localStorage.getItem("hexRows"));
      const savedStyle = JSON.parse(localStorage.getItem("style"));

      const rowCount = savedRowCount || 13;
      const columnCount = savedColumnCount || 13;
      const hexRows = savedHexRows || [];
      const style = savedStyle || {
        tileSize: 6,
        gap: 0,
        borderWidth: 6,
      };

      context.commit("setRowCount", rowCount);
      context.commit("setColumnCount", columnCount);
      context.commit("setInitialHexRows", hexRows);
      context.commit("setTileSize", style.tileSize);
      context.commit("setGap", style.gap);
      context.commit("setBorderWidth", style.borderWidth);
    },
    updateLocalStorage(context) {
      const {
        tileSize,
        gap,
        borderWidth,
        rowCount,
        columnCount,
        hexRows,
      } = context.state;
      const style = { tileSize, gap, borderWidth };

      localStorage.setItem("style", JSON.stringify(style));
      localStorage.setItem("rowCount", rowCount);
      localStorage.setItem("columnCount", columnCount);
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

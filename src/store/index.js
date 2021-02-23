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
    hexRowsStash: [],
    viewportWidth: visualViewport.width,
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
      const columnCount = payload > 23 ? 23 : payload < 3 ? 3 : payload;
      state.columnCount = columnCount;
    },
    setRowCount(state, payload) {
      const rowCount = payload > 23 ? 23 : payload < 3 ? 3 : payload;
      state.rowCount = rowCount;
    },
    addHexRow(state, { row, index }) {
      state.hexRows.push(row);
    },
    addHexRowToStash(state, { row, index }) {
      state.hexRowsStash.push(row);
    },
    removeHexRow(state) {
      state.hexRows.pop();
    },
    replaceHexRow(state, { row, index }) {
      state.hexRows[index] = row;
    },
    replaceHexRowInStash(state, { row, index }) {
      state.hexRowsStash[index] = row;
    },
    removeHexColumn(state, { indexParity }) {
      state.hexRows.map((row, i) => i % 2 == indexParity && row.pop());
    },
    setInitialHexRows(state, payload) {
      state.hexRows = payload;
    },
    setInitialHexRowsStash(state, payload) {
      state.hexRowsStash = payload;
    },
    refreshTileSize(state) {
      state.viewportWidth = visualViewport.width;
    },
  },
  actions: {
    getRowFromStash(context, index) {
      return context.state.hexRowsStash[index] || null;
    },
    storeHexRow(context, { row, index }) {
      context.commit("addHexRow", { row, index });

      if (index == context.state.hexRowsStash.length) {
        context.commit("addHexRowToStash", { row: [...row], index });
      }
    },
    storeModifiedHexRow(context, { row, index }) {
      const stashedCopyOfRow = context.state.hexRowsStash[index];

      if (row.length > stashedCopyOfRow.length) {
        context.commit("replaceHexRow", { row, index });
        context.commit("replaceHexRowInStash", { row: [...row], index });
      } else {
        context.commit("replaceHexRow", { row, index });
      }
    },
    setInitialState(context) {
      const savedRowCount = parseInt(localStorage.getItem("rowCount"));
      const savedColumnCount = parseInt(localStorage.getItem("columnCount"));
      const savedHexRows = JSON.parse(localStorage.getItem("hexRows"));
      const savedHexStash = JSON.parse(localStorage.getItem("hexStash"));
      const savedStyle = JSON.parse(localStorage.getItem("style"));

      const rowCount = savedRowCount || 13;
      const columnCount = savedColumnCount || 13;
      const hexRows = savedHexRows || [];
      const hexStash = savedHexStash || [];
      const style = savedStyle || {
        tileSize: 6,
        gap: 0,
        borderWidth: 6,
      };

      context.commit("setRowCount", rowCount);
      context.commit("setColumnCount", columnCount);
      context.commit("setInitialHexRows", hexRows);
      context.commit("setInitialHexRowsStash", hexStash);
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
        hexRowsStash,
      } = context.state;
      const style = { tileSize, gap, borderWidth };

      localStorage.setItem("style", JSON.stringify(style));
      localStorage.setItem("rowCount", rowCount);
      localStorage.setItem("columnCount", columnCount);
      localStorage.setItem("hexRows", JSON.stringify(hexRows));
      localStorage.setItem("hexStash", JSON.stringify(hexRowsStash));
    },
    resetAdjustments() {
      localStorage.removeItem("style");
      localStorage.removeItem("rowCount");
      localStorage.removeItem("columnCount");
      localStorage.removeItem("hexRows");
      window.location.reload();
    },
    resetTiles() {
      localStorage.removeItem("hexRows");
      localStorage.removeItem("hexStash");
      window.location.reload();
    },
  },
  getters: {
    tileSize(state) {
      const thresholdInPx = 45;
      if (state.tileSize * (state.viewportWidth / 100) > thresholdInPx) {
        return state.tileSize;
      } else {
        return (thresholdInPx / state.viewportWidth) * 100;
      }
    },
  },
  modules: {},
});

store.watch(
  (state) => ({ ...state }),
  () => {
    //TODO - check that parameters match (rowCount, columnCount with total amount of hexes)
    store.dispatch("updateLocalStorage");
  }
);

export default store;

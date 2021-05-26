import { storeConfig } from "@/store";

export default {
  setInitialState(context) {
    const initialGrid = storeConfig.initialState.grid;
    const initialResourceData = storeConfig.initialState.resources;

    const savedRowCount = parseInt(localStorage.getItem("rowCount"));
    const savedColumnCount = parseInt(localStorage.getItem("columnCount"));
    const savedHexRows = JSON.parse(localStorage.getItem("hexRows"));
    const savedHexStash = JSON.parse(localStorage.getItem("hexStash"));
    const savedTileStyle = JSON.parse(localStorage.getItem("tileStyle"));
    const savedResourceData = JSON.parse(localStorage.getItem("resourceData"));

    const rowCount = savedRowCount || initialGrid.rowCount;
    const columnCount = savedColumnCount || initialGrid.columnCount;
    const hexRows = savedHexRows || initialGrid.hexRows;
    const hexStash = savedHexStash || initialGrid.hexRowsStash;
    const gap = savedTileStyle?.gap || initialGrid.gap;
    const tileSize = savedTileStyle?.tileSize || initialGrid.tileSize;
    const tileBorderWidth =
      savedTileStyle?.tileBorderWidth || initialGrid.tileBorderWidth;
    const resourceData =
      savedResourceData || initialResourceData;

    context.commit("setRowCount", rowCount);
    context.commit("setColumnCount", columnCount);
    context.commit("setInitialHexRows", hexRows);
    context.commit("setInitialHexRowsStash", hexStash);
    context.commit("setGap", gap);
    context.commit("setTileSize", tileSize);
    context.commit("setTileBorderWidth", tileBorderWidth);
    context.commit("setInitialResourceParameters", resourceData);
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
    const tileStyle = { gap, tileSize, tileBorderWidth };
    const resourceData = context.state.resources

    localStorage.setItem("rowCount", rowCount);
    localStorage.setItem("columnCount", columnCount);
    localStorage.setItem("hexRows", JSON.stringify(hexRows));
    localStorage.setItem("hexStash", JSON.stringify(hexRowsStash));
    localStorage.setItem("tileStyle", JSON.stringify(tileStyle));
    localStorage.setItem("resourceData", JSON.stringify(resourceData));
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
};

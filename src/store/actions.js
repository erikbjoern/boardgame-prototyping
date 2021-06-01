import { storeConfig } from "@/store";

export default {
  setInitialState(context) {
    const timeStamp = localStorage.getItem("timeStamp");

    if (new Date(timeStamp) < new Date("2021-06-01T18:18:56.926Z")) {
      localStorage.removeItem("hexRows");
      localStorage.removeItem("hexStash");
      localStorage.removeItem("tileStyle");
      localStorage.removeItem("resourceData");
      localStorage.setItem("timeStamp", new Date());

      return;
    }

    const initialGrid = storeConfig.initialState.grid;
    const initialResourceData = storeConfig.initialState.resources;
    const initialLandscapeData = storeConfig.initialState.landscapes;

    const savedRowCount = parseInt(localStorage.getItem("rowCount"));
    const savedColumnCount = parseInt(localStorage.getItem("columnCount"));
    const savedHexRows = JSON.parse(localStorage.getItem("hexRows"));
    const savedHexStash = JSON.parse(localStorage.getItem("hexStash"));
    const savedTileStyle = JSON.parse(localStorage.getItem("tileStyle"));
    const savedResourceData = null //JSON.parse(localStorage.getItem("resourceData"));

    const rowCount = savedRowCount || initialGrid.rowCount;
    const columnCount = savedColumnCount || initialGrid.columnCount;
    const hexRows = savedHexRows || initialGrid.hexRows;
    const hexStash = savedHexStash || initialGrid.hexRowsStash;
    const gap = savedTileStyle?.gap || initialGrid.gap;
    const tileSize = savedTileStyle?.tileSize || initialGrid.tileSize;
    const tileBorderWidth =
      savedTileStyle?.tileBorderWidth || initialGrid.tileBorderWidth;
    const resourceData = savedResourceData || initialResourceData;
    const landscapeData = initialLandscapeData

    context.commit("setRowCount", rowCount);
    context.commit("setColumnCount", columnCount);
    context.commit("setInitialHexRows", hexRows);
    context.commit("setInitialHexRowsStash", hexStash);
    context.commit("setGap", gap);
    context.commit("setTileSize", tileSize);
    context.commit("setTileBorderWidth", tileBorderWidth);
    context.commit("setInitialResourceData", resourceData);
    context.commit("setInitialLandscapeParameters", landscapeData);
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
    const resourceData = context.state.resources;

    localStorage.setItem("rowCount", rowCount);
    localStorage.setItem("columnCount", columnCount);
    localStorage.setItem("hexRows", JSON.stringify(hexRows));
    localStorage.setItem("hexStash", JSON.stringify(hexRowsStash));
    localStorage.setItem("tileStyle", JSON.stringify(tileStyle));
    localStorage.setItem("resourceData", JSON.stringify(resourceData));
    localStorage.setItem("timeStamp", new Date());
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

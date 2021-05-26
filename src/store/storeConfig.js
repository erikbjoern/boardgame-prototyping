import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import grid from "./modules/grid";
import resources from "./modules/resources";

export default class StoreConfig {
  constructor() {
    this.initialState = {
      root: {
        viewportWidth: window.visualViewport?.width || 1400,
      },
      grid: {
        rowCount: 13,
        columnCount: 13,
        hexRows: [],
        hexRowsStash: [],
        gap: 0,
        tileSize: 6,
        tileBorderWidth: 6,
      },
      resources: {
        parameters: [
          {
            type: "stone",
            max: 9,
            chance: 25,
            fraction: 1,
          },
          {
            type: "wood",
            max: 9,
            chance: 25,
            fraction: 2,
          },
          {
            type: "wheat",
            max: 9,
            chance: 25,
            fraction: 3,
          },
        ],
        visibleValues: false,
        distributionMode: "FRACTION",
      },
    };
  }

  create(args = {}) {
    return {
      state: args.rootState || this.initialState.root,
      mutations,
      actions,
      modules: {
        grid,
        resources,
      },
    };
  }
}

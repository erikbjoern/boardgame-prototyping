import { createLocalVue } from "@vue/test-utils";
import { storeConfig } from "@/store";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);

const store = new Vuex.Store(
  storeConfig.create({ rootState: { viewportWidth: 1400 } })
);

describe("store", () => {
  it("initialises with null state", () => {
    expect(store.state).toStrictEqual({
      viewportWidth: 1400,
      grid: {
        rowCount: null,
        columnCount: null,
        tileRows: [],
        tileRowsStash: [],
        gap: null,
        tileSize: null,
        tileBorderWidth: null,
      },
      resources: {
        parameters: [
          {
            chance: null,
            max: null,
            type: null,
          },
        ],
      },
    });
  });
});

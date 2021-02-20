<template>
  <div class="inputs-bar">
    <div>
      <label>Rader</label>
      <div class="input-buttons">
        <div
          @click="rows < 23 && (rows += 1)"
          :class="{ disabled: rows == 23 }"
        >
          <span>+</span>
        </div>
        <div @click="rows > 3 && (rows -= 1)" :class="{ disabled: rows == 3 }">
          <span>−</span>
        </div>
      </div>
      <input readonly type="number" min="3" max="23" v-model="rows" />
    </div>
    <div>
      <label>Kolumner</label>
      <div class="input-buttons">
        <div
          @click="columns < 23 && (columns += 1)"
          :class="{ disabled: columns == 23 }"
        >
          <span>+</span>
        </div>
        <div
          @click="columns > 3 && (columns -= 1)"
          :class="{ disabled: columns == 3 }"
        >
          <span>−</span>
        </div>
      </div>
      <input readonly type="number" min="3" max="30" v-model="columns" />
    </div>
    <div>
      <label htmlFor="tile-size">Storlek</label>
      <input
        id="tile-size"
        type="range"
        min="5"
        max="40"
        v-model.number="tileSize"
      />
    </div>
    <div>
      <label htmlFor="gap">Mellanrum</label>
      <input id="gap" type="range" min="0" max="20" v-model.number="gap" />
    </div>
    <div>
      <label htmlFor="border">Bård</label>
      <input
        id="border"
        type="range"
        min="0"
        max="20"
        v-model.number="borderWidth"
      />
    </div>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
export default {
  name: "InputsBar",
  computed: {
    tileSize: {
      get() {
        return this.$store.state.style.tileSize * 2
      },
      set(value) {
        this.$store.commit("setTileSize", value / 2);
      },
    },
    gap: {
      get() {
        return this.$store.state.style.gap * 10
      },
      set(value) {
        this.$store.commit("setGap", value / 10);
      },
    },
    borderWidth: {
      get() {
        return this.$store.state.style.borderWidth;
      },
      set(value) {
        this.$store.commit("setBorderWidth", value);
      },
    },
    columns: {
      get() {
        return this.$store.state.columns;
      },
      set(value) {
        this.$store.commit("setColumns", value);
      },
    },
    rows: {
      get() {
        return this.$store.state.rows;
      },
      set(value) {
        this.$store.commit("setRows", value);
      },
    },
  },
  methods: {
    reset() {
      this.$store.dispatch('reset')
    },
  },
};
</script>

<style lang="scss" scoped>
.inputs-bar {
  background-color: #efefef55;
  border-radius: 5px;
  display: inline-flex;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  gap: 10px;
  left: 50%;
  padding: 0.5vw;
  position: fixed;
  top: 1vw;
  transform: translateX(-50%);
  z-index: 1000;

  & > div {
    align-items: center;
    background-color: #aaaaaa55;
    border-radius: 3px;
    display: inline-flex;
    gap: 5px;
    padding: 3px;
  }
}

.input-buttons {
  display: inline-flex;
  gap: 2px;

  & > div {
    background-color: #eeeeee;
    border-radius: 4px;
    border: outset;
    cursor: pointer;
    height: 0.8em;
    padding: 0 2px;
    user-select: none;

    & > span {
      bottom: 0.2em;
      position: relative;
    }

    &:hover {
      background-color: #ffffffff;
    }

    &:active {
      border: inset;
    }

    &.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
}

input,
button {
  background-color: #eef1ef;
  border-radius: 3px;
  border: 1px solid #999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

button:hover {
  cursor: pointer;
  opacity: 0.6;
}

input[type="range"]:not(#tile-size) {
  width: 60px;
}

input[type="number"] {
  width: 20px;
  text-align: center;

  &::-webkit-inner-spin-button {
    display: none;
  }
}
</style>

export default {
  initialised(state) {
    state.initialised = true
  },
  updateViewportWidth(state) {
    state.viewportWidth = visualViewport.width
  },
  keydown(state, keyCode) {
    if (!state.keysPressed.includes(keyCode)) {
      state.keysPressed.push(keyCode)
    }
  },
  keyup(state, keyCode) {
    state.keysPressed.splice(state.keysPressed.indexOf(keyCode), 1)
  },
}

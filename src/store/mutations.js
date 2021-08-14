import { vuexfireMutations } from 'vuexfire'

export default {
  ...vuexfireMutations,
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
  inputFocused(state) {
    state.hasFocusedInput = true
  },
  inputBlurred(state) {
    state.hasFocusedInput = false
  },
  draggableIsOnDropzone(state, payload) {
    state.draggableIsOnDropzone = payload
  },
  draggableIsBeingDragged(state, payload) {
    state.draggableIsBeingDragged = payload
  },
}

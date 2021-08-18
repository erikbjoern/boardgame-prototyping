import { vuexfireMutations } from 'vuexfire'

export default {
  ...vuexfireMutations,
  isAwaitingFirstGridBuild(state, payload) {
    state.isAwaitingFirstGridBuild = payload
  },
  setFirestoreId(state, payload) {
    state.firestoreId = payload
  },
  setPreviousFirestoreIds(state, previousIds) {
    previousIds.forEach(id => state.previousFirestoreIds.unshift(id))
    state.previousFirestoreIds = state.previousFirestoreIds.slice(0, 2)
  },
  setSaveFileId(state, id) {
    state.saveFileId = id
  },
  useInitialState(state, payload) {
    state.useInitialState = !!payload
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

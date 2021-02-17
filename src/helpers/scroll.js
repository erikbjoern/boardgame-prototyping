export function dragToScroll(e) {
  const dX = this.mousePosition.x - e.clientX;
  const dY = this.mousePosition.y - e.clientY;
  this.mousePosition = { x: e.clientX, y: e.clientY };

  window.scrollBy({ top: dY, left: dX });
}

export function dragToScrollStart(e) {
  this.mousePosition = { x: e.clientX, y: e.clientY };

  this.$refs.mainContainer.style.cursor = "grabbing";
  document.body.style.userSelect = "none";
}

export function scrollToCenter() {
  const top = visualViewport.height / 2;
  const left = visualViewport.width / 2;
  setTimeout(() => {
    window.scrollTo({ top, left, behavior: "smooth" });
  }, 300);
}

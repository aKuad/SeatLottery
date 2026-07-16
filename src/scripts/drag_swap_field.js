/**
 * Make a field drag-swappable
 *
 * @param {HTMLElement} target_area Element field to search target elements
 * @param {string} target_class Element class of target
 */
function drag_swap_field(target_area, target_class) {
  let drag_from = null;
  let drag_to_current = null;

  Array.from(target_area.getElementsByClassName(target_class)).forEach(elem => {
    elem.draggable = true;

    elem.addEventListener("dragstart", () => {
      drag_from = elem;
      elem.classList.add("drag-swap-from");
    });
    elem.addEventListener("dragend", () => {
      elem.classList.remove("drag-swap-from");
      if(drag_to_current)
        drag_to_current.classList.remove("drag-swap-to");
    });

    elem.addEventListener("dragenter", () => {
      if(drag_to_current)
        drag_to_current.classList.remove("drag-swap-to");
      drag_to_current = elem;
      drag_to_current.classList.add("drag-swap-to");
    });
    elem.addEventListener("dragleave", () => {
      drag_to_current.classList.remove("drag-swap-to");
    });

    elem.addEventListener("dragover", ev => {
      ev.preventDefault();
    });
    elem.addEventListener("drop", ev => {
      const drag_to = elem;
      const dummy = document.createElement("div");

      if(drag_from === drag_to)
        return;

      // Swap drag_from and drag_to
      drag_from.parentNode.insertBefore(dummy, drag_from);  // Swap drag_from to dummy
      drag_from.remove();

      drag_to.parentNode.insertBefore(drag_from, drag_to);  // Swap drag_to to drag_from
      drag_to.remove();

      dummy.parentNode.insertBefore(drag_to, dummy);  // Swap dummy to drag_to
      dummy.remove();
    });
  });
}

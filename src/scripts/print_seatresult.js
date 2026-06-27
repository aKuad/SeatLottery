/**
 * print_seatresult.js
 *
 * @author aKuad
 */

/**
 * Lottery result printing to target element
 *
 * @param {HTMLElement} print_ele Element of field to print result
 */
function print_seatresult(print_ele, seatarray, members) {
  const members_normal = array_shuffle(members.normal);
  const members_priority = array_shuffle(members.priority);
  // let text_temp = "<ruby><rb>{name_b}</rb><rt>{name_r}</rt></ruby><br>[{num}]";
  print_ele.innerHTML = "";
  for(let i = seatarray.length - 1; i >= 0; i--) {
    let row = document.createElement("div");
    row.classList.add("seat-row");
    for(let j = 0; j < seatarray[i].length; j++) {
      let col = document.createElement("div");
      col.classList.add("seat-cell");
      col.classList.add("seat-cell-result");

      const seat_type = seatarray[i][j];
      if(seat_type === 0 || seat_type === 1) {
        const target_member_pop = (seat_type === 0) ? members_normal.pop() : members_priority.pop();

        // When no members remaining (target_member_pop === undefined), print nothing
        const target_member = target_member_pop ? target_member_pop : ["", null, null];

        // Ruby available or not
        if(target_member[1] !== null)
          col.innerHTML = `<ruby><rb>${target_member[0]}</rb><rt>${target_member[1]}</rt></ruby>`;
        else
          col.innerText = target_member[0];

        // When number available
        if(target_member[2] !== null)
          col.innerHTML += `<br>[${target_member[2]}]`;

      } else if(seat_type === 2) {
        // Do nothing
      } else if(seat_type === 3) {
        col.style.opacity = 0;
      }

      row.appendChild(col);
    }
    print_ele.insertBefore(row, print_ele.firstElementChild);
  }
}

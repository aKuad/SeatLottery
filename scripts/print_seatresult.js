/**
 * print_seatresult.js
 *
 * @author aKuad
 */

/**
 * Lottery result printing to target element
 *
 * @param {HTMLElement} print_ele
 */
function print_seatresult(print_ele, seatarray, members) {
  let m_nrm = array_shuffle(members.normal);
  let m_pri = array_shuffle(members.priority);
  let text_temp = "<ruby><rb>{name_b}</rb><rt>{name_r}</rt></ruby><br>[{num}]";
  print_ele.innerHTML = "";
  for(let i = seatarray.length - 1; i >= 0; i--) {
    let row = document.createElement("div");
    row.classList.add("seat-row");
    for(let j = 0; j < seatarray[i].length; j++) {
      let col = document.createElement("div");
      col.classList.add("seat-cell");
      col.classList.add("seat-cell-result");
      let m = [];
      switch(seatarray[i][j]) {
        case 0:
          if(m_nrm.length != 0) {
            m = m_nrm.pop();
            col.innerHTML = text_temp.replace("{name_b}", m[1])
                                     .replace("{name_r}", m[2])
                                     .replace("{num}", m[0]);
          }
          break;
        case 1:
          if(m_pri.length != 0) {
            m = m_pri.pop();
            col.innerHTML = text_temp.replace("{name_b}", m[1])
                                     .replace("{name_r}", m[2])
                                     .replace("{num}", m[0]);
          }
          break;
        case 2:
          break;
        case 3:
          col.style.opacity = 0;
          break;
        default:
          break;
      }
      row.appendChild(col);
    }
    print_ele.insertBefore(row, print_ele.firstElementChild);
  }
}

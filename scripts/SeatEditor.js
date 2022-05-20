/**
 * SeatEditor.js
 * 
 * @author aKuad
 */

/**
 * Seat editing field object
 *
 * @param {object} print_ele
 * @param {number} width
 * @param {number} height
 */
class SeatEditor {
  constructor(print_ele, width, height) {
    this.print_ele = print_ele;
    this.width = 1;
    this.height = 1;
    // Create initial 1x1 cell
    let row = document.createElement("div");
    row.classList.add("seat-row");
    row.appendChild(SeatEditor.createInitialCell());
    this.print_ele.appendChild(row);
    // Modify to specified cell count
    this.modifyWidth(width);
    this.modifyHeight(height);
  }

  /**
   * Seat width count modify method
   *
   * @param {number} width 
   */
  modifyWidth(width) {
    // When invalid input
    if(width <= 0) {
      throw new Error("Width specifying must be greater than zero.");
    }
    // Increase width
    while(this.width < width) {
      let rows = this.print_ele.querySelectorAll(".seat-row");
      for(let i = 0; i < this.height; i++) {
        rows[i].appendChild(SeatEditor.createInitialCell());
      }
      this.width++;
    }
    // Decrease width
    while (this.width > width) {
      let rows = this.print_ele.querySelectorAll(".seat-row");
      for(let i = 0; i < this.height; i++) {
        rows[i].removeChild(rows[i].lastChild);
      }
      this.width--;
    }
    // Seat counter update
    this.print_ele.dispatchEvent(new Event("click"));
  }

  /**
   * Seat height count modify method
   *
   * @param {number} height 
   */
  modifyHeight(height) {
    // When invalid input
    if(height <= 0) {
      throw new Error("Height specifying must be greater than zero.");
    }
    // Increase height
    while(this.height < height) {
      let row = document.createElement("div");
      row.classList.add("seat-row");
      for(let i = 0; i < this.width; i++) {
        row.appendChild(SeatEditor.createInitialCell());
      }
      this.print_ele.appendChild(row);
      this.height++;
    }
    // Decrease height
    while(this.height > height) {
      this.print_ele.removeChild(this.print_ele.lastChild);
      this.height--;
    }
    // Seat counter update
    this.print_ele.dispatchEvent(new Event("click"));
  }

  /**
   * Return seat type matrix array
   *
   * @returns {Array}
   */
  getSeatArray() {
    let ret = [];
    let cells = this.print_ele.querySelectorAll(".seat-cell");
    for(let i = 0; i < this.height; i++) {
      ret.push([]);
      for(let j = 0; j < this.width; j++) {
        ret[i].push(cells[i * this.width + j].seatType);
      }
    }
    return ret;
  }

  /**
   * Return seat count
   *
   * @returns {object} Object format: {"normal": num, "priority": num, "unused": num, "none": num}
   */
  getSeatCount() {
    let count = [0, 0, 0, 0];
    let cells = this.print_ele.querySelectorAll(".seat-cell");
    for(let i = 0; i < cells.length; i++) {
      count[cells[i].seatType]++;
    }
    return {"normal": count[0], "priority": count[1], "unused": count[2], "none": count[3]};
  }

  /**
   * Attach auto refresh normal seat counter
   *
   * @param {object} target_ele Print target HTMLElement
   */
  attachSeatCounterNormal(target_ele) {
    let handle = function() {
      target_ele.innerText = this.getSeatCount().normal;
    }.bind(this);
    this.print_ele.addEventListener("click",       handle);
    this.print_ele.addEventListener("contextmenu", handle);
    this.print_ele.dispatchEvent(new Event("click"));
  }

  /**
   * Attach auto refresh normal seat counter
   *
   * @param {object} target_ele Print target HTMLElement
   */
  attachSeatCounterPriority(target_ele) {
    let handle = function() {
      target_ele.innerText = this.getSeatCount().priority;
    }.bind(this);
    this.print_ele.addEventListener("click",       handle);
    this.print_ele.addEventListener("contextmenu", handle);
    this.print_ele.dispatchEvent(new Event("click"));
  }

  /**
   * Seat editing div element return
   *
   * @returns {object} Created element object
   */
  static createInitialCell() {
    let cell = document.createElement("div");
    cell.classList.add("seat-cell");
    cell.classList.add("seat-cell-edit");
    cell.classList.add("seat-cell-normal");
    cell.seatType = 0;
    cell.addEventListener("click", {"handleEvent": SeatEditor.seatTypeChange, "isIncrease": true});
    cell.oncontextmenu = function() { return false; };
    cell.addEventListener("contextmenu", {"handleEvent": SeatEditor.seatTypeChange, "isIncrease": false});
    return cell;
  }

  /**
   * Seat cell editing event
   *
   * @event HTMLDivElement#click
   * @param {Object} e PointerEvent
   */
  static seatTypeChange(e) {
    // Seat type number switch
    if(this.isIncrease) { e.currentTarget.seatType++; }
    else                { e.currentTarget.seatType--; }
    if(3 < e.currentTarget.seatType)      { e.currentTarget.seatType = 0; }
    else if(e.currentTarget.seatType < 0) { e.currentTarget.seatType = 3; }
    // View modification
    e.currentTarget.classList.remove("seat-cell-normal");
    e.currentTarget.classList.remove("seat-cell-priority");
    e.currentTarget.classList.remove("seat-cell-unused");
    e.currentTarget.classList.remove("seat-cell-none");
    switch(e.currentTarget.seatType) {
      case 0:
        e.currentTarget.classList.add("seat-cell-normal");
        break;
      case 1:
        e.currentTarget.classList.add("seat-cell-priority");
        break;
      case 2:
        e.currentTarget.classList.add("seat-cell-unused");
        break;
      case 3:
        e.currentTarget.classList.add("seat-cell-none");
        break;
      default:
        break;
    }
  }
}

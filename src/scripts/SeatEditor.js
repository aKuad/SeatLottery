/**
 * SeatEditor.js
 *
 * @author aKuad
 */

/**
 * Seat editing field object
 */
class SeatEditor {
  static #SEAT_TYPE_NUM_TO_CLASS = ["seat-cell-normal", "seat-cell-priority", "seat-cell-unused", "seat-cell-none"];

  /**
   * @constructs
   * @param {object} print_ele
   * @param {number} width
   * @param {number} height
   */
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
   * @param {number} width Width of seat grid to be modified
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
   * @param {number} height Height of seat grid to be modified
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
   * Get seat type as matrix
   *
   * @returns {number[][]} Seat type matrix array
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
   * Set seat type as matrix
   *
   * @param {number[][]} seat_array type matrix array to apply
   * @throws {TypeError} When passed object is not an Array
   * @throws {RangeError} When passed matrix is not square
   */
  setSeatArray(seat_array) {
    if(!seat_array instanceof Array)
      throw new TypeError("Invalid format - Root is not array");

    const seat_type_flat = seat_array.flat(1);

    if(!seat_type_flat.every(e => typeof e === "number"))
      throw new TypeError("Invalid format - Non number element detected");

    if(!seat_type_flat.every(e => [0,1,2,3].includes(e))) // All elements need to be 0~3 value
      throw new TypeError("Invalid format - Invalid element value detected");

    const height_count = seat_array.length;
    if(height_count === 0)
      throw new RangeError("Invalid format - Empty array passed");
    if(height_count > 20)
      throw new RangeError("Invalid format - Too large height array passed");

    // All row length need to be same
    const row_lengths = seat_array.map(elem => elem.length);
    if(!row_lengths.every(e => e === row_lengths[0]))
      throw new RangeError("Invalid format - Row length not same");

    const width_count = seat_array[0].length;
    if(width_count === 0)
      throw new RangeError("Invalid format - Row length is 0");
    if(width_count > 20)
      throw new RangeError("Invalid format - Too large width array passed");

    this.modifyHeight(height_count);
    this.modifyWidth(width_count);

    this.print_ele.querySelectorAll(".seat-cell").forEach((e, i) => {
      e.seatType = seat_type_flat[i];
      e.classList.remove("seat-cell-normal", "seat-cell-priority", "seat-cell-unused", "seat-cell-none");
      e.classList.add(SeatEditor.#SEAT_TYPE_NUM_TO_CLASS[seat_type_flat[i]]);
    });
    // Seat counter update
    this.print_ele.dispatchEvent(new Event("click"));
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
    let cell = document.createElement("button");
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
    e.currentTarget.classList.remove("seat-cell-normal", "seat-cell-priority", "seat-cell-unused", "seat-cell-none");
    e.currentTarget.classList.add(SeatEditor.#SEAT_TYPE_NUM_TO_CLASS[e.currentTarget.seatType]);
  }
}

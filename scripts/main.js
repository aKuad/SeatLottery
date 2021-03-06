/**
 * main.js
 *
 * @author aKuad
 */

/**
 * Attach events to page elements
 *
 * @event Window#load
 */
window.onload = function() {
  // InputCheck script attach
  new InputCheck(document.querySelector("#input-members"), "members");
  new InputCheck(document.querySelector("#input-seats-x"), "number");
  new InputCheck(document.querySelector("#input-seats-y"), "number");

  // Editing object create
  let membereditor = new MemberEditor(document.querySelector("#input-members"));
  let seateditor = new SeatEditor(document.querySelector("#seat-edit"),
                                  document.querySelector("#input-seats-x").value,
                                  document.querySelector("#input-seats-y").value);
  document.querySelector("#input-seats-x").addEventListener("change", function() {
    if(0 < this.value) { seateditor.modifyWidth(this.value); }
  });
  document.querySelector("#input-seats-y").addEventListener("change", function() {
    if(0 < this.value) { seateditor.modifyHeight(this.value); }
  });

  // Status view
  seateditor.attachSeatCounterNormal(document.querySelector("#stat-normal-seats"));
  seateditor.attachSeatCounterPriority(document.querySelector("#stat-priority-seats"));
  membereditor.attachMemberCounterNormal(document.querySelector("#stat-normal-members"));
  membereditor.attachMemberCounterPriority(document.querySelector("#stat-priority-members"));

  /**
   * Check all fields are filled completely
   *
   * @returns {boolean} Is valid
   */
  function isAllFieldsValid() {
    let seats = seateditor.getSeatCount();
    let members = membereditor.getMembersArray();
    if(members == null) { return false; }
    return document.querySelector("#input-members").isValid &&
           document.querySelector("#input-seats-x").isValid &&
           document.querySelector("#input-seats-y").isValid &&
           members.normal.length <= seats.normal &&
           members.priority.length <= seats.priority;
  }
  /**
   * GenerateTable button enable or not toggle event
   *
   * @event input-members#change
   * @event input-seats-x#change
   * @event input-seats-y#change
   */
  function checkSeatTableGeneratable() {
    document.querySelector("#ctrl-generate").disabled = !isAllFieldsValid();
  }
  document.querySelector("#input-members").addEventListener("change", checkSeatTableGeneratable);
  document.querySelector("#seat-edit").addEventListener("click", checkSeatTableGeneratable);
  document.querySelector("#seat-edit").addEventListener("contextmenu", checkSeatTableGeneratable);
  document.querySelector("#input-seats-x").addEventListener("change", checkSeatTableGeneratable);
  document.querySelector("#input-seats-y").addEventListener("change", checkSeatTableGeneratable);

  // Button - Generate seat table
  document.querySelector("#ctrl-generate").addEventListener("click", function() {
    if(isAllFieldsValid()) {
      print_seatresult(document.querySelector("#seat-result"),
                       seateditor.getSeatArray(),
                       membereditor.getMembersArray());
      document.querySelector("#view-seatset").style.display = "none";
      document.querySelector("#view-result").style.display = "";
    } else {
      alert("Incomplete inputs. Please complete all inputs.");
    }
  });

  // Button - Back to edit page
  document.querySelector("#ctrl-back").addEventListener("click", function() {
    document.querySelector("#view-seatset").style.display = "";
    document.querySelector("#view-result").style.display = "none";
  });

  // Button - Export as CSV
  document.querySelector("#ctrl-export").addEventListener("click", function() {
    let ret = "";
    let rows = document.querySelector("#seat-result").querySelectorAll(".seat-row");
    for(let i = 0; i < rows.length; i++) {
      let cols = rows[i].querySelectorAll(".seat-cell");
      let names = [];
      for(let j = 0; j < cols.length; j++) {
        let cell = cols[j].cloneNode(true);
        if(cell.querySelector("rt")) {
          cell.querySelector("rt").innerText = "";
        }
        names.push(cell.innerText.replace("[", " ["));
      }
      ret = ret.concat(names);
      ret += "\n";
    }
    this.href = URL.createObjectURL(new Blob([ret], {"type": "text/plain"}));
  });
}

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
  // Constants
  const LS_KEY_MEMBER = "member-input";
  const LS_KEY_LAYOUT = "layout-input";
  const LS_KEY_LAST_RESULT = "last-result";

  // InputCheck script attach
  new InputCheck(document.querySelector("#input-members"), "members");
  new InputCheck(document.querySelector("#input-seats-x"), "number");
  new InputCheck(document.querySelector("#input-seats-y"), "number");

  // Editing object create
  const membereditor = new MemberEditor(document.querySelector("#input-members"));
  const seateditor = new SeatEditor(document.querySelector("#seat-edit"),
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
    const seats = seateditor.getSeatCount();
    const members = membereditor.getMembersArray();
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
   * @event input-members#input
   * @event input-seats-x#change
   * @event input-seats-y#change
   */
  function checkSeatTableGeneratable() {
    document.querySelector("#ctrl-generate").disabled = !isAllFieldsValid();
  }
  document.querySelector("#input-members").addEventListener("input", checkSeatTableGeneratable);
  document.querySelector("#seat-edit").addEventListener("click", checkSeatTableGeneratable);
  document.querySelector("#seat-edit").addEventListener("contextmenu", checkSeatTableGeneratable);
  document.querySelector("#input-seats-x").addEventListener("change", checkSeatTableGeneratable);
  document.querySelector("#input-seats-y").addEventListener("change", checkSeatTableGeneratable);

  // Auto restore
  try { // Error suspension for when localstorage unavailable (throws SecurityError)
    const member_input = localStorage.getItem(LS_KEY_MEMBER);
    if(member_input) {
      document.querySelector("#input-members").value = member_input;
      document.querySelector("#input-members").dispatchEvent(new Event("input"));
    }

    const layout_input = localStorage.getItem(LS_KEY_LAYOUT);
    if(layout_input) {
      const layout_json = JSON.parse(layout_input);
      seateditor.setSeatArray(layout_json);
      document.querySelector("#input-seats-x").value = layout_json[0].length;
      document.querySelector("#input-seats-y").value = layout_json.length;
    }

    const last_result = localStorage.getItem(LS_KEY_LAST_RESULT);
    if(last_result) {
      document.querySelector("#seat-result").innerHTML = last_result;
      document.querySelector("#ctrl-last-result-redisplay").disabled = false;
      document.querySelector("#ctrl-last-result-discard").disabled = false;
    }
  } catch(_e) {
    // Do nothing, continue other processes
  }

  // Auto store on close
  window.addEventListener("beforeunload", () => {
    const member_input = document.querySelector("#input-members").value;
    if(member_input)
      localStorage.setItem(LS_KEY_MEMBER, member_input);
    else
      localStorage.removeItem(LS_KEY_MEMBER); // For initial value (empty), remove old memory

    const layout_input = JSON.stringify(seateditor.getSeatArray());
    if(layout_input != "[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]")
      localStorage.setItem(LS_KEY_LAYOUT, layout_input);
    else
      localStorage.removeItem(LS_KEY_LAYOUT); // For initial value, remove old memory
  });

  // Button - Members file input
  document.querySelector("#input-members-file").addEventListener("input", async e => {
    const file = e.target.files[0];
    if(!file) return; // If no files input, do nothing
    const file_text = await file.text();

    if(!document.querySelector("#input-members").value.endsWith('\n'))
      document.querySelector("#input-members").value += '\n';
    document.querySelector("#input-members").value += file_text;

    document.querySelector("#input-members").dispatchEvent(new Event("input"));  // For run input check

    // Allow same file input again
    e.target.type = "button";
    e.target.type = "file";
  });

  // Button - Members input delete
  document.querySelector("#members-delete").addEventListener("click", () => {
    document.querySelector("#input-members").value = "";
  });

  // Button - Layout file input
  document.querySelector("#input-layout-file").addEventListener("input", async e => {
    const file = e.target.files[0];
    if(!file) return; // If no files input, do nothing

    try {
      const file_text = await file.text();
      const file_json = JSON.parse(file_text);
      seateditor.setSeatArray(file_json);
      document.querySelector("#input-seats-x").value = file_json[0].length;
      document.querySelector("#input-seats-y").value = file_json.length;
    } catch(e) {
      if(e.name === "SyntaxError")
        alert("Failed to load the file:\nInvalid as a JSON file");
      else
        alert(e.message);
    }

    // Allow same file input again
    e.target.type = "button";
    e.target.type = "file";
  });

  // Button - Layout file output
  document.querySelector("#output-layout-file").addEventListener("click", () => {
    const layout = seateditor.getSeatArray();
    const layout_str = JSON.stringify(layout);
    export_as_download(new Blob([layout_str], { type: "application/json" }), "layout.json");
  });

  // Button - Layout reset
  document.querySelector("#layout-reset").addEventListener("click", () => {
    seateditor.setSeatArray([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]);
    document.querySelector("#input-seats-x").value = 6;
    document.querySelector("#input-seats-y").value = 5;
  });

  // Button - Generate seat table
  document.querySelector("#ctrl-generate").addEventListener("click", function() {
    if(isAllFieldsValid()) {
      print_seatresult(document.querySelector("#seat-result"),
                       seateditor.getSeatArray(),
                       membereditor.getMembersArray());
      document.querySelector("#view-seatset").style.display = "none";
      document.querySelector("#view-result").style.display = "";

      localStorage.setItem(LS_KEY_LAST_RESULT, document.querySelector("#seat-result").innerHTML);
      document.querySelector("#ctrl-last-result-redisplay").disabled = false;
      document.querySelector("#ctrl-last-result-discard").disabled = false;

    } else {
      alert("Incomplete inputs. Please complete all inputs.");
    }
  });

  // Button - Redisplay last result
  document.querySelector("#ctrl-last-result-redisplay").addEventListener("click", () => {
    document.querySelector("#view-seatset").style.display = "none";
    document.querySelector("#view-result").style.display = "";
  });

  // Button - Discard last result
  document.querySelector("#ctrl-last-result-discard").addEventListener("click", () => {
    localStorage.removeItem(LS_KEY_LAST_RESULT);
    document.querySelector("#ctrl-last-result-redisplay").disabled = true;
    document.querySelector("#ctrl-last-result-discard").disabled = true;
  });

  // Button - Back to edit page
  document.querySelector("#ctrl-back").addEventListener("click", function() {
    document.querySelector("#view-seatset").style.display = "";
    document.querySelector("#view-result").style.display = "none";
  });

  // Button - Export as CSV
  document.querySelector("#ctrl-export").addEventListener("click", function() {
    const csv = [];
    const rows = document.querySelector("#seat-result").querySelectorAll(".seat-row");
    for(let i = 0; i < rows.length; i++) {
      const cols = rows[i].querySelectorAll(".seat-cell");
      const names = [];
      for(let j = 0; j < cols.length; j++) {
        const cell = cols[j].cloneNode(true);
        if(cell.querySelector("rt"))
          cell.querySelector("rt").innerText = "";  // Remove ruby
        names.push(cell.innerText.replace("[", " ["));
      }
      csv.push(names.join());
      csv.push("\n");
    }
    export_as_download(new Blob(csv, { type: "text/csv" }), "seat.csv");
  });
}

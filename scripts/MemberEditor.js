/**
 * MemberEditor.js
 *
 * @author aKuad
 */

/**
 * Member editing textarea object
 */
class MemberEditor {
  /**
   * @constructs
   * @param {HTMLElement} obj_ele Textarea HTMLElement
   */
  constructor(obj_ele) {
    this.obj_ele = obj_ele;
  }

  /**
   * Return members data as array from string
   *
   * @returns {object} Member data (When invalid syntax, return null)
   */
  getMembersArray() {
    let members = this.obj_ele.value.split("\n");
    let ret = {"normal": [], "priority": []};

    for(let i = 0; i < members.length; i++) {
      if(members[i] == "") { continue; }  // Ignore empty line
      let m = members[i].split(",");
      if(m.length < 3) { return null; }   // On too few columns
      // On short syntax (3 columns)
      if(m.length == 3) {
        m.splice(2, 0, "");
      }
      if(m[3] == "1") { ret.priority.push(m); }
      else            { ret.normal.push(m); }
    }

    return ret;
  }

  /**
   * Attach auto refresh normal member counter
   *
   * @param {object} target_ele Print target HTMLElement
   */
  attachMemberCounterNormal(target_ele) {
    function handle() {
      if(this.getter()) {
        target_ele.innerText = this.getter().normal.length;
      } else {
        target_ele.innerText = "-";
      }
    }
    this.obj_ele.addEventListener("change", {"getter": this.getMembersArray, "obj_ele": this.obj_ele, "handleEvent": handle});
    target_ele.innerText = "-";
  }

  /**
   * Attach auto refresh priority member counter
   *
   * @param {object} target_ele Print target HTMLElement
   */
  attachMemberCounterPriority(target_ele) {
    function handle() {
      if(this.getter()) {
        target_ele.innerText = this.getter().priority.length;
      } else {
        target_ele.innerText = "-";
      }
    }
    this.obj_ele.addEventListener("change", {"getter": this.getMembersArray, "obj_ele": this.obj_ele, "handleEvent": handle});
    target_ele.innerText = "-";
  }
}

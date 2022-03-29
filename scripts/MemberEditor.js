/**
 * MemberEditor.js
 *
 * @author aKuad
 */

/**
 * Member editing textarea object
 *
 * @param {Object} obj_ele Textarea HTMLElement
 */
class MemberEditor {
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
      if(members[i] == "") { continue; }
      let m = members[i].split(",");
      if(m.length < 3) { return null; }
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
  }
}

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
    const lines = this.obj_ele.value.split("\n");
    const member_array = {normal: [], priority: []};

    lines.forEach(line => {
      if(line === "") return;  // Ignore empty line

      const line_parts = line.split(",", 4);
      let is_priority = false;
      let name = "";
      let ruby = null;
      let num = null;

      switch(line_parts.length) {
        case 1:
          name = line_parts[0];
          break;

        case 2:
          is_priority = line_parts[0] === "1";
          name = line_parts[1];
          break;

        case 3:
          is_priority = line_parts[0] === "1";
          name = line_parts[1];
          num = line_parts[2];
          break;

        case 4:
          is_priority = line_parts[0] === "1";
          name = line_parts[1];
          ruby = line_parts[2];
          num = line_parts[3];
          break;

        default:
          break;
      }

      if(is_priority)
        member_array.priority.push([name, ruby, num]);
      else
        member_array.normal.push([name, ruby, num]);
    });

    return member_array;
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
    this.obj_ele.addEventListener("input", {"getter": this.getMembersArray, "obj_ele": this.obj_ele, "handleEvent": handle});
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
    this.obj_ele.addEventListener("input", {"getter": this.getMembersArray, "obj_ele": this.obj_ele, "handleEvent": handle});
    target_ele.innerText = "-";
  }
}

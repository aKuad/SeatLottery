/**
 * InputCheck.js
 *
 * @author aKuad
 */

/**
 * Field input check and view change script appending class
 *
 * @param {object} element Check target element
 * @param {string} type Checking type specification ("number" or "members")
 */
class InputCheck {
  constructor(element, type) {
    this.element = element;
    this.type = type;
    this.element.classList.add("input-view-normal");

    switch(this.type) {
      case "number":
        this.element.isValid = true;
        this.element.addEventListener("change", function() {
          if(this.value <= 0 || 99 < this.value) {
            this.isValid = false;
            this.classList.add("input-view-invalid");
          } else {
            this.isValid = true;
            this.classList.remove("input-view-invalid");
          }
        });
        break;

      case "members":
        this.element.isValid = false;
        this.element.addEventListener("change", function() {
          if(!InputCheck.checkMembersInput(this.value)) {
            this.isValid = false;
            this.classList.add("input-view-invalid");
          } else {
            this.isValid = true;
            this.classList.remove("input-view-invalid");
          }
        });
        break;

      case "":
        throw new Error("Check type unspecified");

      default:
        throw new Error("Unknown check type '" + this.type + "'");
    }
  }

  /**
   * Check a string follow members specification rule
   *
   * @param {string} value Check target string
   * @return {boolean} Follow specification rule or not
   */
  static checkMembersInput(value) {
    if(value == "") { return false; }
    let members = value.split("\n");
    for(let i in members) {
      if(members[i] == "") { continue; }  // Ignore empty line
      if(members[i].split(",").length < 3) { return false; }
    }
    return true;
  }
}

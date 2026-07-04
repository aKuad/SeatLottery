/**
 * InputCheck.js
 *
 * @author aKuad
 */

/**
 * Field input check and view change script appending class
 */
class InputCheck {
  /**
   * @constructs
   * @param {HTMLElement} element Check target element
   * @param {string} type Checking type specification ("number" or "members")
   */
  constructor(element, type) {
    this.element = element;
    this.type = type;
    this.element.classList.add("input-view-normal");

    switch(this.type) {
      case "number":
        this.element.isValid = true;
        this.element.addEventListener("change", e => {
          if(e.target.value <= 0 || 20 < e.target.value) {
            e.target.isValid = false;
            e.target.classList.add("input-view-invalid");
          } else {
            e.target.isValid = true;
            e.target.classList.remove("input-view-invalid");
          }
        });
        break;

      case "members":
        this.element.isValid = false;
        this.element.addEventListener("input", e => {
          if(!InputCheck.checkMembersInput(e.target.value))
            e.target.isValid = false;
          else
            e.target.isValid = true;
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
    // When only \n or blank string, returns false (invalid)
    return !/^\n*$/.test(value);
  }
}

/**
 * parse_members.js
 *
 * @author aKuad
 */

/**
 * Return members data as array from string
 *
 * @param {string} value 
 * @returns {Array}
 */
 function parse_members(value) {
  let members = value.split("\n");
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

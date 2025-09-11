/**
 * array-shuffle.js
 *
 * @author aKuad
 */

/**
 * Receive an array and return a new array which is shuffled
 *
 * @param {Array} org Shuffle target array
 * @returns Random shuffled array
 */
function array_shuffle(org) {
  let clo = org.slice();
  let ret = [];
  for(i = org.length; i > 0; i--) {
    ret.push(clo.splice(Math.floor(Math.random() * i), 1)[0]);
  }
  return ret;
}

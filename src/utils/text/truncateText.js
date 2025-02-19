/**
 * Function that truncates the provided text within the set limit.
 *
 * @memberof utils
 * @function truncateText
 * @param {string} text - Text to be truncated
 * @returns {string} Returns the truncated text
 */
const truncateText = (text) => {
  if (text.length > 25) {
    return `${text.substring(0, 25)}...`;
  }
  return text;
};

export default truncateText;

/**
 * Simple String utility file
 * Keeping it lean and mean
 */

function trim(str) {
  if (checkVarIsAString(str)) {
    //Remove leading and trailing whitespaces
    str = str.replace(/^\s*/, "");
    str = str.replace(/\s*$/, "");

    return str;
  }

  return "";
}

function removeWhiteSpacesAndNewLines(str) {
  if (checkVarIsAString(str)) {
    str = str.replace(/^\s*\n*\s*/, "");
    str = str.replace(/\s*\n*\s*$/, "");

    return str;
  }

  return "";
}

function checkVarIsAString(v) {
  return v && typeof v === "string";
}


module.exports.trim = trim;
module.exports.removeWhiteSpacesAndNewLines = removeWhiteSpacesAndNewLines;
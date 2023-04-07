const PASS = "Pass:";
const FAIL = "Fail:";
/**
 * @param {string} testThis - Compare this
 * @param {string} equalesThis - To this for equality  this
 */
function testEquales(testThis, equalesThis) {
  return test_(() => { return testThis == equalesThis }, "testEquales", testThis);
}
function testNotEquales(testThis, notEqualesThis) {
  return test_(() => { return testThis != notEqualesThis }, "testNotEquales", testThis);
}
function testIncludes(testThis, includesThis) {
  return test_(() => { return testThis + "".includes(includesThis) }, "testIncludes", testThis);
}
function testNotIncludes(testThis, notIncludesThis) {
  return test_(() => { return !(testThis + "".includes(includesThis)) }, "testNotIncludes", testThis);
}
function testLog(toLog) {
  return test_(() => { return true;}, "testLog", toLog);
}
function testTrue(testThis) {
  return test_(() => { return testThis}, "testTrue", testThis);
}
function testFalse(testThis) {
  return test_(() => { return !testThis}, "testFalse", testThis);
}
/**
 * 
 */
function test_(operator, name, echo) {
  var res = operator();
  var pass_fail = res ? PASS : FAIL;
  var stack = testCalledFrom_(res);
  echo = JSON.stringify(echo);
  var log = `${pass_fail} ${name}, ${stack}. For [${echo}]`;
  res ? console.log(log) : console.error(log);
  return res;
}

/**
 * @param {boolean} passed - True if the test passed. 
 * @return {string} If the test passed then only the relevent line number of the calling part of the stack is freturned. Otherwise the entire stack trace is returned.
 */
function testCalledFrom_(passed) {
  var res;
  res = (new Error()).stack;
  if (passed) {
    var i = res.indexOf("    at __GS_INTERNAL_top_function_call__")

    res = res.substring(0, i - 1);
    i = res.lastIndexOf("at ");

    res = res.substring(i);
  }
  return res;
}
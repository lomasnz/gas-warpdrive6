function test_testEquales() {
  testEquales("test", "test");
  testEquales("test", "untest");
}

function test_Stack() {
  var s = (new Error()).stack;
  console.log(s);
  s.search()
}

function test_find() {
  var s = (new Error()).stack;
  var i = s.indexOf("__GS_INTERNAL_top_function_call__")
  var k = s.lastIndexOf("at ", i);
  var n = s.substring(10, k);
  console.log(i);
  console.log(k);

  console.log(s);
  console.log(n);
}

function test_CalledFrom() {
  console.log((testCalledFrom_()));
}

function testStack() {
  console.log(new Error().stack);
}

function split_test() {
  var description = "<h1><font color='#61166d'><b>CHECKLISTS</b></font></h1>Use a checklist to help ensure the quality and accuracy of work. It is best to start using these types of checklists ▶️ at the same time the work is started and these types of checklists ◀️ to check the output when the task is finished.";

  if (description.startsWith("<h1>")) {

    var splitDecs = description.split("</h1>");
    console.log(splitDecs.length);
    console.log(splitDecs[0]);
    
    if (splitDecs.length == 2) {
      description = splitDecs[1];
      console.log("S6UIService.createParagraph('<h1>'", splitDecs[0]);
      descriptionOnly = false;
    }
  }
}
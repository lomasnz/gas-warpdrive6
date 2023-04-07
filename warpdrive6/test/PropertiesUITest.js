function test_repFunc() {
  var card = CardService.newCardBuilder();
  card.setName("Test");
  card.setHeader(CardService.newCardHeader().setTitle("Header"));
  var res = card.build();
  console.log(res.printJson());
  res.printJson = function () {
    return { "hi": "hello" };
  };
  console.log(res.printJson());
}



function test_regEx() {
  var r = "[{].+[#]"
  var doc = DocumentApp.openByUrl("https://docs.google.com/document/d/1FsxyFiDW2yZsLLV2X011hHsQiS_ZSfcYi-Lp-Oie17Q/edit");

  // var s = er.getElement().asText().getText().split("{");
  // console.log(er.getElement().asText().getText());

  var elementRange;
  var count = 0;
  var map = new Map();
  while (true) {
    elementRange = test_next(doc, elementRange);
    if (elementRange != null) {
      var s = elementRange.getElement().asText().getText().split("{");
      console.log(s);
      for (let i = 1; i < s.length; i++) {
        var s1 = s[i].split("#");
        //console.log(s1[0].toString());
        let x = 1;
        var item = map.get(s1[0]);
        if (item != null) {
          x = item + 1;
        }
        console.log(item, ":", x);
        map.set(s1[0], x);
        count++;
      }
    }
    else {
      break;
    }
  }
  map.forEach((value, key) => {
    console.log(key, ":", value);
  });

  console.log("Count[", count, "]");


}
function test_next(doc, re) {
  var r = "[{].+[#]";
  if (re) {
    console.log(re.isPartial(),);
  }
  var res = doc.getBody().findText(r, re);
  return res;
}
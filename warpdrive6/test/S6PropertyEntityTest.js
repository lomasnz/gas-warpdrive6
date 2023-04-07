function test_newProp() {
  //S6Cache.userCacheClear();
  var res = S6PropertyService.newForBuild("1LSgRdUA2Afu1_R0v7w_RvUJkOgfHQJ3p", "customer.account", true);
  console.log(res.properties);
  console.log(res.properties.length);
}

function testPrintf() {
  var list = "a,b"
  var value = "";
  var res = Utilities.formatString("%s,",list,EMPTY,value,EMPTY,"last");
  console.log(res);
}


function test_Auto() {
  var propos = {
    AUTOMATIC: 
    { '{tes}': 'tes', '{test2}': 'test2' },
    STANDARD:
    {
      '{global#doc.id2}': 'global#doc.id2',
      '{global#header}': 'global#header',
      '{global#doc.id}': 'global#doc.id',
      '{global#header2}': 'global#header2'
    }
  };
  var docPropsAuto = propos[PROPERTIES.AUTOMATIC];
  console.log(docPropsAuto.length);


  for (item in docPropsAuto) {
    console.log(docPropsAuto[item]);
  }
}
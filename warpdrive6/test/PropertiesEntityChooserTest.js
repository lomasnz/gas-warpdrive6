function testClearCache() {
  var res = findPropsForDoc("1FsxyFiDW2yZsLLV2X011hHsQiS_ZSfcYi-Lp-Oie17Q");
  res = findPropsForDoc("1FsxyFiDW2yZsLLV2X011hHsQiS_ZSfcYi-Lp-Oie17Q");
  S6Utility.userCacheClear();
   res = findPropsForDoc("1FsxyFiDW2yZsLLV2X011hHsQiS_ZSfcYi-Lp-Oie17Q");
}
function tesFind() {
  var res = findPropsForDoc("1FsxyFiDW2yZsLLV2X011hHsQiS_ZSfcYi-Lp-Oie17Q");
  console.log(res);

}

function mapProps() {
  var res = findAutomaticProperties("1j5Hv7CBvynpwnqd7dqCtpv-t3rttENBywDgF-VF8vYo");
  console.log(res);
}

function test_findProps() {
  var res = findProps("1j5Hv7CBvynpwnqd7dqCtpv-t3rttENBywDgF-VF8vYo");
  console.log(res);
}


function test_recordCache() {
  S6Utility.userCacheRecord("test4");
}
function testClaerCache() {
  S6Utility.userCacheClear();
}
function propertiesUser() { // 1272.0 , 1135.0
  var value = { a: 'a', b: 'b' }
  var key = 'ab';
  PropertiesService.getUserProperties().setProperty(key, value);
  var i = 0;
  var t = Date.now();
  while (i<100) {
    Logger.log( PropertiesService.getUserProperties().getProperty(key))
    i++
  }
  Logger.log( Date.now()-t);
}

function propertiesScript() { // 1190.0
  var value = { a: 'a', b: 'b' }
  var key = 'ab';
  PropertiesService.getScriptProperties().setProperty(key, value);
  var i = 0;
  var t = Date.now();
  while (i<100) {
    Logger.log( PropertiesService.getScriptProperties().getProperty(key))
    i++
  }
  Logger.log( Date.now()-t);
}

function cache() { // 4141.0
  var value = { a: 'a', b: 'b' }
  var key = 'ab';
  CacheService.getUserCache().put(key, JSON.stringify(value))
  var i = 0;
  var t = Date.now();
  while (i<100) {
    Logger.log( CacheService.getUserCache().get(key) )
    i++
  }
  Logger.log( Date.now()-t);
}

function test_Cache() {
  var j = {
    commonEventObject:
    {
      hostApp: 'DRIVE',
      parameters:
      {
        createType: '0',
        settingsUrl_1: 'https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit',
        fields_0: '{"field":"{domain-name}","value":"3mnz.co.nz","hint":"","id":"0ACbppDb17bdQUk9PVA","title":"Internet domain","type":"domain","mandatory":""}',
        fields_2: '{"field":"{short-name}","value":"3m","hint":"","id":"0ACbppDb17bdQUk9PVA","title":"Short name","type":"text","mandatory":""}',
        rootFolderID_0: '0ACbppDb17bdQUk9PVA',
        fields_3: '{"field":"{allfolders}","value":"","hint":"Select a folder","id":"0ACbppDb17bdQUk9PVA","title":"Opportunity (Folder)","type":"allfolders[{domain-name}]","mandatory":"YES"}',
        fileName_0: '{allfolders}\\{subfolder}\\SECTION6 LETTER TO {long-name} ON {today}',
        fields: '4',
        fields_4: '{"field":"{subfolder}","value":"","hint":"Optionally, create a new subfolder","id":"0ACbppDb17bdQUk9PVA","title":"(Optional) New Subfolder","type":"text","mandatory":"NO"}',
        fields_1: '{"field":"{long-name}","value":"3M NEW ZEALAND LIMITED","hint":"","id":"0ACbppDb17bdQUk9PVA","title":"Full name","type":"text","mandatory":""}',
        fileName: '0',
        templateUrl_0: 'https://docs.google.com/document/d/14McbVrzXFYhCEiqSlFYLNhBU4wBZ8eKeOxhNL0y6i60/edit',
        entity_0: 'Customer Accounts',
        settingsUrl_0: 'https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit',
        createType_0: 'TEMPLATE',
        rootFolderID: '0',
        templateUrl: '0',
        entity: '0',
        settingsUrl: '1'
      },
      timeZone: { offset: 43200000, id: 'Pacific/Auckland' },
      userLocale: 'en-GB',
      formInputs: { '{allfolders}': [Object] },
      platform: 'WEB'
    }
  };
    

  var cache = CacheService.getScriptCache();
  var res = cache.put("commonEventObject",JSON.stringify(j));
  console.log(res);
  res = cache.get("commonEventObject");
  console.log(JSON.parse(res));

}

function add(x=0) {
  return x+1;
}

function test_Eq() {

  let y = 0;
  if (y = add(10) && y == 11){
    console.log("made it");
  }
  console.log(y);


}

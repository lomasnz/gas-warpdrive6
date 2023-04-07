
function logParentFolder(file) {
  var p = file.getParents();
  
  // Check if the file has any parents
  if (p.hasNext()) {
    // Get the name of the parent folder
    var parent = p.next();
    var parentName = parent.getName();
    Logger.log('Parent folder name: ' + parentName);
    
    // Recursively call this function with the parent folder as the new file
    logParentFolder(parent);
  } else {
    Logger.log('The file has no parent folders');
  }
}

function test_Findfile(fileId = "T1heB7mVwhDC4j_AKzisEkltA8EpBwE9e7") {
  var file = DriveApp.getFileById(fileId);
  
  logParentFolder(file);
}

function createDriveSDKFile() {
  var folderName = "testfolder";
  var folder = DriveApp.getFoldersByName(folderName).next();
  var fileMetadata = {
    'title': 'Test Drive SDK File',
    'mimeType': 'application/vnd.google-apps.drive-sdk',
    'parents': [folder.getId()]
  };
  var file = Drive.Files.insert(fileMetadata);
  Logger.log('File ID: ' + file.id);
  test_Findfile(file.id);
}


function testDriveAppSpeed() {
  var id = "19Vzq8QRQzjtMcHOSoNR-jEbCH68035AH";

  console.time("DriveAppp");
  for (var i = 0; i < 10; i++) {
    var folder = DriveApp.getFolderById(id);
    console.log(folder.getName());
  }
  console.timeEnd("DriveAppp");

  console.time("S6DriveAppp");
  for (var i = 0; i < 10; i++) {
    var folder = S6DriveApp.getFolderById(id);
    console.log(folder.getName());
  }
  console.timeEnd("S6DriveAppp");

}

function mergeGoogleDocs() {
  var docIDs = ['1L0obRBIMYAokvIbaut7OCoWDV74YPb914sIauZRIUwQ', '10_T2He_-U_1CLrDDq9mAo33WiRIQJOfUu-U1KXZm8Gw', '1FYatwbgBbrzVnl_v5SluLOBZYzErax3zceeFBw6u6KY', '1Bpelij7oRgxsKGD-LnYHKKj5HMG4bcov8So9uIJJeS0', '1hXn_SgvjHFaG81VZZqt2VHK1s64WnK-AJc9ZfhKU668'];
  var baseDoc = DocumentApp.openById(docIDs[0]);

  var body = baseDoc.getBody();
  var footer = baseDoc.getFooter();
  var header = baseDoc.getHeader();
  console.log(body.toString());

  for (var i = 1; i < docIDs.length; ++i) {
    var otherBody = DocumentApp.openById(docIDs[i]).getBody();
    var totalElements = otherBody.getNumChildren();
    for (var j = 0; j < totalElements; ++j) {
      var element = otherBody.getChild(j).copy();
      var type = element.getType();
      if (type == DocumentApp.ElementType.PARAGRAPH) {
        if (body.appendParagraph) {
          var p = element.asParagraph();
          console.log(p.toString());
          body.appendParagraph(p);
        }
      }
      else if (type == DocumentApp.ElementType.TABLE) {
        console.log(element.asTable().toString());
        body.appendTable(element);
      }
      else if (type == DocumentApp.ElementType.LIST_ITEM) {
        console.log(element.asListItem().toString());
        body.appendListItem(element);
      }
      else throw new Error('Unknown element type: ' + type);
    }
  }
}
function testMerge() {
  var docIDs = ['1L0obRBIMYAokvIbaut7OCoWDV74YPb914sIauZRIUwQ', '1FYatwbgBbrzVnl_v5SluLOBZYzErax3zceeFBw6u6KY', '1Bpelij7oRgxsKGD-LnYHKKj5HMG4bcov8So9uIJJeS0', '1hXn_SgvjHFaG81VZZqt2VHK1s64WnK-AJc9ZfhKU668'];
  var baseDoc = DocumentApp.openById(docIDs[0]);

  var body = baseDoc.getBody();
  var footer = baseDoc.getFooter();
  var header = baseDoc.getHeader();

  for (var i = 1; i < docIDs.length; ++i) {
    var doc = DocumentApp.openById(docIDs[i]);
    console.log("Merge in:", doc.getName());

    _loopElements(doc.getBody(), body);
    if (!footer && doc.getFooter()) {
      footer = baseDoc.addFooter();
    }
    if (doc.getFooter()) {
      console.log("Merge in Fotter");
      _loopElements(doc.getFooter(), footer);
    }
    if (!header && doc.getHeader()) {
      header = baseDoc.addHeader();
    }
    if (doc.getHeader()) {
      console.log("Merge in Header");
      _loopElements(doc.getHeader(), header);
    }
    console.log("End Merge:", doc.getName());
  }
}
function _loopElements(parent, base) {
  var totalElements = parent.getNumChildren();
  for (var j = 0; j < totalElements; ++j) {
    _mergeElements(parent.getChild(j).copy(), base);
  }
}
function _mergeElements(element, base) {
  var type = element.getType();
  console.log("Merge type:", type.toString());
  if (type == DocumentApp.ElementType.PARAGRAPH) {
    base.appendParagraph(element);
  }
  else if (type == DocumentApp.ElementType.TABLE) {
    base.appendTable(element);
  }
  else if (type == DocumentApp.ElementType.LIST_ITEM) {
    base.appendListItem(element);
  }
  else if (type == DocumentApp.ElementType.FOOTER_SECTION) {
    var f = element.asFooterSection();
    _loopElements(f, base)
  }
  else if (type == DocumentApp.ElementType.HEADER_SECTION) {
    var h = element.asHeaderSection();
    _loopElements(h, base)
  }
  else throw new Error('Unknown element type: ' + type);
}
function testLogo() {
  var fields = [{
    field: '{brochure}',
    value: 'i4.0 Capabilities and Services',
    title: 'Brochure name',
    type: 'text',
    updateable: 'NO',
    rootField: 'YES',
    hint: 'Simple name that the brochures is referred to as'
  },
  {
    field: '{desc}',
    value: 'Describes SECTION6 services and capabilities through the lens of the 4th industrial revolution',
    title: 'Brief description',
    type: 'paragraph',
    updateable: 'YES',
    rootField: 'YES',
    hint: 'Brief description'
  },
  {
    field: '{last-updated}',
    value: 'July 1, 2021',
    title: 'Last major update',
    type: 'date',
    updateable: 'YES',
    rootField: 'YES',
    hint: 'The date this offering last had a major revision'
  }];

  var id = "19Vzq8QRQzjtMcHOSoNR-jEbCH68035AH"

  var path = S6Utility.replaceFieldInText(fields, "{brochure}\\1. Published\\Brochure_Image");
  console.log(path);
  var logo = S6Utility.getFileFromRootFolderIdAndFromPath(id, path);
  console.log(logo);
}
function testUi() {
  console.log("start");
  var ui = SpreadsheetApp.getUi();
  console.log(ui);
}
function testDriveActivity() {
  var t = Date.now().toPrecision();
  var request =
  {

    "item_name": "items/1uRSBzOWb_I8GfugQU9ao8FfX1b2wO540AozqIiDjj7s",
    "page_size": 10,
    "filter": "detail.action_detail_case:MOVE" //AND time > " + t
  };
  console.log(request);

  var res = DriveActivity.Activity.query(request);
  console.log(JSON.stringify(res));
}
function testAccess() {
  //var folder = DriveApp.getFolderById("0ANV7MiCMhrVHUk9PVA");
  //var folder = DriveApp.getFolderById("1OBCsmYi5NgGivt1-rWWZpijvkxYRhk3E");
  var folder = DriveApp.getFolderById("1p578n54gck-0VfTZ-MODwzbp9lqcD8cN");

  var email = Session.getActiveUser().getEmail();
  //var email = "sue.he@section6.com.au";

  var access = folder.getAccess(email);
  if (access == DriveApp.Permission.FILE_ORGANIZER) {
    console.log("DriveApp.Permission.FILE_ORGANIZER");
  }
  else if (access == DriveApp.Permission.ORGANIZER) {
    console.log("DriveApp.Permission.ORGANIZER");
  }
  else if (access == DriveApp.Permission.COMMENT) {
    console.log("DriveApp.Permission.COMMENT");
  }
  else if (access == DriveApp.Permission.EDIT) {
    console.log("DriveApp.Permission.COMMENT");
  }
  else if (access == DriveApp.Permission.NONE) {
    console.log("DriveApp.Permission.NONE");
  }
  else if (access == DriveApp.Permission.OWNER) {
    console.log("DriveApp.Permission.OWNER");
  }
  else if (access == DriveApp.Permission.VIEW) {
    console.log("DriveApp.Permission.VIEW");
  }

  // var ed = folder.getEditors();
  // console.log(ed.length);
  // for (e in ed) {
  //   console.log(ed[e].getEmail(), "/", ed[e].getName());
  // }
  // var vi = folder.getViewers();
  // console.log(vi.length);
  // for (v in vi) {
  //   console.log(vi[v].getEmail(), "/", ed[e].getName());
  // }
}
function test_SPlit() {
  var templateFolderAndFile = "catalist.co.nz/7.1 Contracts for Services (SOW)/SECTION6 CATALIST MARKETS LIMITED STATMENT OF WORK FOR 13 Apr 2022 11:22:27";
  var split = templateFolderAndFile.split(FOLDER_SEPERATOR);
  var fileName = split[split.length - 1];
  var folder = templateFolderAndFile.substring(0, templateFolderAndFile.length - fileName.length - 1);
  console.log(fileName);
  console.log(folder);
}
function test_Drive2() {
  //var res = Drive.Files.get("1GijvuHFE8blgUL0TeNC2FHE3X65h7DZz", { supportsAllDrives: true });
  // var res = UrlFetchApp.fetch("https://www.googleapis.com/drive/v2/files/1exFOqnLpgGp7vftzj1NCncBnAoUJcHpK");
  // console.log(res.getContent());

  var inr = {
    "folderId": '1GijvuHFE8blgUL0TeNC2FHE3X65h7DZz',
    "fields": "kind"
  };

  var res = Drive.Files.list(inr);
  console.log(res.items);

}
function test_getDirectoryNameForID(id) {
  var res;
  res = getDirectoryNameForID("1Fm1yu9gIgZAKsJ8Q0ghpdFj-crlbkuFu2ApcHDmXkuA");
  console.log(res);
}
function test_getDirectoryForId() {
  var res;
  res = getFolderDirectoryForId("1Fm1yu9gIgZAKsJ8Q0ghpdFj-crlbkuFu2ApcHDmXkuA");
  console.log(res);
}
function test_getTeamDriveName() {
  console.log(getTeamDriveName("0ACbppDb17bdQUk9PVA"));
}
function test_getFolderName() {
  var name = getFolderName_("1Fm1yu9gIgZAKsJ8Q0ghpdFj-crlbkuFu2ApcHDmXkuA");
  console.log("test_getFolderName()::" + name);
}
function test_getFolderNameForMYDrive() {
  var name = getFolderName_("my-drive");
  console.log(" test_getFolderNameForMYDrive()::" + name);
}
function test_getFolderNameForFileMYDrive() {
  // replace the string literal below with a file id you know is in you MyDrive folder.
  var name = getFolderName_("11PMzBNotveBLetWgLekzYtF97uY20GaSCL7QEHKTFM0");
  console.log("test_getFolderNameForFileMYDrive()::" + name);
}
function test_repeat() {
  var filler = " ".repeat(10);
  console.info("test_repeat()::>" + filler + '<');

}
function test_res() {
  var res = "the resulkt";
  var count = 10;
  return { res: res, count: count };
}
function test_test_res() {
  console.info(test_res());
}
function test_onDriveHomePage() {
  var res = onDriveHomePage(null);
  return res;
}

function test_desc() {
  var id = "1KGKzWYUVsSwVEVhFa0-mZDqGayXWjIo0";
  var folder = DriveApp.getFolderById(id);
  var desc = folder.getDescription();
  var listText = "{long-name}<br>{short-name}";
  testLog(desc);
  var json = eval('(' + desc + ')');
  testLog(JSON.stringify(json));
  var res = listText;
  for (i = 0; i < json.length; i++) {
    if (res.includes(json[i].field)) {
      res = res.replace(json[i].field, json[i].value);
    }
  }
  testLog(res);
  return res;

}

function testParam() {

  var param = {
    id: driveID
  };

}
function test_class() {
  var res = CardService.newCardBuilder().build;
  console.log(Object.getPrototypeOf(res).class); // == "Parent"

}

function testHTML() {
  HtmlService.createHtmlOutput().setXFrameOptionsMode()
}

function test_pushCreate(event) {
  var url = "https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit#gid=806626764";
  entity = "Hires";

  var event = {
    event:
    {
      commonEventObject:
      {
        parameters:
        {
          url: url,
          entity: entity
        }
      }
    }
  };
  var res = action_Create(event);
  console.log(res);
}

function test_createListManagedFolderCard() {
  var res = buildListEntities("0ACbppDb17bdQUk9PVA", "Hires");
}

function test_createCreateContentCard() {
  buildCreateCard("https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit#gid=806626764", "Customer", true);
}

function test_string() {
  var x = "thus is x";
  var test = "test";
  console.log(`${x} is here and ${test}`);

}

function test_getFolderName_(id) {
  return getFolderNameWithCount_(id, 1);
}

function testTeamDrive() {
    var root = S6DriveApp.getFolderById("1E-SQoIGpAvf1FNJls5iMA6uRFY8nO8XQ");
  console.log(root);
  console.log(root.getName());
  console.log(root.getParentFolder());
  console.log(root.getParentFolder().getName());


}
function test_getFolderNameWithCount_(id, count) {
  var res = "";
  var folder;

  console.info("getFolderNameWithCount_()::iteration:" + count);
  try {
    var folder = DriveApp.getFolderById(id);
  }
  catch (err) {
    console.error("Error" + err);
  }

  if (folder != null) {
    var name = folder.getName();
    var isTeamDrive = (name == "Drive" && !folder.getParents().hasNext()); // best guess that this is a team drive 
    if (!isTeamDrive) {
      var parents = folder.getParents();
      while (parents.hasNext()) {
        var filler = "\r" + spaces + " + ";
        res = name + filler;
        getFolderNameWithCount_(parents.next().getId(), count++);
        console.info("getFolderNameWithCount_()::not isTeamDrive:" + res);
        break;
      }
    }
    else {

      var params = {
        supportsTeamDrives: true,
        includeTeamDriveItems: true,
      };
      params.fields = "name";
      var td = Drive.Teamdrives.get(id, params);
      var name = td.name;
      var spaces = "x".repeat(count);
      var filler = "\r" + spaces;
      res = filler + name + res;
      console.info("getFolderNameWithCount_()::isTeamDrive:" + res);

    }
  }
  else {
    console.info("folder not found");
  }
  console.info("return:" + res);
  return { res: res, count: count };
}

function test_ResourceKeys() {
  var folder = DriveApp.getFolderById("1IUm-xW-S46blzsxRgx3ILUgTHd1JtmvW");
  console.info(folder);
  console.info(folder.getResourceKey());
}
function test_CreateExternalLink() {
  try {
    var file = Drive.Files.insert({ title: "DriveAppFile", mimeType: "application/vnd.google-apps.drive-sdk" });
    //console.log(file.getPrototypeOf());
    console.log(typeof file);

    console.log(file);
  }
  catch (err) {
    console.error(err);
  }

}

function test_getFoldersbyUrl() {
  var res = getSheetParametersFromUrl("https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit#gid=0");
  var ins = new Map();
  for (var i = 0; i < res.length; i++) {
    console.log(JSON.stringify(res[i]));

  }
}
function test_sheetParametersFromUrl() {
  var newValues = []
  newValues[0] = { field: "{customer}", value: "lomas.org.nz" };
  newValues[1] = { field: "{org}", value: "Lomas LTD" };

  var res = getFoldersFromSheetUrl("https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit#gid=0", newValues);
  for (var i = 0; i < res.length; i++) {
    console.log(JSON.stringify(res[i]));
  }
}
function test_getSheetParametersFromUrl() {
  var newValues = []
  newValues[0] = { field: "{customer}", value: "lomas.org.nz" };
  newValues[1] = { field: "{org}", value: "Lomas LTD" };
  newValues[2] = { field: "{trading-as}", value: "Lomas" };

  console.log("begin:sheetParametersFromUrl");
  var res = getFoldersFromSheetUrl("https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit#", newValues);
  console.log("end:sheetParametersFromUrl");
  for (var i = 0; i < res.length; i++) {
    console.log(JSON.stringify(res[i]));
  }
}
function test_sheetParametersFromUrl() {
  var newValues = []
  newValues[0] = { field: "{customer}", value: "lomas.org.nz" };
  newValues[1] = { field: "{org}", value: "Lomas LTD" };
  var res = mapCreateInstructions("https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit#gid=0", newValues);
  res.forEach((value, key) => {
    console.log(`Folder[${key}] Docs[${value}]`);
  });

}
function test_getRootFolder() {
  Logger.log(DriveApp.getRootFolder());
}
function test_doCreateFolders() {
  test_doCreateFolders2();
}
function test_doCreateFolders2() {
  var param = [];
  param[0] = {
    field: '{domain-name}',
    value: 'section6.io',
    title: 'Internet domain'
  };
  param[1] =
  {
    field: '{long-name}',
    value: 'SECTION6 LIMITED',
    title: 'Full name'
  }
    ;
  param[2] =
  {
    field: '{short-name}',
    value: 'SECTION6',
    title: 'Short name'
  };

  var foldersAndDocs = getFoldersFromSheetUrl("https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit#gid=0", param);
  var rootFolder = DriveApp.getFolderById("0ACbppDb17bdQUk9PVA");//ID for Current Clients folder goes here inside " "
  console.info("Creating template folders on root folder :" + rootFolder.getName());
  doCreateFoldersWork(foldersAndDocs, rootFolder, param);
}
function test_CopyFile() {
  var rootFolder = DriveApp.getFolderById("0ACbppDb17bdQUk9PVA");//ID for Current Clients folder goes here inside " "
  copyFile("https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit#gid=0", "testFile", rootFolder);

}

function test_getScriptFolderTree() {
  var thisScript = getThisScriptInDrive();
  var names = []
  var Ids = []
  var folder = thisScript.getParents()[0];

  while (folder.getName() != "Root") {
    names.unshift(folder.getName());
    Ids.unshift(folder.getId());
    var parents = folder.getParents();
    var folder = parents[0];
  }
  Logger.log('Root/' + names.join().replace(/,/g, '/'))
  Ids.unshift(DriveApp.getRootFolder().getId())
  Logger.log(Ids)
}

function test_PrintScriptFolder() {
  var scriptId = ScriptApp.getScriptId();
  console.info('scriptId = ' + scriptId);

  var file = DriveApp.getFileById(scriptId);
  var folders = file.getParents();
  console.info('scriptId = ' + folders);
  if (folders.hasNext()) {
    var folder = folders.next();
    var name = folder.getName();
    console.info('script folder name = ' + name);
  }
}
function test_DriveFile(file) {
  var result;
  try {
    result = Drive.Files.get(file, { fields: "owners, sharingUser" });
  }
  catch (err) {
    console.error(err);
  }
  console.info(result);

}
function testDrive() {
  test_DriveFile("1-uc_PGIEryR2gsw2Ra4FMXnpZ9T-QI5QfKV5SLorLDE");
}

function onDriveItemsSelected(e) {
  console.log("CODE.GS::onDriveItemsSelected");
}
function testCountFildes() {
  var count = countFilesInAllFolders(DriveApp.getFolderById("15sjGc9x0klvNjBS3wN7szekDR0_eCMp3"), 10);
  testEquales(count, 2);

}

function testSplit() {
  var image = 'vector.co.nz/1. Images/"vector.co.nz_logo"';
  var split = image.split('/');

  console.log(split);

}






const PROPERTIES_SHEETS = "PROPERTIES_SHEETS";
const PROPERTIES_COLUMNS = "PROPERTIES_COLUMNS";
const PROPERTY_SHEET_INFO = "SHEET.INFO";
const SHEET_ERROR = "#ERROR!"




const COL_FIELD_NAME = 0;
const COL_VALUE = 1;
const COL_TITLE = 2;
const COL_HINT = 3;

function action_PrepProperties(event) {
  var param = new Param(event);
  var docId = param.getFirst("active.document.id");
  var driveID = param.getFirst("driveID");
  var propsFileName = param.getFirst("properties.filename");
  var propsNameSpace = param.getFirst("properties.namespace");
  var entity = param.getFirst("entity");

  console.log("driveID:", driveID, "/propsFileName:", propsFileName);
  var rootFolder = DriveApp.getFolderById(driveID);
  var propsFile = S6Utility.getFileFromRootFolderAndFromPath(rootFolder, propsFileName);
  var propsFileId = propsFile.getId();
  var fields = param.getAllArrayOfJSON(FIELDS);
  return buildPropertiesCard(entity, propsFileId, propsNameSpace, docId, fields);
}

function action_buildPropertiesCard(event) {
  var res = S6UIService.createCard("Use Properties", "Work with document properties", ICON_SCATTER_URL);
  var param = new Param(event);
  var docId = param.getFirst("active.document.id");
  var driveID = param.getFirst("driveID");
  var propsFileName = param.getFirst("properties.filename");
  var propsNameSpace = param.getFirst("properties.namespace");
  var entity = param.getFirst("entity");

  console.log("driveID:", driveID, "/propsFileName:", propsFileName);
  var rootFolder = DriveApp.getFolderById(driveID);
  var propsFile = S6Utility.getFileFromRootFolderAndFromPath(rootFolder, propsFileName);
  var propsFileId = propsFile.getId();
  var fields = param.getAllArrayOfJSON(FIELDS);

  var tt = "taskType";
  console.log("TASK_APPLY_PROPERTIES",TASK_APPLY_PROPERTIES);
  param.addValue(tt, TASK_APPLY_PROPERTIES);
  
  console.log("put taskType", param.getFirst(tt));


  var sec = S6UIService.createSection();
  sec.addWidget(S6UIService.createActionLabel("Apply Properties", "Rreplace or insert properies into this document", ICON_SCATTER_URL, "action_PrepPropertiesApply", param.toJSON()));
  sec.addWidget(S6UIService.createActionLabel("Build Template", "Use properties to build a template", ICON_CODE_URL, "action_buildEntityChoice", param.toJSON()));

  res.addSection(sec);
  return res.build();

}

function action_PrepPropertiesBuildTemplate(event) {
  var param = new Param(event);
  var docId = param.getFirst("active.document.id");
  var driveID = param.getFirst("driveID");
  var propsFileName = param.getFirst("properties.filename");
  var propsNameSpace = param.getFirst("properties.namespace");
  var entity = param.getFirst("entity");

  console.log("driveID:", driveID, "/propsFileName:", propsFileName);
  var rootFolder = DriveApp.getFolderById(driveID);
  var propsFile = S6Utility.getFileFromRootFolderAndFromPath(rootFolder, propsFileName);
  var propsFileId = propsFile.getId();
  var fields = param.getAllArrayOfJSON(FIELDS);
  return buildPropertiesBuildTemplate(entity, propsFileId, propsNameSpace, docId, fields);

}

function action_PrepPropertiesApply(event) {
  var param = new Param(event);
  var docId = param.getFirst("active.document.id");
  var driveID = param.getFirst("driveID");
  var propsFileName = param.getFirst("properties.filename");
  var propsNameSpace = param.getFirst("properties.namespace");
  var entity = param.getFirst("entity");

  console.log("driveID:", driveID, "/propsFileName:", propsFileName);
  var rootFolder = DriveApp.getFolderById(driveID);
  var propsFile = S6Utility.getFileFromRootFolderAndFromPath(rootFolder, propsFileName);
  var propsFileId = propsFile.getId();
  var fields = param.getAllArrayOfJSON(FIELDS);
  return buildPropertiesApply(entity, propsFileId, propsNameSpace, docId, fields);
}


function buildPropertiesApply(entity, id, nameSpace, docId, fields) {
  var res = S6UIService.createCard("Apply Properties", "Replace or insert properties in this document", ICON_SCATTER_URL);
  var secHelp = S6UIService.createHelpSection("Applying Properties", "", `Properties are items that have a <b>title</b> (or name), a <b>value</b>, and a <b>field name</b>. From here you can replace a <b>field name</b> in this document with its <b>value</b> or <b>title: value</b>. You can choose to do this for a single item or, more conveniently, you can <b><font color='${PRIMARY_COLOUR}'>ACTION ALL</font></b> at once with the button at the footer.<br><br>Alternatively, directly insert properties into this document. When you insert, the action is executed at your cursor's current location in this document`, true);
  res.addSection(secHelp);
  var secInfo = S6UIService.createSection("Poperties Action");

  secInfo.addWidget(S6UIService.createInputForType("InsertType", "Select the action to perform", DATA_TYPE_PAIRED_LIST +
    `[Replace field name with its value,${PROP_ACTION_REPLACE_VALUE},Insert value,${PROP_ACTION_INSERT_VALUE},Replace field name wiith title: value,
    ${PROP_ACTION_REPLACE_TITLE_VALUE},Insert title: value,${PROP_ACTION_INSERT_TITLE_VALUE}]`,
    "",
    PROP_ACTION_REPLACE_VALUE,
    { selectionInputType: CardService.SelectionInputType.RADIO_BUTTON },
    "onChangeAction_InsertyType"));
  secInfo.addWidget(S6UIService.createIconLabel("Select a single property to apply the action to.", "Inserts are applied at current your curosr position", ICON_REPLY_ALL_URL));


  res.addSection(secInfo);
  return _buildProperties(res, entity, id, nameSpace, docId, fields);

}
 
function buildPropertiesBuildTemplate(entity, id, nameSpace, docId, fields) {
 
  var res = S6UIService.createCard("Build Template", "Use properties to build a template", ICON_CODE_URL);
  var secHelp = S6UIService.createHelpSection("Building a Template", "", `Properties are items that have a <b>title</b> (or name), a <b>value</b>, and a <b>field name</b>. From here you can replace a <b>field name</b> in this document with its <b>value</b> or <b>title: value</b>. You can choose to do this for a single item or, more conveniently, you can <b><font color='${PRIMARY_COLOUR}'>ACTION ALL</font></b> at once with the button at the footer.<br><br>Alternatively, directly insert properties into this document. When you insert, the action is executed at your cursor's current location in this document. <br><br>If you want to build a template, then you will want to choose actions that insert the <b>filed name</b>.<br><br>Filed name's take the format of {name.space#field.name}`, true);
  res.addSection(secHelp);
  var secInfo = S6UIService.createSection("Poperties Action");

  secInfo.addWidget(S6UIService.createInputForType("InsertType", "Select the action to perform", DATA_TYPE_PAIRED_LIST +
    `[Replace field name with its value,${PROP_ACTION_REPLACE_VALUE},Insert value,${PROP_ACTION_INSERT_VALUE},Replace field name wiith title: value,${PROP_ACTION_REPLACE_TITLE_VALUE},Insert title: value,${PROP_ACTION_INSERT_TITLE_VALUE},Insert field name,${PROP_ACTION_INSERT_FIELD},Insert title: field name,${PROP_ACTION_INSERT_TITLE_FIELD}]`,
    "",
    PROP_ACTION_REPLACE_VALUE,
    { selectionInputType: CardService.SelectionInputType.RADIO_BUTTON },
    "onChangeAction_InsertyType"));
  secInfo.addWidget(S6UIService.createIconLabel("Select a single property to apply the action to.", "Inserts are applied at current your curosr position", ICON_REPLY_ALL_URL));


  res.addSection(secInfo);
  return _buildProperties(res, entity, id, nameSpace, docId, fields);
}


function _buildProperties(resCard, entity, id, nameSpace, docId, fields) {
  var resCard;

  var propsSpredSheet = SpreadsheetApp.openById(id);
  var sheet = propsSpredSheet.getSheetByName("Root");
  var range = sheet.getRange("A:Z");
  var values = range.getValues();

  var config = {};

  for (let k = 1; k < values.length; k++) {
    if (S6Utility.trim(values[k][0]) != "") {
      let j = 1;
      config[values[k][0]] = [];
      while (S6Utility.trim(values[k][j]) != "") {
        config[values[k][0]][j - 1] = values[k][j++];
      }
    }
  }

  var paramALL = new Param();
  paramALL.addValue("docId", docId);
  var secGlobal = S6UIService.createSection();
  secGlobal.addWidget(S6UIService.createInfoLabel("Global properties."));
  var global = [
    { field: "{today}", value: S6Utility.getToday(), title: "Today" },
    { field: "{GUID8}", value: S6Utility.makePseudoGuid(8), title: "GUID8" },
  ];

  _addFields(id, docId, "global", global, paramALL, secGlobal);
  resCard.addSection(secGlobal);

  console.log("fields:", fields);
  var secFields = S6UIService.createSection();
  secFields.addWidget(S6UIService.createInfoLabel("This " + entity + " core properties."));
  _addFields(id, docId, nameSpace, fields, paramALL, secFields);
  resCard.addSection(secFields);
 
  for (let i = 0; i < config[PROPERTIES_SHEETS].length; i++) {
    var nextSheet = propsSpredSheet.getSheetByName(config[PROPERTIES_SHEETS][i]);
    if (S6Utility.trim(config[PROPERTIES_SHEETS][i]) != "") {
      var widgets = [];
      let wn = 0;
      var sec = S6UIService.createSection();
      var cols = config[PROPERTIES_COLUMNS][i].replace(" ", "").split(",");
      let nextFieldName = nextSheet.getRange(cols[COL_FIELD_NAME] + ":" + cols[COL_FIELD_NAME]).getValues();
      let nextValue = nextSheet.getRange(cols[COL_VALUE] + ":" + cols[COL_VALUE]).getValues();
      let nextTitle = nextSheet.getRange(cols[COL_TITLE] + ":" + cols[COL_TITLE]).getValues();
      let nextHint = nextSheet.getRange(cols[COL_HINT] + ":" + cols[COL_HINT]).getValues();
      for (let row = 1; row < nextFieldName.length; row++) {
        //var fieldName = nextFieldName[row][0]; //S6Utility.trim(S6Utility.evaluateCell(nextSheet, cols[COL_FIELD_NAME] + (row + 1)));
        var fieldName = S6Utility.trim(S6Utility.evaluateUnevaluatedCell(nextSheet, cols[COL_FIELD_NAME] + (row + 1)));
        if (fieldName != SHEET_ERROR) {
          var value = S6Utility.evaluateUnevaluatedCell(nextSheet, cols[COL_VALUE] + (row + 1));  // nextValue[row][0]; //
          if (fieldName != "") {
            if (fieldName == sheetHelpFielName(nameSpace, config[PROPERTIES_SHEETS][i])) {
              sec.addWidget(S6UIService.createInfoLabel(value));
              hasTitle = true;
            }
            else {
              let param = new Param();
              param.addValue("properties.file.id", id);
              param.addValue("properties.namespace", nameSpace);
              param.addValue("docId", docId);
              paramALL.addJSON("property", { fieldName: fieldName, value: value, title: nextTitle[row][0] });
              param.addJSON("property", { fieldName: fieldName, value: value, title: nextTitle[row][0] });

              console.log("FieldName:", fieldName, ", Value:", value, ", Title:", nextTitle[row][0], ", Hint:", nextHint[row][0]);
              widgets[wn++] = S6UIService.createActionLabel("<b>" +
                S6Utility.trim(nextTitle[row][0]) + ": </b>" +
                S6Utility.trim(value),
                S6Utility.trim(fieldName) + "<br>" +
                S6Utility.trim(nextHint[row][0]),
                ICON_REPLY_ALL_URL,
                "action_ApplyProperties",
                param.toJSON());
            }
          }
        }
      }
      var url = propsSpredSheet.getUrl() + "#gid=" + nextSheet.getSheetId();

      paramALL.addValue("docId", docId);

      for (let w = 0; w < widgets.length; w++) {
        sec.addWidget(widgets[w]);
      }
      sec.addWidget(S6UIService.createOpenLabel("Open properties", "View and edit these properties", ICON_GEAR_GREEN_URL, url));
      resCard.setFixedFooter(S6UIService.createFooter(S6UIService.createCreateButton("ACTION ALL", "action_ApplyProperties", paramALL.toJSON()), S6UIService.createCancelButton("BACK")));
      resCard.addSection(sec);
    }

  }
  return resCard.build();
}

function _addFields(id, docId, nameSpace, fields, paramALL, sec,) {
  for (let f = 0; f < fields.length; f++) {
    var fieldName = "{" + nameSpace + "#" + trimBraces(fields[f].field) + "}";
    paramALL.addJSON("property", { fieldName: fieldName, value: fields[f].value, title: fields[f].title });
    let param = new Param();
    param.addValue("properties.file.id", id);
    param.addValue("properties.namespace", "global");
    param.addValue("docId", docId);
    param.addJSON("property", { fieldName: fieldName, value: fields[f].value, title: fields[f].title });
    sec.addWidget(
      S6UIService.createActionLabel("<b>" +
        fields[f].title + ": </b>" +
        fields[f].value,
        fieldName,
        ICON_REPLY_ALL_URL,
        "action_ApplyProperties",
        param.toJSON()));
  }
}

function trimBraces(fieldName) {
  return fieldName.replace("{", "").replace("}", "");
}

function action_ApplyProperties(event) {
  var param = new Param(event);
  console.log(event);

  var docId = param.getFirst("docId");
  var adapt = S6DocumentAdapater.create(docId);
  console.log(adapt);
  var factory = PropertyApplyFactory.createFromEvent(event, adapt);

  var props = param.getJSON("property");
  console.log("props", props);

  for (let i = props.length - 1; i > -1; i--) {
    console.log("props:", props[i].fieldName, ":", props[i].value);
    factory.apply(props[i].title, props[i].value, props[i].fieldName, props[i].value);
  }



}


// function repProps(id = "1NHLK5p5s9QB5iecpe3zbe4ue8Qy9_YKsX7MNbstGqcE", nameSpace = "customer.account", docId = "1du2J_kbUyRN2IoaPkQRt4YGd-vpAdqSjtmU4upkYDd4") {
//   var propsSpredSheet = SpreadsheetApp.openById(id);
//   var doc = DocumentApp.openById(docId).getBody();
//   var sheet = propsSpredSheet.getSheetByName("Root");
//   var range = sheet.getRange("A:Z");
//   var values = range.getValues();

//   var config = {};

//   for (let k = 1; k < values.length; k++) {
//     if (S6Utility.trim(values[k][0]) != "") {
//       let j = 1;
//       config[values[k][0]] = [];
//       while (S6Utility.trim(values[k][j]) != "") {
//         config[values[k][0]][j - 1] = values[k][j++];
//       }
//     }
//   }

//   for (let i = 0; i < config[PROPERTIES_SHEETS].length; i++) {
//     var nextSheet = propsSpredSheet.getSheetByName(config[PROPERTIES_SHEETS][i]);
//     if (S6Utility.trim(config[PROPERTIES_SHEETS][i]) != "") {
//       var sec = S6UIService.createSection();
//       var cols = config[PROPERTIES_COLUMNS][i].replace(" ", "").split(",");
//       let nextFieldName = nextSheet.getRange(cols[COL_FIELD_NAME] + ":" + cols[COL_FIELD_NAME]).getValues();
//       for (let row = 1; row < nextFieldName.length; row++) {
//         var fieldName = S6Utility.trim(nextFieldName[row]);
//         if (fieldName != SHEET_ERROR) {
//           var value = S6Utility.evaluateCell(nextSheet, cols[COL_VALUE] + (row + 1));
//           if (fieldName != "") {
//             doc.replaceText(nextFieldName[row], value);
//           }
//         }
//       }
//     }

//   }
// }
function sheetHelpFielName(nameSpace, sheetName) {
  return "{" + nameSpace + "#" + sheetName + "." + PROPERTY_SHEET_INFO + "}";
}





function action_buildEntityChoice(event) {
  var param = new Param(event);
  var card = S6UIService.createCard(`Choose properties source(s)`, "Add or remove entities", ICON_CODE_URL);
  var entities = findPropsForDoc(param.getFirst("active.document.id"));
  for (let i = 0; i < entities.length; i++) {
    S6Utility.getSettingsFromSpreadSheetURL(entities[i].url);
    var sec = _buildEntityChoice(param, entities[i].url);
    card.addSection(sec);
  }
  return card.build();
}


function findPropsForDoc(id) {
  var res = [];
  var map = _mapDocummentPorps(id);
  var entities = S6Utility.listEntities(S6Utility.getMasterSpreadSheetUrl());

  let x = 0;
  for (let i = 0; i < entities.length; i++) {
    var next = entities[i];
    var item = map.get(next.nameSpace);
    if (item) {
      res[x++] = entities[i];
    }
  }
  return res;
}

function findProps(id) {
  var res = [];
  var doc = DocumentApp.openById(id);
  var p = doc.getBody().getParent();
  // let's loop through all the child elements in the document
  for (var i = 0; i < p.getNumChildren(); i += 1) {
    var t = p.getChild(i).getType();
    if (t === DocumentApp.ElementType.BODY_SECTION) {
      findNextAutomaticProperty(res, p.getChild(i).asBody());
    }
    if (t === DocumentApp.ElementType.HEADER_SECTION) {
      var h = p.getChild(i).asHeaderSection().getText();
      findNextAutomaticProperty(res, p.getChild(i).asHeaderSection());
    }
    else if (t === DocumentApp.ElementType.FOOTER_SECTION) {
      findNextAutomaticProperty(res,p.getChild(i).asFooterSection());
    }
  }
  return res;
}

function findNextAutomaticProperty(res, body, range) {
  var reg = "{.+?}";
  if (body) {
    var newRange = body.findText(reg, range);
    if (newRange) {
      res[res.length] = newRange.getElement().asText().getText();
      findNextAutomaticProperty(res, body, newRange);
    }
  }
}

function findAutomaticProperties(id) {
  var res = [];
  var reg = "{.+?}";
  var doc = DocumentApp.openById(id);

  findNextAutomaticProperty(res, doc.getBody());
  findNextAutomaticProperty(res, doc.getFooter());
  findNextAutomaticProperty(res, doc.getHeader());
  return res;

}
function _mapDocummentPorps(id) {
  var res = new Map();
  var r = "[{].+[#]";
  var doc = DocumentApp.openById(id);

  var elementRange;
  var count = 0;
  while (true) {
    elementRange = test_next(doc, elementRange);
    if (elementRange != null) {
      var s = elementRange.getElement().asText().getText().split("{");
      console.log(s);
      for (let i = 1; i < s.length; i++) {
        var s1 = s[i].split("#");
        //console.log(s1[0].toString());
        let x = 1;
        var item = res.get(s1[0]);
        if (item != null) {
          x = item + 1;
        }
        console.log(item, ":", x);
        res.set(s1[0], x);
        count++;
      }
    }
    else {
      break;
    }
  }
  res.forEach((value, key) => {
    console.log(key, ":", value);
  });

  console.log("Count[", count, "]");
  return res;

}
function _mapNext(doc, re) {
  var r = "[{].+[#]";
  if (re) {
    console.log(re.isPartial(),);
  }
  var res = doc.getBody().findText(r, re);
  return res;
}

function _buildEntityChoice(param, url) {
  var res = S6UIService.createSection();
  var rootFolderId = param.getFirst("rootFolderId");
  //var configSheetId = param.getFirst("active.configSheetId");
  var j = param.getJSON("active.entity.fields");
  var entity = param.getFirst("active.entity");

  var folder = DriveApp.getFolderById(rootFolderId);
  var name = folder.getName();

  var config = S6Utility.getSettingsFromSpreadSheetURL(url);
  var listDesc = config.listDesc;
  var listType = config.listDataType;

  console.log(FIELDS, j);
  var subLabel = S6Utility.replaceFieldInText(j, listDesc);

  var rightIcon = config.imageURL;
  if (listType == DATA_TYPE_DOMAIN) {
    rightIcon = S6Utility.getFaviconDomainFetchURL(name);
    console.log("Domain/icon/", rightIcon);
  }
  else {
    console.log("NonDomain/icon", rightIcon);
  }

  param.addValue("settingsUrl", config.settingsUrl);
  param.addValue("entity", entity);
  param.addValue("ignoreListStartsWith", config.ignoreListStartsWith);
  param.addValue("viewType", ViewType.FILE_TASK);
  //param.addValue("taskType", task);
  param.addValue("listDataType", listType);

  param.replaceValue("id", param.getFirst("rootFolderId"));
  res.addWidget(S6UIService.createActionLabel(name, subLabel, ICON_DELETE_URL, "action_PostListAction", param.toJSON()));
  //res.addWidget(S6UIService.createDivider());

  return res;
}
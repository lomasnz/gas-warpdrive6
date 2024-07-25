const TASK_COPY = "Copy";
const TASK_MOVE = "Move";
const TASK_SHORT_CUT = "Shortcut";
const TASK_BACKLINK = "Backlink";
const TASK_APPLY_PROPERTIES = "Apply Properties";
const TASK_BUILD_TEMPLATE = "Build Template";
const TASK_APPLY_BOILERPLATE = "Apply Boilerplate";
const TASK_AI = "OpenAI"


const TASK_VALUES = "TASKS"

const FILE_LOCATION_TASKS = { [TASK_VALUES]: [TASK_COPY, TASK_MOVE, TASK_SHORT_CUT, TASK_BACKLINK] };
const FILE_LOCATION_TASKS_NO_COPY = { [TASK_VALUES]: [TASK_MOVE, TASK_SHORT_CUT, TASK_BACKLINK, TASK_APPLY_PROPERTIES, TASK_BUILD_TEMPLATE, TASK_AI] };


const MOV_CHANGE_POPUP_SETTINGS_URL = "https://drive.google.com/file/d/1foDZ_s4cvJ6au92qVqNq8aEFDaiLuHbd";

const TASK_FILEDS = {
  "fields":
    [
      { field: "{allfolders}", hint: "Folder", title: "Folder", type: "allfolders", mandatory: YES, value: "" },

      {
        field: "{subfolder}", hint: "(Optional) Subfolder. Subfolder(s) will be created. Use "
          + "\\" + " if you want to create multiple subfolders. EG a\\b ", title: "Subfolder", type: "text", mandatory: NO, value: ""
      }
      ,
      { field: "{fileName}", hint: "Optionally, change the name of the traget file. You will not be allowed to use the name of a file that already exists in the target folder.", title: "File name", type: "text", mandatory: YES, value: "" },
      { field: "{taskType}", hint: "Action type", title: "Action", type: "choose", mandatory: YES, value: "" },
    ]
};

const TASK_CONFIG =
{
  [TASK_VALUES]:
  {
    [TASK_COPY]: {
      "header": "Choose where to Copy to",
      "help": "Copying a file duplicates it. Once the copy is made, there is no link between the original file and the new copy. (This includes the file's history, which is not copied to the new file.) You can do what you want with the copy without affecting the original file.",
      "icon": ICON_COPY_FILE_URL,
      "listTitle": "Select an item to Copy to.",
      "confirmOverview": "The copied file will be created with the following name and folder directory.",
      "confrimTitle": "Copy file",
      "confirmDesc": "Copy and open the new file.",
      "confirmAction": "COPY & OPEN",
      "aboutToInfo": "About Copying Files",
      "fileExists": "File not copied. A file with the name already exists with the target name in the target folder.",
      "endWarning": "When a copy of the file is crearted it will be opened in a new tab. However, <b>the tab will not open if pop-up windows for this site (<b>docs.google.com</b>) are not enabled</b>.<br><br>Learn how to change your pop-up settings <a href=" + MOV_CHANGE_POPUP_SETTINGS_URL + ">here</a>.",
      "choose": " to another location in",
      "choose1": " to another ",
      "choose2": " to another type of entity",
      "functionName": actionEventTaskAction.name,
      "entity": "Select an entity you want to copy the file to."

    },
    [TASK_MOVE]: {
      "header": "Choose where to Move to",
      "help": "Moving a file changes its location. When you move a file, be conscious that permissions for the file will also change. The file will lose permissions it had in its original location and gain them from the new location.",
      "icon": ICON_MOVE_FILE_URL, "listTitle":
        "Select an item to Move to.",
      "confirmOverview": "The file will be moved with the following name and in folder directory.",
      "confrimTitle": "Move file",
      "confirmDesc": "Move the file to a new location.",
      "confirmAction": "MOVE",
      "aboutToInfo": "About Moving Files",
      "fileExists": "File not moved. A file with the name already exists with the target name in the target folder.",
      "endWarning": "When the file is moved new tab will NOT be opened. Check the file is in location you expect in the <b>File Information</b>. ",
      "choose": " to another location in",
      "choose1": " to another ",
      "choose2": " to another type of entity",
      "functionName": actionEventTaskAction.name,
      "entity": "Select an entity you want to move the file to."
    },
    [TASK_SHORT_CUT]: {
      "header": "Choose where to create the Shortuct",
      "help": "Creating a shortcut to a file is a way to have a file appear as if it is in two locations. There remains only one file, but a shortcut in another folder allows people to find it from there. <b>Shortcuts do not override permissions. If people do not have permission to access the underlying file, the shortcut will not grant access to them.</b>",
      "icon": ICON_CREATE_SHORTCUT_URL,
      "listTitle": "Select an item to create a Shortcut for.",
      "confirmOverview": "A shortcut to the file will be created with the following name and folder directory.",
      "confrimTitle": "Create shortcut to file",
      "confirmDesc": "Create a shortcut and open the folder containing it.",
      "confirmAction": "CREATE",
      "aboutToInfo": "About Creating Shortcuts",
      "fileExists": "Shortcut not created. A file with the shortuct name already exists with the target name in the target folder.",
      "endWarning": "When the shortuct is created its folder will be opened in a new tab. However, <b>the tab will not open if pop-up windows for this site are not enabled</b>.<br><br>Learn how to change your pop-up settings <a href=" + MOV_CHANGE_POPUP_SETTINGS_URL + ">here</a>.",
      "choose": " to another location in",
      "choose1": " to another ",
      "choose2": " to another type of entity",
      "functionName": actionEventTaskAction.name,
      "entity": "Select an entity you want to create a short cut to."
    },
    [TASK_BACKLINK]: {
      "header": "Choose where to create the Backlink",
      "help": "A backlink is simillar to a shortcut, but the file is moved, and a shortcut is left behind.<BR><BR>A shortcut to a file is a way to have a file appear as if it is in two locations. <b>If you wish to share a file with someone who can not ordinarily access it, then a shortcut will not work.</b> This is because shortcuts do not change the permission to the underlying file.<br><br>When you create a backlink, choose a location where you know the intended audience can access the file. The file will be moved, and a shortcut will be left behind from where it was moved. ",
      "icon": ICON_SWITCH_ACCESS_URL,
      "listTitle": "Select an item to create a Backlink for.",
      "confirmOverview": "The file will be moved with the following name and folder directory. And a shortcut will be left behind in place of the file.",
      "confrimTitle": "Create backlink to file",
      "confirmDesc": "Move the file, and leave a shortcut behind. Then open the folder containing the moved file.",
      "confirmAction": "CREATE",
      "aboutToInfo": "About Creating Backlinks",
      "fileExists": "Bcklink not created. A file with the name already exists with the target name in the target folder.",
      "endWarning": "When the backlink is created the folder contain the new shortcut will be opened in a new tab. However, <b>the tab will not open if pop-up windows for this site are not enabled</b>.<br><br>Learn how to change your pop-up settings <a href=" + MOV_CHANGE_POPUP_SETTINGS_URL + ">here</a>.",
      "choose": " to another location in",
      "choose1": " to another ",
      "choose2": " to another type of entity",
      "functionName": actionEventTaskAction.name,
      "entity": "Select an entity you want to create a backlink."
    },
    [TASK_APPLY_PROPERTIES]: {
      "header": "Choose where to source Properties",
      "title": "Apply propoerties",
      "icon": ICON_SCATTER_URL,
      "help": "Properties are values associated with the entity that can be inserted into this document. Either replacing propoerty fileds eg {global#yyyy} is todaty's date, or directly insert into the document at your cursor",
      "listTitle": "Select an item to create apply properties from.",
      "confirmOverview": "confirmOverview",
      "confrimTitle": "confrimTitle",
      "confirmDesc": "confirmDesc.",
      "confirmAction": "NEXT",
      "aboutToInfo": "About Applying Properties",
      "fileExists": "fileExists.",
      "endWarning": "endWarning",
      "pairedlist":
        `pairedlist[Replace property name with its value,${PROP_ACTION_REPLACE_VALUE},Insert value (at cursor),${PROP_ACTION_INSERT_VALUE},Replace property name wiith title: value,${PROP_ACTION_REPLACE_TITLE_VALUE},Insert title: value (at cursor),${PROP_ACTION_INSERT_TITLE_VALUE}]`,
      "deepHelp": `Properties are items that have a <b>title</b> (or name), a <b>value</b>, and a <b>property name</b>. From here you can replace a <b>property name</b> in this document with its <b>value</b> or <b>title: value</b>. You can choose to do this for a single item or you can <b><font color='${PRIMARY_COLOUR}'>ACTION ALL</font></b> at once with the button at the footer.`,
      "hint": "Update document fields with propoerties",
      "choose": " from the current entity",
      "choose1": " from a different ",
      "choose2": " from another type of entity",
      "functionName": actionEventPropertiesApply.name,
      "entity": "Select an entity you want to apply properties."
    },
    [TASK_BUILD_TEMPLATE]: {
      "header": "Choose where to source Properties",
      "title": "Build template",
      "icon": ICON_CODE_URL,
      "help": "Build a template with propoerty fields, eg {gloabl#yyyy} which can later be updated with the propoerty's value.",
      "listTitle": "Select an item to create apply properties from.",
      "confirmOverview": "confirmOverview",
      "confrimTitle": "confrimTitle",
      "confirmDesc": "confirmDesc.",
      "confirmAction": "NEXT",
      "aboutToInfo": "About Building a Template",
      "fileExists": "fileExists.",
      "endWarning": "endWarning",
      "pairedlist": `pairedlist[Insert property ID at cursor, ${PROP_ACTION_INSERT_FIELD}, Insert title: property ID at cursor, ${PROP_ACTION_INSERT_TITLE_FIELD}]`,
      "deepHelp": `Properties are items that have a <b>title</b> (or name), a <b>value</b>, and a <b>property ID</b>. From here you can insert a <b>property ID</b> or <b>title: property ID</b> in this document. You can do this for a single item. Or you can <b><font color='${PRIMARY_COLOUR}'>ACTION ALL</font></b> at once with the button at the footer. You can also create your own <b>Document Prooerties</b>, which are described below.`,
      "hint": "Insert properties into this document",
      "choose": " using the current entity",
      "choose1": " using a different ",
      "choose2": " using another type of entity",
      "functionName": actionEventPropertiesApply.name,
      "entity": "Select an entity you want to create a template from."
    },
    [TASK_APPLY_BOILERPLATE]: {
      "header": "Choose the Boilerplate to apply",
      "title": "Apply boilerplate",
      "icon": ICON_MOVE_DOWN_URL,
      "help": "Boilerplate is written text that can be reused in new contexts or applications without significant changes to it.<br><br>From here you can choose a document that contains boilerplate to be applied to your current document at your current cursor location.",
      "listTitle": "Select a boilerplate document to use.",
      "confirmOverview": "confirmOverview",
      "confrimTitle": "confrimTitle",
      "confirmDesc": "confirmDesc.",
      "confirmAction": "NEXT",
      "aboutToInfo": "About Boilerplates",
      "fileExists": "fileExists.",
      "endWarning": "endWarning",
      "pairedlist": `pairedlist`,
      "deepHelp": `Apply the boilerplate contents from a document to this document.`,
      "hint": "Apply boilerplate to this document",
      "choose": " choose",
      "choose1": " choose1",
      "choose2": "choose2",
      "functionName": actionEventPropertiesApply.name,
      "entity": "Select a boilerplate document to use."
    },
    [TASK_AI]: {
      "header": "OpenAI",
      "title": "OpenAI",
      "icon": ICON_OPEN_AI_URL,
      "help": "The OpenAI machibe learning anwer questions or rewrite text. The current document is updated with the result.",
      "listTitle": "",
      "confirmOverview": "",
      "confrimTitle": "",
      "confirmDesc": ".",
      "confirmAction": "NEXT",
      "aboutToInfo": "About OpenAI",
      "fileExists": "",
      "endWarning": "endWarning",
      "pairedlist": `pairedlist`,
      "deepHelp": "",
      "hint": "",
      "choose": " choose",
      "choose1": " choose1",
      "choose2": "choose2",
      "functionName": actionAITextProcessor.name,
      "entity": ""
    }
  }
};


function onDrive_ItemsSelectedView(param) {
  var items = param.event.drive.selectedItems;
  item = items[0];
  return buildEditorHomPageView(item.id, param);
}

function onDriveSelectItemHomePageView(param) {

  S6Utility.initAddOn(param.event);

  let id = EMPTY;
  try {
    id = SlidesApp.getActivePresentation().getId();
  }
  catch (err) {
    S6Context.error(err);
  }
  return buildEditorHomPageView(id, param);
}
function onEditorHomePage_DocsView(param) {
  S6Utility.initAddOn(param.event);

  let id = EMPTY;
  try {
    id = DocumentApp.getActiveDocument().getId();
  }
  catch (err) {
    S6Context.error(err);
  }
  return buildEditorHomPageView(id, param);
}

function onEditorHomePage_SlidesView(param) {
  S6Utility.initAddOn(param.event);

  let id = EMPTY;
  try {
    id = SlidesApp.getActivePresentation().getId();
  }
  catch (err) {
    S6Context.error(err);
  }
  return buildEditorHomPageView(id, param);
}

function onEditorHomePage_SheetsView(param) {
  S6Utility.initAddOn(param.event);

  let id = EMPTY;
  try {
    id = SpreadsheetApp.getActiveSpreadsheet().getId();
  }
  catch (err) {
    S6Context.error(err);
  }
  return buildEditorHomPageView(id, param);
}

function buildEditorHomPageView(id = EMPTY, param) {

  S6Context.debug("id[", id, "]");
  if (!param) {
    param = new Param();
  }
  var res = S6UIService.createCard("Manage this file", "File information and actions", ICON_TUNE_URL, "HOME");
  //var id = param.getDocumentId();

  if (S6Utility.trim(id) == EMPTY) {
    id = param.getDocumentId();
  }

  if (S6Utility.trim(id) == EMPTY) {
    var sec = S6UIService.createSection();
    sec.addWidget(S6UIService.createIamgeLabel("Unsupported File", "The selected file is not supported", ICON_WARNING_URL));
    sec.addWidget(S6UIService.createParagraph(`The current file is not supported by Google for for Editor Add - Ons.< br > <br>I'm sorry but your on your own with this file. This is an issue opened with Google <a href="https://issuetracker.google.com/issues/235693509">here</a>.`));
    res.addSection(sec);
  }
  else {
    param.setDocumentId(id);
    try {
      const doc = S6Doc.newFromId(id);


      var nameSpace = doc.document[DOC.NAME_SPACE];
      var instanceId = doc.document[DOC.ENTITY_FOLDER_ID];
      param.setValue(PARAM.IS_FOLDER, doc.isFolder() ? YES : NO);
      param.setEntityInstanceId(instanceId);
      param.setNameSpace(nameSpace);

      const secAct = S6UIService.createSection();
      //secAct.addWidget(S6UIService.createActionLabel(`NZBN`, "", ICON_TASKS_URL, buildNZBNSearechView.name));
      secAct.addWidget(S6UIService.createActionLabel(`Choose a File Action`, "Location and content actions", ICON_TASKS_URL, actionEventFileAction.name, param.toJSON()));
      S6Context.debugFn(buildEditorHomPageView, param.toJSON());
      res.addSection(secAct);

      _buildFileInfo(id, doc, res);

      if (!doc.isFolder() && param.getHostApp() == PARAM.HostApps.DriveApp) {
        let sec = S6UIService.createSection();
        //sec.addWidget(S6UIService.createSpacer());
        sec.addWidget(S6UIService.createThumbnailImageFromFile(doc.file));
        res.addSection(sec);
      }
    }
    catch (err) {
      S6Context.error(err.stack);
      S6Context.error(err);
      let sec = S6UIService.createSection();
      sec.addWidget(S6UIService.createIamgeLabel("Unsupported File", "There is a problem working with this file. Have you named it yet? That may help.", ICON_WARNING_URL));
      sec.addWidget(S6UIService.createRefreshButton(param, false));
      res.addSection(sec);

    }

  }
  return res.build();
}

function buildFileActionView(param) {
  var isFolder = param.getValue(PARAM.IS_FOLDER) == YES;
  var folderOrFile = isFolder ? "Folder" : "File";

  var res = S6UIService.createCard(`${folderOrFile} Actions`, EMPTY, ICON_TASKS_URL);

  var locationSection = S6UIService.createSection(`${folderOrFile} Location Actions`);


  if (!isFolder) {
    param.setValue(PARAM.TASK_TYPE, TASK_COPY);
    locationSection.addWidget(S6UIService.createActionLabel(`Copy ${folderOrFile}`, "Copy this file to another location", ICON_COPY_FILE_URL, actionEventChooseTask.name, param.toJSON()));
  }
  else {
    locationSection.addWidget(S6UIService.createIamgeLabel("Copying Folders from here is not possible", EMPTY, ICON_COPY_FILE_URL));
  }
  param.deleteAll(PARAM.IS_FOLDER);

  param.setValue(PARAM.TASK_TYPE, TASK_MOVE);
  locationSection.addWidget(S6UIService.createActionLabel(`Move ${folderOrFile}`, `Move this ${folderOrFile} to another location`, ICON_MOVE_FILE_URL, actionEventChooseTask.name, param.toJSON()));

  param.setValue(PARAM.TASK_TYPE, TASK_SHORT_CUT);
  locationSection.addWidget(S6UIService.createActionLabel(`Create ${folderOrFile} Shortcut`, `Create a shortcut to this ${folderOrFile} in another location`, ICON_CREATE_SHORTCUT_URL, actionEventChooseTask.name, param.toJSON()));

  param.setValue(PARAM.TASK_TYPE, TASK_BACKLINK);
  locationSection.addWidget(S6UIService.createActionLabel("Create Backlink", `Move this ${folderOrFile} to another location and leave a shortuct (backlink) behind`, ICON_SWITCH_ACCESS_URL, actionEventChooseTask.name, param.toJSON()));
  //res.addSection(actionSection);

  var contentSection;
  if (!isFolder && param.getHostApp() == PARAM.HostApps.DocsApp) {
    contentSection = S6UIService.createSection(`Document Content Actions`);
    param.setValue(PARAM.TASK_TYPE, TASK_APPLY_PROPERTIES);
    contentSection.addWidget(S6UIService.createActionLabel("Apply Properties", `Replace and insert properties in this document`, ICON_SCATTER_URL, actionEventChooseTask.name, param.toJSON()));
    param.setValue(PARAM.TASK_TYPE, TASK_BUILD_TEMPLATE);
    contentSection.addWidget(S6UIService.createActionLabel("Build Template", `Add propertiesd fields to this document`, ICON_CODE_URL, actionEventEntityList.name, param.toJSON()));
    contentSection.addWidget(S6UIService.createDivider());

    param.setValue(PARAM.TASK_TYPE, TASK_APPLY_BOILERPLATE);
    contentSection.addWidget(S6UIService.createActionLabel("Apply Boilerplate", `Apply Boilerplate text to this document`, ICON_MOVE_DOWN_URL, actionEventBoilerplateAction.name, param.toJSON()));

    contentSection.addWidget(S6UIService.createDivider());

    param.setValue(PARAM.TASK_TYPE, TASK_AI);
    param.replaceJSON(PARAM.FIELDS, null);
    // remove OpenAI option
    //contentSection.addWidget(S6UIService.createActionLabel("OpenAI GPT", `Work with this document using OpenAI's ChatGPT, powered by it GPT large language models`, ICON_OPEN_AI_URL, actionAITextProcessor.name, param.toJSON()))
    //contentSection.addWidget(S6UIService.createDivider());
  }


  res.addSection(locationSection);
  if (contentSection) {
    res.addSection(contentSection);
  }

  return res.build();
}

function buildBoilerplateView(param) {
  var res = S6UIService.createCard(TASK_CONFIG[TASK_VALUES][TASK_APPLY_BOILERPLATE].header, TASK_CONFIG[TASK_VALUES][TASK_APPLY_BOILERPLATE].hint, TASK_CONFIG[TASK_VALUES][TASK_APPLY_BOILERPLATE].icon);
  var docs = S6BoilerplateService.instance().docs;

  var hSec = S6UIService.createHelpSection(TASK_CONFIG[TASK_VALUES][TASK_APPLY_BOILERPLATE].aboutToInfo, EMPTY, TASK_CONFIG[TASK_VALUES][TASK_APPLY_BOILERPLATE].help);
  res.addSection(hSec);
  var title = EMPTY;
  var section;
  for (var doc in docs) {
    S6Context.trace(docs[doc]);
    if (title != docs[doc][BOILERPLATE.TITLE]) {
      title = docs[doc][BOILERPLATE.TITLE];
      if (section) {
        res.addSection(section);
      }
      section = S6UIService.createSection();
      // section.setCollapsible(true);
      // section.setNumUncollapsibleWidgets(1);
      section.addWidget(S6UIService.createLabel(title));

    }
    if (!section) {
      section = S6UIService.createSection();
    }
    param.replaceValue(PARAM.BOILERPLATE_ID, docs[doc][BOILERPLATE.ID]);
    var text = `${docs[doc][BOILERPLATE.NAME]}<br><font color="#757575">${docs[doc][BOILERPLATE.HINT]}</font>`;
    section.addWidget(S6UIService.createActionLabel(text, EMPTY, TASK_CONFIG[TASK_VALUES][TASK_APPLY_BOILERPLATE].icon, actionEventBoilerplateConfrimEvent.name, param.toJSON()));
  }
  res.addSection(section);

  return res.build();
}
function buildBoilerplateConfrimView(param) {
  var res = S6UIService.createCard("Apply boilerplate", "Insert boilerplate into the current document", TASK_CONFIG[TASK_VALUES][TASK_APPLY_BOILERPLATE].icon);
  var section = S6UIService.createSection();

  var id = param.getValue(PARAM.BOILERPLATE_ID);
  var docs = S6BoilerplateService.instance().docs;
  S6Context.trace(docs, id);
  var doc = docs[id];

  section.addWidget(S6UIService.createInfoLabel("Apply boilerplate from this document:"))
  var text = `${doc[BOILERPLATE.NAME]}<br><font color="#757575">${doc[BOILERPLATE.HINT]}</font>`;
  section.addWidget(S6UIService.createLabel(text));

  if (doc[BOILERPLATE.INFO] != EMPTY) {
    section.addWidget(S6UIService.createParagraph(doc[BOILERPLATE.INFO]));
  }

  if (doc[BOILERPLATE.HEADERS_AND_FOOTERS] == YES) {
    var text = CardService.newDecoratedText();
    text.setText("Include headers and footers.");
    var sw = CardService.newSwitch();
    sw.setControlType(CardService.SwitchControlType.SWITCH)
    sw.setFieldName("include_headers_and_footers");
    sw.setValue(YES);
    sw.setSelected(true);
    text.setSwitchControl(sw);
    section.addWidget(S6UIService.createDivider());
    section.addWidget(text);
  }

  section.addWidget(S6UIService.createDivider());
  section.addWidget(S6UIService.createThumbnailImageFromId(id));
  section.addWidget(S6UIService.createDivider());

  var file = DriveApp.getFileById(id);
  section.addWidget(S6UIService.createLabel("Open Boilerplate"));
  section.addWidget(S6UIService.createActionLabelOpenFile(file));
  section.addWidget(S6UIService.createDivider());

  var createBut = S6UIService.createCreateButton("APPLY", actionEventBoilerplateApply.name, param.toJSON());
  var cancelBut = S6UIService.createCancelButton("BACK");
  var butSet = S6UIService.createFooter(createBut, cancelBut);

  res.addSection(section);
  res.setFixedFooter(butSet);

  return res.build();
}
function buildBoilerplateApply(param) {
  var res;
  var msg;

  var doInclude = param.event.formInputs["include_headers_and_footers"];
  var doHeadersAndFooters = (doInclude && doInclude.toString() == YES)

  S6Context.debug("doHeadersAndFooters", doHeadersAndFooters);

  var documentAdapter = S6DocsAdapater.create(param.getDocumentId());
  var boilerPlaceDcoument = DocumentApp.openById(param.getValue(PARAM.BOILERPLATE_ID));

  if (documentAdapter.applyBoilerplate(boilerPlaceDcoument, doHeadersAndFooters)) {
    msg = "Boilerplate applied";
  }
  else {
    msg = "Thre was a problem applying this Boilerplate";
  }
  var nav = CardService.newNavigation().popCard();
  var notify = CardService.newNotification()
    .setText(msg);

  res = CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .setNotification(notify)
    ;
  return res.build();

}

function _buildFileInfo(id, doc, card) {
  var res;
  const fileSection = S6UIService.createSection();
  fileSection.addWidget(S6UIService.createIamgeLabel(`<b>File Location</b>`, "The drive location of this file", ICON_DRIVE_OUTLINE_URL));

  const file = DriveApp.getFileById(id);
  fileSection.addWidget(S6UIService.createActionLabelOpenFile(file));

  const folders = file.getParents();
  var url;
  if (folders.hasNext()) {
    var next = folders.next();
    url = next.getUrl();
    createFolderItem(fileSection, next);
  }
  if (url) {
    let param = new Param();
    param.setValue(PARAM.URL, url);
    fileSection.addWidget(S6UIService.createActionLabelOpen("Open file's folder", "In a new tab", ICON_DRIVE_URL, actionEventOpenLink.name, param.toJSON()));
  }

  if (doc && doc.document[DOC.MANAGED] == YES) {
    var entitySection = S6UIService.createSection();
    let param = new Param();
    param.setNameSpace(doc.document[DOC.NAME_SPACE]);
    entitySection.addWidget(S6UIService.createActionLabel("<b>" + doc.document[DOC.ENTITY_CONFIG][ENTITY.NAME_SINGUAL] + "</b>", EMPTY, doc.document[DOC.ENTITY_CONFIG][ENTITY.ENTITY_ICON_URL], actionEventEntity.name, param.toJSON()));
    S6UIService.createFieldLabelsForSection(entitySection, doc.document[DOC.INSTANCE_DATA][INSTANCE.FIELDS]);
    card.addSection(entitySection);
  }
  else {
    const owner = file.getOwner();
    if (owner) {
      var oName = owner.getName()
      fileSection.addWidget(S6UIService.createLabel(`File owner: ${oName}`));
    }
    else if (!url) {
      //S6Context.debug("Onwer:", file.getOwner());
      var users = file.getEditors();
      var domains = new Map();
      for (let i = 0; i < users.length; i++) {
        let count = domains.get(users[i].getDomain());
        let next = 0;
        if (!count) {
          next = 1;
        }
        else {
          next = count + 1;
        }
        domains.set(users[i].getDomain(), next);
      }
      let domain = "";
      for (const [key, value] of domains.entries()) {
        domain = "@" + key + `(${value})` + (domain == "" ? domain : ", " + domain);
        //S6Context.debug(key, value);
      }

      fileSection.addWidget(S6UIService.createLabel(`File appears to be shared from an external source.`));
      fileSection.addWidget(S6UIService.createLabel(`File accesible from domains (user count): ${domain}`));
    }
  }

  card.addSection(fileSection);
  return res;
}
function createFolderItem(sectionFolders, folder) {
  var res;
  let hint = "In folder";
  let icon = ICON_FOLDER_URL;
  if (folder.getName() == "Drive") {
    hint = "In Team Drive";
    icon = ICON_GOOGLE_TEAMDRIVE_URL;
  }
  var param = new Param();
  param.setValue(PARAM.URL, folder.getUrl())
  sectionFolders.addWidget(S6UIService.createActionLabelOpen(S6Utility.getFolderOrDriveName(folder), hint, icon, actionEventOpenLink.name, param.toJSON()));
  if (folder.getDescription()) {
    try {
      S6Context.trace("Found desc:", folder.getDescription());
      res = S6Utility.getMetaDataFromFolder(folder);
      S6Context.trace("Found json:", res);
    }
    catch (err) {
      S6Context.warn(err);
    }
  }
  var folders = folder.getParents();
  if (folders.hasNext()) {
    var folder = folders.next();
    if (!res) {
      res = createFolderItem(sectionFolders, folder);
    }
    else {
      createFolderItem(sectionFolders, folder);
    }
  }
  return res;
}


function buildChooseTaskView(param) {
  const vars = {
    task: "",
    taskImageUrl: "",
    icon: "",
    name: "",
    subLabel: ""
  }

  vars.task = param.getValue(PARAM.TASK_TYPE);
  vars.taskImageUrl = TASK_CONFIG[TASK_VALUES][vars.task].icon;

  var res = S6UIService.createCard(TASK_CONFIG[TASK_VALUES][vars.task].header, "Select entity", vars.taskImageUrl);
  var section = S6UIService.createSection();
  var doc = S6Doc.newFromId(param.getDocumentId());

  if (vars.task == TASK_APPLY_PROPERTIES) {
    param.setNameSpace(PROPERTIES.GLOABL);
    section.addWidget(S6UIService.createActionLabel("Global Properties (only)", EMPTY, ICON_GLOBLE_URL, actionEventPropertiesApply.name, param.toJSON()));
    section.addWidget(
      S6UIService.createLabel("All other Entity choices include Global and Entity properties")
    );
    section.addWidget(S6UIService.createDivider());
  }

  if (doc.document[DOC.MANAGED] == YES) {
    param.setValue(PARAM.VIEW_TYPE, ViewType.FILE_TASK);
    param.setEntityInstanceId(doc.document[DOC.INSTANCE_DATA][INSTANCE.INSTANCE_ID]);
    param.setNameSpace(doc.document[DOC.NAME_SPACE]);
    var folder = DriveApp.getFolderById(doc.document[DOC.INSTANCE_DATA][INSTANCE.INSTANCE_ID]);

    vars.name = folder.getName();
    vars.subLabel = S6Utility.replaceFieldInText(doc.document[DOC.INSTANCE_DATA][INSTANCE.FIELDS], doc.document[DOC.ENTITY_CONFIG][ENTITY.LIST_DESCRIPTION]);

    vars.icon = doc.document[DOC.ENTITY_CONFIG][ENTITY.ENTITY_ICON_URL]
    if (doc.document[DOC.ENTITY_CONFIG][ENTITY.LIST_DATATYPE] == DATA_TYPE_DOMAIN) {
      vars.icon = S6Utility.getFaviconDomainFetchURL(vars.name);
    }

    param.setValue("viewType", ViewType.FILE_TASK);
    param.setValue("listDataType", doc.document[DOC.ENTITY_CONFIG][ENTITY.LIST_DATATYPE]);

    section.addWidget(S6UIService.createActionLabel(vars.task + TASK_CONFIG[TASK_VALUES][vars.task].choose + "<br>" + vars.name + `<br><font color="#757575">` + vars.subLabel + "</font>", EMPTY, vars.icon, TASK_CONFIG[TASK_VALUES][vars.task].functionName, param.toJSON()));
    ;
    section.addWidget(S6UIService.createActionLabel(vars.task + TASK_CONFIG[TASK_VALUES][vars.task].choose1 + doc.document[DOC.ENTITY_CONFIG][ENTITY.NAME_SINGUAL], "",
      doc.document[DOC.ENTITY_CONFIG][ENTITY.ENTITY_ICON_URL], actionEventList.name, param.toJSON()));
  }

  section.addWidget(S6UIService.createActionLabel(vars.task + TASK_CONFIG[TASK_VALUES][vars.task].choose2, EMPTY, ICON_SEARCH_URL, actionEventEntityList.name, param.toJSON()));

  res.addSection(section);
  res.addSection(S6UIService.createHelpSection(`About the ${vars.task} action`, "", TASK_CONFIG[TASK_VALUES][vars.task].help));

  return res.build();
}

function buildEntityListView(param) {
  const vars = {
    task: param.getValue(PARAM.TASK_TYPE),
    taskImageUrl: ""
  }
  vars.taskImageUrl = TASK_CONFIG[TASK_VALUES][vars.task].icon;

  var res = S6UIService.createCard(`Choose where to ${vars.task} too`, "Select entity type", vars.taskImageUrl);

  var m = S6Master.newMaster();

  var currentEntitySection = S6UIService.createSection();
  currentEntitySection.addWidget(S6UIService.createIamgeLabel(TASK_CONFIG[TASK_VALUES][vars.task].entity, "", vars.taskImageUrl));
  currentEntitySection.addWidget(S6UIService.createDivider());

  for (var h = 0; h < m.configs.length; h++) {
    for (let i = 0; i < m.configs[h][MASTER.ENTITIES].length; i++) {
      let entity = S6Entity.newFromNameSpace(m.configs[h][MASTER.ENTITIES][i][MASTER.NAME_SPACE]);
      buildListEntitySectionFromSheet_(currentEntitySection, entity, vars.task, vars.taskImageUrl, param);
    }
  }

  res.addSection(currentEntitySection);
  return res.build();
}


function buildEntityListView2(param) {
  const vars = {
    task: param.getValue(PARAM.TASK_TYPE),
    taskImageUrl: EMPTY,
    actionName: actionEventList.name
  }

  vars.taskImageUrl = TASK_CONFIG[TASK_VALUES][vars.task].icon;

  var res = S6UIService.createCard(`Choose where to ${vars.task} too`, "Select entity type", vars.taskImageUrl);

  var m = S6Master.newMaster();

  var currentEntitySection = S6UIService.createSection();
  currentEntitySection.addWidget(S6UIService.createIamgeLabel(TASK_CONFIG[TASK_VALUES][vars.task].entity, "", vars.taskImageUrl));
  currentEntitySection.addWidget(S6UIService.createDivider());

  param.setValue(PARAM.VIEW_TYPE, ViewType.FILE_TASK);

  if (vars.task == TASK_BUILD_TEMPLATE) {
    vars.actionName = actionEventPropertiesApply.name;
  }
  if (vars.task == TASK_BUILD_TEMPLATE || vars.task == TASK_APPLY_PROPERTIES) {
    param.setNameSpace(PROPERTIES.GLOABL);
    currentEntitySection.addWidget(
      S6UIService.createActionLabel("Global Properties (only)", EMPTY, ICON_GLOBLE_URL, vars.actionName, param.toJSON())
    );
    currentEntitySection.addWidget(
      S6UIService.createLabel("Entity choices include Global and Entity properties")
    );
    currentEntitySection.addWidget(S6UIService.createDivider());
  }

  for (var h = 0; h < m.configs.length; h++) {
    for (let i = 0; i < m.configs[h][MASTER.ENTITIES].length; i++) {
      var mi = m.configs[h][MASTER.ENTITIES][i];
      param.setNameSpace(mi[MASTER.NAME_SPACE]);
      currentEntitySection.addWidget(
        S6UIService.createActionLabel(mi[MASTER.DISPLAY_NAME], EMPTY, mi[MASTER.ICON_URL], vars.actionName, param.toJSON())
      );
    }
  }

  res.addSection(currentEntitySection);
  return res.build();

}


function buildListEntitySectionFromSheet_(section, entity, task, taskImageUrl, param) {
  const vars = {
    folderName: S6Utility.getFullDirectoryFromId(entity.config[ENTITY.ROOT_DIRECTORY_ID])
  }

  param.setValue(PARAM.VIEW_TYPE, ViewType.FILE_TASK);
  param.setValue(PARAM.TASK_TYPE, task);
  param.setNameSpace(entity.config[ENTITY.NAME_SPACE]);

  section.addWidget(S6UIService.createActionLabel(entity.config[ENTITY.NAME_PLURAL], vars.folderName, entity.config[ENTITY.ENTITY_ICON_URL], actionEventList.name, param.toJSON()));

}

function buildTaskActionConfirmView(param) {
  const vars = {
    tasks: "",
    allFolders: "",
    folderId: ""
  }
  vars.task = param.getValue(PARAM.TASK_TYPE);
  const doc = S6Doc.newFromId(param.getDocumentId());

  param.addJSON(PARAM.FIELDS, TASK_FILEDS.fields);

  var res = S6UIService.createCard(`Take action on this file`, "Confirm details", ICON_TASKS_URL);
  var sec = S6UIService.createSection("Confirm action:");
  sec.addWidget(S6UIService.createSmallLabel("Keep the action you orginlly choose. Or change your mind and perform a different task."));
  var taskList;
  if (doc.isFolder()) {
    taskList = FILE_LOCATION_TASKS_NO_COPY.TASKS;
  }
  else {
    taskList = FILE_LOCATION_TASKS.TASKS;
  }
  sec.addWidget(S6UIService.createInputForType("{taskType}", "Task", DATA_TYPE_CHOOSE, "Confirm the action you want to peform", vars.task, { choices: taskList }));

  var fileSection = S6UIService.createSection("File for action:");
  var fileName = S6UIService.createTextInput("{fileName}", "File name", "Optionally, change the name of the traget file. You will not be allowed to use the name of a file that already exists in the target folder.", doc.file.getName());
  fileName.setMultiline(true);
  fileSection.addWidget(fileName);

  vars.folderId = param.getEntityInstanceId(); //instance.data[INSTANCE.INSTANCE_ID];
  vars.allFolders = "allfolders[" + DriveApp.getFolderById(vars.folderId).getName() + "]";
  let folderSec = S6UIService.createSection("Select the locaction for the new file:");
  folderSec.addWidget(S6UIService.createInputForType("{allfolders}", "Folder", vars.allFolders, "", "", { id: vars.folderId }));
  folderSec.addWidget(S6UIService.createInputForType("{subfolder}", "Subfolder", DATA_TYPE_TEXT, "(Optional) Subfolder. Subfolder(s) will be created. Use "
    + FOLDER_SEPERATOR + " if you want to create multiple subfolders. EG a\\b ", ""));

  let fotter = S6UIService.createFooter(S6UIService.createCreateButton("CONFIRM", actionEventConfirmTask.name, param.toJSON()), S6UIService.createCancelButton("CANCEL"));

  res.addSection(sec);
  res.addSection(folderSec);
  res.addSection(fileSection);
  res.setFixedFooter(fotter);

  return res.build();

}


function buildConfirmTaskView(param) {
  const vars = {
    task: "UNKNOWN",
    templateFolderAndFile: "",
    folders: ""
  }
  vars.templateFolderAndFile = `{allfolders}${FOLDER_SEPERATOR}{subfolder}${FOLDER_SEPERATOR}{fileName}`;
  const doc = S6Doc.newFromId(param.getDocumentId());

  var fields = param.getJSON(PARAM.FIELDS);
  for (let i = 0; i < fields.length; i++) {
    //S6Context.debug("Field:", fields[i].field);
    if (fields[i].field == "{taskType}") {
      vars.task = fields[i].value;
      param.setValue(PARAM.TASK_TYPE, vars.task);
      break;
    }
  }

  vars.templateFolderAndFile = S6Utility.replaceFieldInText(fields, vars.templateFolderAndFile);

  var card = S6UIService.createCard(TASK_CONFIG[TASK_VALUES][vars.task].confrimTitle, TASK_CONFIG[TASK_VALUES][vars.task].confirmDesc, TASK_CONFIG[TASK_VALUES][vars.task].icon);
  card.setName(vars.task);

  var info = S6UIService.createInfoLabel(TASK_CONFIG[TASK_VALUES][vars.task].confirmOverview);
  var sectionHelp = S6UIService.createSection();

  sectionHelp = S6UIService.createHelpSection(TASK_CONFIG[TASK_VALUES][vars.task].aboutToInfo, "", TASK_CONFIG[TASK_VALUES][vars.task].help);
  sectionHelp.addWidget(S6UIService.createIamgeLabel("<b>Warning</b>", "", ICON_WARNING_URL));
  sectionHelp.addWidget(S6UIService.createParagraph(TASK_CONFIG[TASK_VALUES][vars.task].endWarning));

  var sectionFile = S6UIService.createSection();
  sectionFile.addWidget(info);

  //S6Context.debug("templateFolderAndFile:", vars.templateFolderAndFile);
  var split = vars.templateFolderAndFile.split(FOLDER_SEPERATOR);
  //S6Context.debug("templateFolderAndFile:split", split.length, "/", split);
  if (split.length > 0) {
    param.setValue("task.newFileName", split[split.length - 1]);
    param.setValue("task.sourceFileUrl", doc.document[DOC.URL]);
    sectionFile.addWidget(S6UIService.createFileLabel(split[split.length - 1], doc.document[DOC.ICON_URL]));
  }
  for (let i = split.length - 2; i > -1; i--) {
    //S6Context.debug("split[", i, "]==", split[i]);
    if (split[i].trim() != "") {
      if (vars.folders == "") {
        param.setValue("task.lastFolder", split[i]);
        vars.folders = split[i];
      }
      else {
        vars.folders = split[i] + FOLDER_SEPERATOR + vars.folders;
      }
      sectionFile.addWidget(S6UIService.createFolderLabel(split[i], i > 0 ? YES : NO));
    }
  }
  //S6Context.debug("folders=", vars.folders);

  param.addValue("task.folders", vars.folders);

  var sectionFields = S6UIService.createSection();
  S6UIService.createFieldLabelsForSection(sectionFields, fields);

  var createBut = S6UIService.createCreateButton(TASK_CONFIG[TASK_VALUES][vars.task].confirmAction, actionEventPerformAction.name, param.toJSON());
  var cancelBut = S6UIService.createCancelButton("CANCEL");
  var butSet = S6UIService.createFooter(createBut, cancelBut);

  //card.addSection(sectionFields);

  card.addSection(sectionFile);
  card.addSection(sectionHelp);
  card.setFixedFooter(butSet);

  return card.build();
}

function buildPerformActionView(param) {
  var res;
  var entity = S6Entity.newFromNameSpace(param.getNameSpace());
  const vars = {
    taskType: param.getValue(PARAM.TASK_TYPE),
    fileName: param.getValue("task.newFileName"),
    url: param.getValue("task.sourceFileUrl"),
    folders: param.getValue("task.folders"),
    driveId: entity.config[ENTITY.ROOT_DIRECTORY_ID],
    sourceFile: "",
    targetFolder: ""
  }
  //S6Context.debug(vars);

  var rootFolder = DriveApp.getFolderById(vars.driveId);
  var factory = new S6DriveFactory();
  factory.createFoldersAndFiles(vars.driveId, [{ folder: vars.folders, oldFolder: "", [ENTITY.FOLDER.DOCS]: [] }]);

  vars.sourceFile = DriveApp.getFileById(S6Utility.getIdFromUrl(vars.url));
  vars.targetFolder = S6Utility.getFolderFromDirectory(rootFolder, vars.folders);

  var it = vars.targetFolder.getFilesByName(vars.fileName)
  if (it.hasNext()) {
    res = S6UIService.createNotification(TASK_CONFIG[TASK_VALUES][vars.taskType].fileExists);
  }
  else {
    let newFile;
    let id = vars.sourceFile.getId();
    switch (vars.taskType) {
      case TASK_COPY:
        newFile = vars.sourceFile.makeCopy(vars.fileName, vars.targetFolder);
        //S6Context.debug("File copied[", newFile.getName(), "] in folder[" + vars.targetFolder.getName(), "]");
        res = S6UIService.createUpdateCardNavigation(buildEditorHomPageView(id), newFile.getUrl(), "See other tab for new file copy.\nIf another tab does no open you may have popus blocked for this site.");
        break;
      case TASK_MOVE:
        try {
          vars.sourceFile.moveTo(vars.targetFolder);
          newFile = vars.sourceFile.setName(vars.fileName);
          //S6Context.debug("File moved[", newFile.getName(), "] in folder[" + vars.targetFolder.getName(), "]");
          res = S6UIService.createUpdateCardNavigation(buildEditorHomPageView(id), null, "File moved.");
        }
        catch (err) {
          S6Context.error(err.stack);
          S6Context.error(err);
          res = S6UIService.createNotification("The file CAN NOT be moved! You may not have the necessary access permissions.");
        }

        break;
      case TASK_SHORT_CUT:
        newFile = vars.targetFolder.createShortcut(vars.sourceFile.getId());
        newFile = newFile.setName(vars.fileName);
        //S6Context.debug("File shortuct created[", newFile.getName(), "] in folder[" + vars.targetFolder.getName(), "]");
        res = S6UIService.createUpdateCardNavigation(buildEditorHomPageView(id), vars.targetFolder.getUrl(), "See other tab of the folder of the new shortuct.\nIf another tab does no open you may have popus blocked for this site.");
        break;
      case TASK_BACKLINK:
        var sourceFolderIt = vars.sourceFile.getParents();
        var sourceFolder;
        while (sourceFolderIt.hasNext()) {
          sourceFolder = sourceFolderIt.next();
          break;
        }
        vars.sourceFile.moveTo(vars.targetFolder);
        newFile = vars.sourceFile.setName(vars.fileName);
        sourceFolder.createShortcut(newFile.getId())

        //S6Context.debug("File moved[", newFile.getName(), "] in folder[" + vars.targetFolder.getName(), "]");
        res = Sres = S6UIService.createUpdateCardNavigation(buildEditorHomPageView(id), sourceFolder.getUrl(), "See other tab of the folder of the moved file.\nIf another tab does no open you may have popus blocked for this site.");
        break;
    }
  }

  return res;

}
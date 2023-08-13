const ViewType =
{
  DETAIL: "DETAIL",
  LIST: "LIST",
  TEMPLATE: "TEMPLATE",
  UPDATE: "UPDATE",
  FILE_TASK: "FILE_TASK"
};
const EditType =
{
  CREATE: "CREATE",
  TEMPLATE: "TEMPLATE",
  UPDATE: "UPDATE"
};

DISPLAY_IN_TEMPLATE = "displayInTemplate";

//var _ = LodashGS.load();

/**
 * @param {string} iconUrl - parth to icon to create 
 * @return {IconImage} - Icon from path
 */
function makeIcon(iconUrl) {
  return CardService.newIconImage().setIconUrl(iconUrl);
}
/**
* Renders the home page for the add-on. Used in all host apps when
* no context selected.
*
* @param {Object} event - current add-on event
* @return {Card[]} Card(s) to display
*/
function onHomePage(event) {
}
/**
 * API method for the Add-On to trigger when it is opened. 
 */
function onDriveHomePageView(param) {

  S6Utility.initAddOn(param.event);
  var res;

  var userProperties = PropertiesService.getUserProperties();
  var masterURL = userProperties.getProperty(USER_PROPERTY_MASTER_URL);

  res = buildManageEntityCardsFromMaster(masterURL);

  return res;
}


/**
 * Creates the card that displays the imput fields to create a new entity.
 * 
 */
function buidEditView(param) {
  var res;
  var vars = {
    createType: param.getValue(PARAM.EDIT_TYPE),
    cardTitle: "",
    hint: "",
    icon: "",
    label: "",
    functionName: ";;",
    createButtonName: "CONFIRM",
    fields: {}
  }

  const entity = S6Entity.newFromNameSpace(param.getNameSpace());
  param.setValue(PARAM.CREATE_TYPE, vars.createType);
  S6Context.debugFn(buidEditView.name, "entityInstranceId:", param.getEntityInstanceId());

  var isEditable; // FUNCTION

  switch (vars.createType) {
    case EditType.CREATE:
      vars.cardTitle = "Create " + entity.config[ENTITY.NAME_SINGUAL];
      vars.hint = "Template folders and documents";
      vars.icon = ICON_CREATE_URL;
      vars.label = "Enter " + entity.config[ENTITY.NAME_SINGUAL] + " details";
      vars.functionName = actionEventCreate.name;
      vars.createButtonName = "CONFIRM";
      vars.fields = entity.config[ENTITY.FIELDS];
      isEditable = function (field) { return true; };
      break;
    case EditType.UPDATE:
      vars.cardTitle = "Update existings " + entity.config[ENTITY.NAME_SINGUAL];
      vars.hint = "Change details";
      vars.icon = ICON_CHANGE;
      vars.label = `Updatable entity details:`;
      vars.functionName = actionEventCreate.name;
      //param.setEntityInstanceId(param.getEntityInstanceId())
      vars.createButtonName = "CONFIRM";
      var instance = S6EntityInstance.newFromFolderId(param.getEntityInstanceId(), param.getNameSpace());
      if (!instance) {
        return S6UIService.createNotification("This entity was not created by this Add On, so it can not be updated by this Add On. First,'create' it with this Add On.");
      }
      vars.fields = instance.data[INSTANCE.FIELDS];
      isEditable = function (field) { return field[INSTANCE.FIELD.UPDATEABLE] == YES };
      break;
    case EditType.TEMPLATE:
      vars.cardTitle = `Create Folder or Document`;
      vars.hint = "Enter additional details";
      vars.icon = ICON_POST_ADD_URL;
      vars.label = `Enter additional template details:`;
      vars.functionName = actionEventConfirmConfirmCreateDocWithFieldsFromTemplate.name;
      vars.createButtonName = "CONFIRM";
      const template = param.getJSON(PARAM.TEMPLATE);
      vars.fields = template[ENTITY.TEMPLATE_ATTR.FIELDS];
      //param.deleteAll(PARAM.TEMPLATE);
      // param.replaceJSON(PARAM.FIELDS, vars.fields);
      //param.setEntityInstanceId(param.getEntityInstanceId());
      isEditable = function (field) { return field[ENTITY.FIELD_ATTR.ROOT_FIELD] == NO };
      break;
    case EditType.FILE_TASK:
      vars.cardTitle = "Actions for existings " + entity.config[ENTITY.NAME_SINGUAL];
      vars.hint = "Working with a file's details";
      vars.icon = ICON_CHANGE;
      vars.label = `Updatable entity details:`;
      vars.functionName = actionEventCreate.name;
      //param.setEntityInstanceId(param.getEntityInstanceId())
      vars.createButtonName = "CONFIRM";
      break;
  }

  const sectionReadOnly = S6UIService.createSection("Non-updateable entity details:");
  const sectionEditable = S6UIService.createSection(vars.label);
  const sectionTemplate = S6UIService.createSection();

  let anyMandatory = false;
  //S6Context.log("vars:", vars);

  for (let i = 0; i < vars.fields.length; i++) {
    //S6Context.log("next field:", vars.fields[i]);
    vars.fields[i][DISPLAY_IN_TEMPLATE] = YES;
    if (isEditable(vars.fields[i])) {
      if (vars.fields[i][ENTITY.FIELD_ATTR.MANDATORY] == YES) {
        anyMandatory = true;
      }
      const titleDisplay = vars.fields[i][ENTITY.FIELD_ATTR.TITLE] + (vars.fields[i][ENTITY.FIELD_ATTR.MANDATORY] == YES ? "*" : "");
      fieldType = S6Utility.replaceFieldInText(vars.fields, vars.fields[i][ENTITY.FIELD_ATTR.TYPE]);
      sectionEditable.addWidget(
        S6UIService.createInputForType(
          vars.fields[i][ENTITY.FIELD_ATTR.FIELD_NAME],
          titleDisplay,
          fieldType,
          vars.fields[i][ENTITY.FIELD_ATTR.HINT],
          vars.fields[i][ENTITY.FIELD_ATTR.VALUE],
          { id: param.getEntityInstanceId() })
      );
    }
    else {
      sectionReadOnly.addWidget(
        S6UIService.createFieldLabel(vars.fields[i])
      );
    }
  }

  var secHelp;
  if (vars.createType == EditType.TEMPLATE) {
    const t = entity.templateFromId(param.getValue(PARAM.TEMPLATE_ID));
    const templateUrl = S6MasterTemplate.lookupUrl(t[ENTITY.TEMPLATE_ATTR.URL], t[ENTITY.FIELDS]);

    if (t[ENTITY.TEMPLATE_ATTR.USE_DOC_PROPERTIES] == YES) {
      var { properties, autoProperties, selectorProperties } =
        PropertyApplyFactory
          .getEditableDocumentProperties(S6Utility.getIdFromUrl(templateUrl), param.getEntityInstanceId(), param.getNameSpace());

      for (let a = 0; a < autoProperties.length; a++) {
        _createPropertyComponent(EMPTY, sectionEditable, autoProperties[a], EMPTY, {}, true, false);
        autoProperties[a][DISPLAY_IN_TEMPLATE] = YES;
        vars.fields[vars.fields.length] = autoProperties[a];
      }

      for (let p = 0; p < selectorProperties.length; p++) {
        _createPropertyComponent(EMPTY, sectionEditable, selectorProperties[p], EMPTY, {}, false, false);
        selectorProperties[p][DISPLAY_IN_TEMPLATE] = YES;
        vars.fields[vars.fields.length] = selectorProperties[p];
      }
      for (p1 in properties) {
        properties[p1][DISPLAY_IN_TEMPLATE] = NO;
        vars.fields[vars.fields.length] = properties[p1];
      }
    }


    if (t[ENTITY.TEMPLATE_ATTR.IS_FOLDER] == NO) {
      let file = S6DriveApp.getFileByUrl(templateUrl);
      if (file) {
        sectionTemplate.addWidget(S6UIService.createFileLabelFromUrl(t[ENTITY.TEMPLATE_ATTR.DESC], templateUrl));
        sectionTemplate.addWidget(S6UIService.createDivider());
        sectionTemplate.addWidget(S6UIService.createThumbnailImageFromFile(file));
      }
      else {
        return S6UIService.createNotification("The template does not exists. The properties for this need checking");
      }
    }
    else {
      //sectionTemplate.addWidget(S6UIService.createImage(ICON_DRIVE_FOLDER));
      sectionTemplate.addWidget(S6UIService.createIconLabel(t[ENTITY.TEMPLATE_ATTR.DESC], EMPTY, ICON_GOOGLE_TEAMDRIVE_URL));
      sectionTemplate.addWidget(S6UIService.createDivider());
      sectionTemplate.addWidget(S6UIService.createImage(ICON_GOOGLE_TEAMDRIVE_URL));
    }
    //sectionTemplate.addWidget(S6UIService.createDivider());
  }
  else if (vars.createType == EditType.UPDATE) {
    secHelp = S6UIService.createHelpSection("About updating entitie", "", "Use an update to change the value of thoes attributes that are editable on the entity. An update will also bring the entity up to date with the folders defined in its <b>Settings</b>—missing folders are created, and old folder names (as identfied as old names in <b>Settings</b>) are renamed to match new folder names.");
  }
  else if (vars.createType == EditType.CREATE) {
    secHelp = S6UIService.createHelpSection("About createing entities", "", "Creating a new entity creates folders and files according to this entity's <b>Settings</b>. <br><br><b>This tool will never delete a file or folder.</b> If the folder for the entity already exists and you [re]create it, it will not replace it or cause a duplicate. This create function is idempotent, which means no matter how often it is executed, the results go unchanged. The only exception is if the function fails, leaving some of the template folders and files uncreated. Rerunning it will bring the entity up to date.<br><br>You can use this function to 'create' entities that already exist but were not created by this tool. Missing folders will be created, but other existing folders will not be affected and nothing will be deleted.");
  }
  if (anyMandatory) {
    sectionEditable.addWidget(S6UIService.createInfoLabel("* Required fields."));
  }
  console.log("vars.fields", vars.fields);
  param.replaceJSON(PARAM.FIELDS, vars.fields);
  res = S6UIService.createCard(vars.cardTitle, vars.hint, vars.icon);
  const createBut = S6UIService.createCreateButton(vars.createButtonName, vars.functionName, param.toJSON());
  const cancelBut = S6UIService.createCancelButton("CANCEL");
  const fotter = S6UIService.createFooter(createBut, cancelBut);

  res.setFixedFooter(fotter);
  if (vars.createType != EditType.CREATE) {
    res.addSection(sectionReadOnly);
  }
  res.addSection(sectionEditable);
  if (vars.createType == EditType.TEMPLATE) {
    res.addSection(sectionTemplate);
  }
  if (secHelp) {
    res.addSection(secHelp);
  }

  if (createTemplateCards == EditType.CREATE) {
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation()
        .pushCard(res))
      .build()
      ;
  } // else
  return res.build();
}


/**
 * Creates the card that displays the input fields to create a new entity.
 *
 */
function buildTemplateEditorWorker_(entity, instance, param) {
  var res;

  var card = S6UIService.createCard("New Folders and Files", "Select a template", ICON_POST_ADD_URL);
  card.setDisplayStyle(CardService.DisplayStyle.REPLACE);
  var sectionVariables = S6UIService.createSection(entity.config[ENTITY.NAME_SINGUAL] + ":");

  S6UIService.createFieldLabelsForSection(sectionVariables, instance.data[INSTANCE.FIELDS]);
  sectionVariables.addWidget(S6UIService.createDivider());
  sectionVariables.addWidget(S6UIService.createIconLabel("Select a template to create a new document from", "Open a heading to see options", ICON_POST_ADD_URL));

  if (instance.data[INSTANCE.FIELDS].length > 0) {
    card.addSection(sectionVariables);
  }

  const templates = entity.clonedUpdateTemplates(instance.data[INSTANCE.FIELDS])
  S6Context.debug("Cloned templates", JSON.stringify(templates));
  S6Context.debug("Original templates", JSON.stringify(entity.config[ENTITY.TEMPLATES]));

  createTemplateCards(instance, templates, card, param);
  //createTemplateCards(instance, entity.config[ENTITY.TEMPLATES], card, param);


  res = card.build();
  return res;

}


function buildCreateEntityView(param) {
  const entity = S6Entity.newFromNameSpace(param.getNameSpace());
  const createType = param.getValue(PARAM.CREATE_TYPE);
  const fields = param.getJSON(PARAM.FIELDS);

  const vars = {
    forMsg: "unknown:forMsg",
    countMsg: "unknwon:countMsg",
    headerMsg: "unknown:headerMsg",
    headerHintMsg: "unknow:headerHintMsg"
  }

  //S6Context.log(entity.config);

  var folderMetaData = new FolderMetaData(
    fields,
    entity.config[ENTITY.CONFIG_ID],
    entity.config[ENTITY.ROOT_DIRECTORY_ID],
    entity.config[ENTITY.NAME_SPACE]
  );

  // CREATE BEGIN
  var driveFactory = new S6DriveFactory();

  var folders = entity.clonedUpdateFolders(fields);
  driveFactory.createFoldersAndFiles(entity.config[ENTITY.ROOT_DIRECTORY_ID], folders, folderMetaData, entity.config[ENTITY.LIST_DEPTH]);

  const folderCount = driveFactory.foldersCreated;
  const docCount = driveFactory.filesCreated;
  var rootFolderUrl = driveFactory.rootFolderUrl;

  const newParam = new Param();
  newParam.setValue(PARAM.URL, rootFolderUrl);
  newParam.setNameSpace(entity[ENTITY.NAME_SPACE]);
  newParam.addEntityInstanceId(driveFactory.rootFolderId);

  var sectionVariables = S6UIService.createSection();

  if (createType == EditType.UPDATE) {
    vars.forMsg = "Update for";
    vars.headerMsg = "Updated " + entity.config[ENTITY.NAME_SINGUAL];
    vars.headerHintMsg = "Attrbubtes and folders.";
    vars.countMsg = `Attributes and ${folderCount} folder(s) updated.`;
  }
  else if (createType == EditType.CREATE) {
    vars.forMsg = entity.config[ENTITY.NAME_SINGUAL] + " created with";
    vars.headerMsg = "Create " + entity.config[ENTITY.NAME_SINGUAL];
    vars.headerHintMsg = "Folders and files.";
    vars.countMsg = `${folderCount} folder(s) and ${docCount} file(s) created.`;
  }
  sectionVariables.addWidget(S6UIService.createInfoLabel(vars.forMsg));
  S6UIService.createFieldLabelsForSection(sectionVariables, fields);

  var section = S6UIService.createSection();
  section.addWidget(S6UIService.createInfoLabel(vars.countMsg));
  section.addWidget(S6UIService.createActionLabelOpen("Open folder", "In a new tab", ICON_DRIVE_URL, actionEventOpenLink.name, newParam.toJSON()));
  section.addWidget(CardService.newDivider());

  var card = S6UIService.createCard(vars.headerMsg, vars.headerHintMsg, ICON_DONE_URL)
    .addSection(sectionVariables)
    .addSection(section)
    .build()
    ;

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .popCard()
      .popCard()
      .pushCard(card))
    .build()
    ;
}

/**
 * Event API show the UI to create an Entity
 * 
 */
function buildTemplateEditorView(param) {
  var res;
  var id = param.getEntityInstanceId();
  var entity = S6Entity.newFromNameSpace(param.getNameSpace());
  var instance = S6EntityInstance.newFromFolderId(id, param.getNameSpace());
  S6Context.debugFn(buildTemplateEditorView.name, "id:", id, ", entity:", entity, ", instance:", instance)

  if (instance) {
    if (instance.data[ENTITY.YOU_HAVE_ACCESS] == NO) {
      res = buildNoAccess(entity);
    }
    else {
      if (instance.data[INSTANCE.FIELDS] != null) {
        var card = buildTemplateEditorWorker_(entity, instance, param);

        res = CardService.newActionResponseBuilder()
          .setNavigation(CardService.newNavigation()
            .pushCard(card))
          .build()
          ;
      }
    }
  }
  else {
    res = CardService.newActionResponseBuilder().setNotification
      (
        CardService.newNotification()
          .setText("The selected item was not be created by this Add On so this Add On can not create a template for it.")
      )
      .build();

  }
  return res;
}
function buildNoAccess(entity) {
  res = S6UIService.createCard("Access Denied", "To this " + entity.config[ENTITY.NAME_SINGUAL], ICON_LOCK_URL);
  sec =
    S6UIService.createHelpSection("You do not have update access to this " + entity.config[ENTITY.NAME_SINGUAL], EMPTY,
      "You do not have the the authority to create files on this directory.", false, entity.config[ENTITY.ENTITY_ICON_URL]);
  res.addSection(sec);
  return res.build();
}


/**
 * Event Action to Create a list of Folders
 */
function buildListEntitiesView(param) {

  const entity = S6Entity.newFromNameSpace(param.getNameSpace());
  var card = createListManagedFolderCard(entity, param);

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .pushCard(card))
    .build()
    ;
}

function _createSortabkleKey(dataType, key = EMPTY) {
  var res = EMPTY;
  if (dataType == DATA_TYPE_DATE) {
    res = Date.parse(key);
    if (isNaN(res)) {
      res = 0;
    }
  }
  else {
    res = key.toUpperCase();
  }
  return res;
}

function sortListItem(unsortedFolders) {
  var res;

  res = unsortedFolders.sort(sortFunction);

  function sortFunction(a, b, index = 0) {
    var res = 0;
    if (a[index] === b[index]) {
      if (index == 0) {
        res = sortFunction(a, b, 1);
      }
    }
    else {
      if (a[index + 2]) { // if true then text asc
        res = (a[index] < b[index]) ? -1 : 1;
      }
      else { // of flase then date dsc
        res = (a[index] > b[index]) ? -1 : 1;
      }
    }
    //S6Context.debugFn("sortFunction", "a[", a[index], "]b[", b[index], "]inxdex[", index, "]res[", res, "]");
    return res;
  }

  return res;
}
function indexIt(listDataType, section, index, name, initial = true, bold) {
  var orginalIndex = index;
  var brOpen = "<b>";
  var brClose = "</b>";
  var color = bold ? PRIMARY_COLOUR : SECONDARY_COLOUR;
  if (listDataType == DATA_TYPE_DATE) {
    var date = new Date(Date.parse(name));
    if (isNaN(date.getFullYear() && index != "OTHER")) {
      index = "OTHER";
    }
    else if (date.getFullYear() + "" != index) {
      index = date.getFullYear() + "";
    }
  }
  else {
    if (initial) {
      if (name.substring(0, 1).toUpperCase() != index) {
        index = name.substring(0, 1).toUpperCase();
      }
    }
    else {
      index = name;
    }
  }

  if (index != orginalIndex) {
    section.addWidget(S6UIService.createInfoLabel(`${brOpen}${index}${brClose}`, color));
    res = index;
  }
  return index;
}
/**
 * 
 */
function createListManagedFolderCard(entity, param) {
  var res;
  const viewType = param.getValue(PARAM.VIEW_TYPE);
  const taskType = param.getValue(PARAM.TASK_TYPE);
  const nameSpace = param.getNameSpace();

  const vars = {
    iconURL: "",
    functionName: "",
    order: "Ordered 0→9,A→Z",
    title: "unknown",
    functionName: ";;",
    icon: ICON_RIGHT_ARROW_URL,
    depth: 0,
    groupBy: EMPTY,
    groupByType: EMPTY,
    sortyBy: EMPTY,
    sortByType: EMPTY
  }

  try {
    S6Context.time("DriveUI Get Root Folder:" + entity.config[ENTITY.ROOT_DIRECTORY_ID]);
    var folder = S6DriveApp.getFolderById(entity.config[ENTITY.ROOT_DIRECTORY_ID]);
    S6Context.timeEnd("DriveUI Get Root Folder:" + entity.config[ENTITY.ROOT_DIRECTORY_ID]);
    if (folder == null) {
      S6Context.error("Can not find folder for ID:" + id);
    }
    else {

      vars.depth = parseInt(entity.config[ENTITY.LIST_DEPTH]);
      vars.groupBy = S6Utility.trim(entity.config[ENTITY.LIST_GROUP_BY]);
      vars.groupByType = S6Utility.trim(entity.config[ENTITY.LIST_GROUP_BY_TYPE]);

      vars.sortyBy = S6Utility.trim(entity.config[ENTITY.LIST_SORT_BY]);
      vars.sortByType = S6Utility.trim(entity.config[ENTITY.LIST_SORT_BY_TYPE]);

      S6Context.debugFn("createListManagedFolderCard", vars);

      if (entity.config[ENTITY.LIST_DATATYPE] == DATA_TYPE_DATE) {
        vars.order = "Ordered by date, latest→oldest";
      }
      if (vars.groupBy != EMPTY) {
        vars.order = "Grouped by " + entity.config[ENTITY.LIST_GROUP_BY_TITLE];
      }

      res = S6UIService.createCard('List of ' + entity.config[ENTITY.NAME_PLURAL], vars.order, ICON_LIST_URL);
      var orderSection = CardService.newCardSection();
      // orderSection.addWidget(S6UIService.createSmallLabel(vars.order));
      // res.addSection(orderSection);

      var section = CardService.newCardSection();

      if (viewType == ViewType.DETAIL) {
        vars.iconURL = entity.config[ENTITY.ENTITY_ICON_URL];
        vars.functionName = actionEventDetail.name;
        vars.title = "Select an item to see more details";
      }
      else if (viewType == ViewType.TEMPLATE) {
        vars.iconURL = ICON_POST_ADD_URL;
        vars.functionName = actionEventTemplateEditor.name;
        vars.title = "Select an item to create document for from a template";
      }
      else if (viewType == ViewType.LIST) {
        vars.iconURL = ICON_DRIVE_URL;
        vars.functionName = actionEventOpenLink.name;
        vars.title = "Select an item to open in Drive";
        vars.icon = ICON_OPEN_IN_NEW_WINDOW_URL;
      }
      else if (viewType == ViewType.UPDATE) {
        vars.iconURL = ICON_CHANGE;
        vars.functionName = actionEventEdit.name;
        param.setValue(PARAM.EDIT_TYPE, EditType.UPDATE);
        vars.title = "Select an item to update";
      }
      else if (viewType == ViewType.FILE_TASK) {
        vars.iconURL = TASK_CONFIG["TASKS"][taskType].icon;
        vars.functionName = TASK_CONFIG["TASKS"][taskType].functionName;
        vars.title = TASK_CONFIG["TASKS"][taskType].listTitle;
      }
      section.addWidget(S6UIService.createIconLabel(vars.title, "", vars.iconURL));
      section.addWidget(S6UIService.createDivider());

      if (viewType == ViewType.LIST) {
        iconURL = ICON_DRIVE_URL;
      }
      S6Context.time("DriveUI get Folders");
      const folders = S6DriveApp.getFoldersAtDepth(folder, vars.depth);
      S6Context.timeEnd("DriveUI get Folders");
      const unsortedFolders = new Map();

      const ITEM = {
        name: "name",
        sortBy: "sortBy",
        folder: "folder",
        listItem: "listItem",
        url: "url",
        id: "id",
        groupBy: "groupBy",
      }

      var keys = [];
      var item = {};
      for (var k = 0; k < folders.length; k++) {
        item[ITEM.name] = folders[k].getName();

        try {
          if (!S6Utility.startsWith(item[ITEM.name], entity.config[ENTITY.IGNORE_LIST])) {
            S6Context.time("DriveUI process folder " + item[ITEM.name]);
            var instance = S6EntityInstance.newFromFolder(folders[k], nameSpace);
            S6Context.debug("List Item Display", instance.data[INSTANCE.FIELDS], entity.config[ENTITY.LIST_DESCRIPTION]);
            item[ITEM.listItem] = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], entity.config[ENTITY.LIST_DESCRIPTION]);
            keys[k] = [];
            if (S6Utility.trim(vars.groupBy) != EMPTY) {
              item[ITEM.groupBy] = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], vars.groupBy);
              S6Context.debug("Group By:", item[ITEM.groupBy]);
              keys[k][0] = _createSortabkleKey(vars.groupByType, item[ITEM.groupBy]);
            }
            else {
              keys[k][0] = EMPTY;
            }
            S6Context.debug("Sort by field:", vars.sortyBy);
            item[ITEM.sortBy] = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], vars.sortyBy);
            S6Context.debug("Sort by value:", item[ITEM.sortBy]);
            keys[k][1] = _createSortabkleKey(vars.sortByType, item[ITEM.sortBy]);
            S6Context.debug("Sort by key:", keys[k][1]);

            S6Context.debug("Group and sort by:", item[ITEM.groupBy], item[ITEM.sortBy]);
            item[ITEM.url] = folders[k].getUrl();
            item[ITEM.id] = folders[k].getId();

            keys[k][2] = vars.groupByType != DATA_TYPE_DATE;
            keys[k][3] = vars.sortByType != DATA_TYPE_DATE;
            unsortedFolders.set(keys[k], item);
            S6Context.timeEnd("DriveUI process folder " + item[ITEM.name]);
          }
        }
        catch (err) {
          S6Context.error(err.stack);
          S6Context.error(err);
        }
        item = {};
      }
      const sortedFolders = sortListItem(keys);

      let index = EMPTY;
      let groupByIndex = EMPTY;
      for (let i = 0; i < sortedFolders.length; i++) {
        if (sortedFolders[i]) {
          let next = unsortedFolders.get(sortedFolders[i]);
          if (next) {
            S6Context.time("DriveUI add ListItem" + item[ITEM.name]);
            S6Context.debug("DriveUI NEXT " + item, " for ", sortedFolders[i], vars.sortByType);
            let name = next[ITEM.name];
            S6Context.debug("Next folder", next);
            let id = next[ITEM.id];
            let url = next[ITEM.url];
            let groupBy = next[ITEM.groupBy];
            let subLabel = next[ITEM.listItem];

            if (S6Utility.trim(groupBy) != EMPTY) {
              groupByIndex = indexIt("text", section, groupByIndex, groupBy, false, true);
            }
            index = indexIt(entity.config[ENTITY.LIST_DATATYPE], section, index, name, true, groupBy == EMPTY);

            param.setEntityInstanceId(id);
            param.setValue(PARAM.URL, url);
            let icon = _helpChooseIcon(entity, vars.iconURL, name);
            let label = S6UIService.createActionLabel(name, subLabel, icon, vars.functionName, param.toJSON(), vars.icon);
            if (vars.sortByType == DATA_TYPE_DATE) {
              label.setTopLabel(Utilities.formatDate(new Date(sortedFolders[i][1]), Session.getTimeZone(), "d MMMM yyyy"));
            }
            section.addWidget(label);
            S6Context.timeEnd("DriveUI add ListItem" + item[ITEM.name]);
          }
        }
      }
      res.addSection(section);
    }
  }
  catch (err) {
    S6Context.error("CcreateListManagedFolderCard\n" + err);
    throw err;
  }
  return res.build();
}
function _helpChooseIcon(entity, defaultIcon, name) {
  S6Context.time(`Choose Icon for ${entity} and ${name}`);
  var res = defaultIcon;
  if (entity.config[ENTITY.LIST_DATATYPE] == DATA_TYPE_DOMAIN) {
    res = S6Utility.getFaviconDomainFetchURL(name);
    if (res == EMPTY) {
      res = entity.config[ENTITY.ENTITY_ICON_URL];
    }
  }
  else if (entity.config[ENTITY.LIST_DATATYPE] == DATA_TYPE_STAFF) {
    var user = S6AdminDir.getUserByFullName(name);
    if (user) {
      var photo = user.thumbnailPhotoUrl;
      if (photo) {
        res = photo;
      }
    }
  }
  S6Context.timeEnd(`Choose Icon for ${entity} and ${name}`);
  return res;
}

function buildConfirmConfirmCreateDocWithFieldsFromTemplateView(param) {
  const temp = param.getJSON(PARAM.TEMPLATE);
  const fields = param.getJSON(PARAM.FIELDS);
  var notification = S6UIService.validateFields(fields);
  if (notification != null) {
    return notification;
  }
  S6Context.debug("confirmConfirmCreateDocWithFieldsFromTemplate", PARAM.TEMPLATE_FILE, temp[ENTITY.TEMPLATE_ATTR.FILE_NAME]);
  param.replaceValue(PARAM.TEMPLATE_FILE, S6Utility.replaceFieldInText(fields, temp[ENTITY.TEMPLATE_ATTR.FILE_NAME]));

  //S6Context.log("end:confirmConfirmCreateDocWithFieldsFromTemplate");
  return buildConfirmCreateDocFromTemplateView(param);
}

function buildConfirmCreateDocFromTemplateView(param) {
  var res;
  const template = param.getJSON(PARAM.TEMPLATE);
  const fields = param.getJSON(PARAM.FIELDS);//;template[ENTITY.TEMPLATE_ATTR.FIELDS];
  var notification = S6UIService.validateFields(fields);
  if (notification != null) {
    return notification;
  }

  const templateUrl = S6MasterTemplate.lookupUrl(template[ENTITY.TEMPLATE_ATTR.URL], fields);

  let fileName = S6Utility.replaceFieldInText(fields, template[ENTITY.TEMPLATE_ATTR.FILE_NAME]);
  S6Context.debug("Create file ", JSON.stringify(template));
  S6Context.debug("Create filename url template", template[ENTITY.TEMPLATE_ATTR.URL], " template filename ", template[ENTITY.TEMPLATE_ATTR.FILE_NAME], "filename", fileName);

  template[ENTITY.TEMPLATE_ATTR.FILE_NAME] = fileName;
  param.replaceJSON(PARAM.TEMPLATE, template);

  if (!fileName) {
    S6Context.error("fileName", fileName);
    return S6UIService.createNotification("There is a problem with the template you have chosen. Please check it is setup correctly");
  }

  var fileORFolder = "Document from template";
  if (template[ENTITY.TEMPLATE_ATTR.IS_FOLDER] == YES) {
    fileORFolder = "Folder";
  }

  var card = S6UIService.createCard(`New ${fileORFolder}`, "Create and Open", ICON_POST_ADD_URL);
  var info = S6UIService.createInfoLabel(`The new ${fileORFolder} will be created in the following foders with the following name.`);
  var section = S6UIService.createSection();

  section.addWidget(info);
  var split = fileName.split(FOLDER_SEPERATOR);
  S6Context.debugFn("buildConfirmCreateDocFromTemplateView folder split", split);
  for (let i = 0; i < split.length - 1; i++) {
    if (split[i].trim() != EMPTY) {
      S6Context.debug("Folder label ", split[i]);
      section.addWidget(S6UIService.createFolderLabel(split[i], i > 0 ? YES : NO));
    }
  }

  if (split.length > 0) {
    if (templateUrl != EMPTY) {
      section.addWidget(S6UIService.createFileLabelFromUrl(split[split.length - 1], templateUrl));
    }
    //else
    //section.addWidget(S6UIService.createLabel(split[split.length - 1]));
  }

  var sectionFields = S6UIService.createSection();

  for (let f = 0; f < fields.length; f++) {
    //S6Context.log("sectionFields", fields[f]);
    if (fields[f][DISPLAY_IN_TEMPLATE] == YES) {
      sectionFields.addWidget(S6UIService.createFieldLabel(fields[f]));
    }
  }

  var createBut = S6UIService.createCreateButton("CREATE & OPEN", actionEventCreateDocFromTemplate.name, param.toJSON());
  var cancelBut = S6UIService.createCancelButton("CANCEL");
  var butSet = S6UIService.createFooter(createBut, cancelBut);

  if (templateUrl != EMPTY) {
    section.addWidget(S6UIService.createDivider());
    section.addWidget(S6UIService.createThumbnailImageFromUrl(templateUrl));
    section.addWidget(S6UIService.createDivider());
  }
  else {
    section.addWidget(S6UIService.createDivider());
    section.addWidget(S6UIService.createImage(ICON_GOOGLE_TEAMDRIVE_URL));
    section.addWidget(S6UIService.createDivider());
  }


  card.addSection(sectionFields);
  card.addSection(section);
  card.setFixedFooter(butSet);

  res = card.build();
  //S6Context.log(res.printJson());
  return res;
}

//!t
function buildCreateDocFromTemplateView(param) {
  var res;

  const entity = S6Entity.newFromNameSpace(param.getNameSpace());
  const template = param.getJSON(PARAM.TEMPLATE);
  const fields = template[ENTITY.TEMPLATE_ATTR.FIELDS];
  const templateUrl = S6MasterTemplate.lookupUrl(template[ENTITY.TEMPLATE_ATTR.URL], fields);

  var foldersAndDocs = S6DriveFactory.makeFoldersAndDoc(template[ENTITY.TEMPLATE_ATTR.FILE_NAME], templateUrl);
  driveFactory = new S6DriveFactory();
  driveFactory.createFoldersAndFiles(entity.config[ENTITY.ROOT_DIRECTORY_ID], foldersAndDocs);

  var newFile = EMPTY;
  if (template[ENTITY.TEMPLATE_ATTR.IS_FOLDER] == NO) {
    var newFile = driveFactory.getFromRecord(foldersAndDocs[0][ENTITY.FOLDER.DOCS][0][ENTITY.FOLDER.DOC.FILE_NAME]);
    newFileUrl = newFile.getUrl();
    if (template[ENTITY.TEMPLATE_ATTR.USE_DOC_PROPERTIES] == YES) {
      PropertyApplyFactory.replaceFrom(newFile.getId(), param.getJSON(PARAM.FIELDS));
    }
  }
  else {
    var newFolder = driveFactory.getLastRecorded();
    newFileUrl = newFolder.getUrl();
  }

  const card = S6UIService.createCard("File created from template", "", ICON_DONE_URL);
  const section = S6UIService.createSection("File Created");
  section.addWidget(S6UIService.createFileLabelFromUrl(template[ENTITY.TEMPLATE_ATTR.FILE_NAME], templateUrl));
  card.addSection(section);
  var butHome = S6UIService.createGoToCardButton("HOME", entity.config[ENTITY.NAME_SPACE]);
  var footer = S6UIService.createFooter(butHome);
  card.setFixedFooter(footer);

  var navGoHome = CardService.newNavigation().popToNamedCard(entity.config[ENTITY.NAME_SPACE]);
  var notify = CardService.newNotification().setText("New file created from template and opend in a new tab. If it does not open you may have a pop-up blocker on.");
  var openLink = CardService.newOpenLink().setUrl(newFileUrl);

  var close = CardService.newActionResponseBuilder()
    .setNavigation(navGoHome)
    .setOpenLink(openLink)
    .setNotification(notify);

  var res = close.build();
  return res;
}
/**
 *
 */
function createTemplateCards(instance, temps, card, param) {
  param.addJSON(PARAM.FIELDS, instance.data[INSTANCE.FIELDS]);

  for (var th in temps) {
    var section = S6UIService.createSection();
    section.setCollapsible(true);
    section.setNumUncollapsibleWidgets(1);
    section.addWidget(S6UIService.createParagraph(temps[th][ENTITY.TEMPLATE_ATTR.HEADING]));

    let inTemps = temps[th][ENTITY.TEMPLATES];
    for (t in inTemps) {

      var fields = inTemps[t][ENTITY.FIELDS];
      var templateUrl = S6MasterTemplate.lookupUrl(inTemps[t][ENTITY.TEMPLATE_ATTR.URL], fields);

      var icon = EMPTY;
      //if (inTemps[t][ENTITY.TEMPLATE.URL] != EMPTY) {
      if (templateUrl != EMPTY) {
        icon = S6Utility.getAppIconForTypeFromURL(templateUrl);// inTemps[t][ENTITY.TEMPLATE.URL]);
      }
      else {
        icon = ICON_NEW_FOLDER_URL;// S6Utility.getIconUrlForFolder();
      }


      var action = actionEventConfirmCreateDocFromTemplate.name;
      if (inTemps[t][ENTITY.TEMPLATE_ATTR.HAS_FIELDS] == YES || inTemps[t][ENTITY.TEMPLATE_ATTR.USE_DOC_PROPERTIES] == YES) {
        S6Context.debug("Template has fields");
        param.replaceJSON(PARAM.TEMPLATE, inTemps[t]);
        param.replaceValue(PARAM.TEMPLATE_ID, inTemps[t][ENTITY.TEMPLATE_ATTR.ID]);
        action = actionEventEdit.name;
        param.setValue(PARAM.EDIT_TYPE, EditType.TEMPLATE);
      }
      else {
        S6Context.debug("Template does not have fields");
        S6Context.debug(inTemps[t]);
        param.replaceJSON(PARAM.TEMPLATE, inTemps[t]);
        param.replaceValue(PARAM.TEMPLATE_ID, inTemps[t][ENTITY.TEMPLATE_ATTR.ID]);
        action = actionEventConfirmCreateDocFromTemplate.name;
      }

      let label = S6UIService.createActionLabel(inTemps[t][ENTITY.TEMPLATE_ATTR.DESC], "", icon, action, param.toJSON());

      section.addWidget(label);
    }
    card.addSection(section);
  }
}

function cacheAllEntities(master) {
  var version = S6Utility.getScriptProperty(CACHE_VERSION, true);
  var localVersion = S6Cache.userCacheGetString(`${CACHE_VERSION}.local`);
  if (version != localVersion) {
    S6Cache.userCacheClear();
    S6Cache.userCachePutString(`${CACHE_VERSION}.local`, version);
    S6Context.info("Cache version changed, cache cleared.", version, localVersion);
  }
  S6Context.info("cacheAllEntities", master);
  let count = 0;
  for (let h = 0; h < master.configs.length; h++) {
    for (let i = 0; i < master.configs[h][MASTER.ENTITIES].length; i++) {
      S6Context.info("Cache entity", master.configs[h][MASTER.ENTITIES][i][MASTER.NAME_SPACE]);
      S6Entity.newFromNameSpace(master.configs[h][MASTER.ENTITIES][i][MASTER.NAME_SPACE]);
      count++;
    }
  }
  S6Context.info("Cache " + count);
  S6Context.info("Cache templates", S6MasterTemplate.new());
  //S6Hyperdrive.engage(cacheAllEntities.name, master);
  
  return true;
}


function buildManageEntityCardsFromMaster(masterUrl) {
  var res = S6UIService.createCard("Manage SECTION6 Drive Entities", "Folders and Files", ICON_S6_URL);
  var master = S6Master.newMaster(masterUrl);
  S6Hyperdrive.engage(cacheAllEntities.name, master);

  var sec;
  console.log("master.configs", JSON.stringify(master.configs));
  for (let h = 0; h < master.configs.length; h++) {
    if (!sec) {
      sec = S6UIService.createSection();
      if (master.configs[h][MASTER.SUB_HEADING] == NO) {
        sec.addWidget(S6UIService.createIconLabel(master.configs[h][MASTER.HEADING], "Manage entity's folders and files.", master.configs[h][MASTER.ICON_URL]));
        for (let i = 0; i < master.configs[h][MASTER.ENTITIES].length; i++) {
          sec.addWidget(_buildEntityLable(master.configs[h][MASTER.ENTITIES][i][MASTER.DISPLAY_NAME],
            master.configs[h][MASTER.ENTITIES][i][MASTER.ICON_URL],
            master.configs[h][MASTER.ENTITIES][i][MASTER.NAME_SPACE]));
        }
      }
      else {
        var param = new Param();
        param.setValue("heading", master.configs[h][MASTER.HEADING]);
        param.addJSON("entities", master.configs[h][MASTER.ENTITIES]);
        param.setValue("icon", master.configs[h][MASTER.ICON_URL]);
        sec.addWidget(S6UIService.createActionLabel(master.configs[h][MASTER.HEADING], "Manage entity's folders and files", master.configs[h][MASTER.ICON_URL], actionEventSubEntities.name, param.toJSON()));
      }
      res.addSection(sec);
      sec = null;
    }
  }
  return res.build();
}

function buildtSubEntitiesView(param) {
  var res = S6UIService.createCard(param.getValue("heading"), "Manage entity's folders and files", param.getValue("icon"));
  var sec = S6UIService.createSection();
  var e = param.getJSON("entities");
  for (let i = 0; i < e.length; i++) {
    sec.addWidget(_buildEntityLable(e[i][MASTER.DISPLAY_NAME],
      e[i][MASTER.ICON_URL],
      e[i][MASTER.NAME_SPACE]));
  }
  res.addSection(sec);
  return res.build();
}

function _buildEntityLable(displayName, icon, nameSpace) {
  var res;
  var param = new Param();
  param.setNameSpace(nameSpace);

  res = S6UIService.createActionLabel(
    displayName,
    EMPTY,
    icon,
    actionEventEntity.name,
    param.toJSON());
  return res;
}


function buildMainEntityView(param) {
  var res;
  var nameSpace = param.getNameSpace();
  var entity = S6Entity.newFromNameSpace(nameSpace);

  //const entity = S6Entity.newFromNameSpace(S6Utility.getIdFromUrl(entities[ENTITY.CONFIG_URL]));
  const title = "Manage " + entity.config[ENTITY.NAME_PLURAL];
  //S6Context.log(title);
  const subtitle = `Folders and files drive content`;
  param.setValue(PARAM.URL, entity.config[ENTITY.ROOT_DIRECTORY_URL])
    ;
  const section = S6UIService.createSection();
  section.addWidget(S6UIService.createActionLabelOpen("Open " + entity.config[ENTITY.NAME_PLURAL] + " Drive", "Opens in a new tab", ICON_DRIVE_URL, actionEventOpenLink.name, param.toJSON()));

  if (entity.config[ENTITY.CAN_LIST] == YES) {
    if (entity.config[ENTITY.DETAIL_VIEW] == YES) {
      param.replaceValue(PARAM.VIEW_TYPE, ViewType.DETAIL);
    }
    else {
      param.replaceValue(PARAM.VIEW_TYPE, ViewType.LIST);
    }
    section.addWidget(S6UIService.createActionLabel("Find " + entity.config[ENTITY.NAME_SINGUAL],
      "List existsing " + entity.config[ENTITY.NAME_PLURAL], ICON_LIST_URL, actionEventList.name, param.toJSON()));
  }
  if (entity.config[ENTITY.CAN_CREATE] == YES) {
    param.setValue(PARAM.EDIT_TYPE, EditType.CREATE);
    section.addWidget(S6UIService.createActionLabel("New " + entity.config[ENTITY.NAME_SINGUAL], "New standard folders and files", ICON_CREATE_URL, actionEventEdit.name, param.toJSON()));
  }
  if (entity.config[ENTITY.UPDATEABLE] == YES) {
    param.replaceValue(PARAM.VIEW_TYPE, ViewType.UPDATE);
    section.addWidget(S6UIService.createActionLabel("Update " + entity.config[ENTITY.NAME_SINGUAL],
      "Update existsing " + entity.config[ENTITY.NAME_SINGUAL], ICON_CHANGE, actionEventList.name, param.toJSON()));
  }
  if (entity.config[ENTITY.TEMPLATES_SHEET] != "") {
    param.replaceValue(PARAM.VIEW_TYPE, ViewType.TEMPLATE);
    section.addWidget(S6UIService.createActionLabel("New Document or Folder", "Docs, Sheets, Slides from Templates and Folders", ICON_POST_ADD_URL, actionEventList.name, param.toJSON()));
  }


  section.addWidget(CardService.newDivider());

  var noAccess;
  if (entity.config[ENTITY.YOU_HAVE_ACCESS] == NO) {
    noAccess =
      S6UIService.createHelpSection
        (`<font color='${CANCEL_COLOUR}'>Edit Accees</font>`,
          "Create and update access", `<font color='${CANCEL_COLOUR}'>You do not have the permissions to create or update ${entity.config[ENTITY.NAME_PLURAL]}. This means you may also not be able to create documents and folders from templates.</font>`,
          false,
          ICON_LOCK_URL
        );
  }

  if (entity.config[ENTITY.OVERVIEW] != "" || entity.config[ENTITY.SOP_CONFLUENCE] != "") {
    section.addWidget(S6UIService.createIconLabel("<b>About " + entity.config[ENTITY.NAME_PLURAL] + "</b>", "", ICON_INFO_URL));
  }
  if (entity.config[ENTITY.OVERVIEW]) {
    section.addWidget(S6UIService.createParagraph(entity.config[ENTITY.OVERVIEW]));
  }
  try {
    if (entity.config[ENTITY.SOP_CONFLUENCE] != "") {
      let openParam = new Param();
      openParam.addValue(PARAM.URL, entity.config[ENTITY.SOP_CONFLUENCE]);
      section.addWidget(S6UIService.createActionLabelOpen("Confleunce documentation", "Standard operating procedure", ICON_ATLASSIAN_URL, actionEventOpenLink.name, openParam.toJSON()));
    }
  }
  catch (err) {
    S6Context.error(err);
  }

  var secSettings;
  //section.addWidget(S6UIService.createDivider());
  if (entity.config[ENTITY.CAN_GET_SETTINGS] == YES) {
    secSettings = S6UIService.createSection();
    secSettings.setCollapsible(true);
    secSettings.setNumUncollapsibleWidgets(1);
    let openParam = new Param();
    openParam.setValue("name", entity.config[ENTITY.NAME_PLURAL])
    openParam.setEntityConfigId(entity.config[ENTITY.CONFIG_ID]);
    openParam.addValue(PARAM.URL, entity.config[ENTITY.CONFIG_URL]);
    secSettings.addWidget(S6UIService.createIconLabel("Entity Settings", "Expend ▼ to access settings.", ICON_SETTINGS_URL));
    secSettings.addWidget(S6UIService.createActionLabelOpen("Settings", "Configuration for this entity (Cached)", ICON_GEAR_GREEN_URL, actionEventOpenLink.name, openParam.toJSON()));
    secSettings.addWidget(S6UIService.createActionLabel("Refresh Settings", "Discards the cache", ICON_REFRESH_URL, actionEventRefreshSettings.name, openParam.toJSON(), ICON_RETURN_URL));
  }

  res = S6UIService.createCard(title, subtitle, entity.config[ENTITY.ENTITY_ICON_URL], entity.config[ENTITY.NAME_SPACE])
  res.addSection(section);
  if (noAccess) {
    res.addSection(noAccess);
  }
  if (secSettings) {
    res.addSection(secSettings);
  }
  return res.build();
}

function buildRefreshSettingsView(param) {
  var id = param.getEntityConfigId();
  var name = param.getValue("name");

  var e = S6Entity.newFromConfigId(id, false);

  var nav = CardService.newNavigation()
    .popCard()

  var res = CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .setNotification(
      CardService.newNotification().setText(`Settings refreshed for ${name}`)
    )
  return res.build();
}

function buildOpenLinkView(param) {
  var res;
  S6Context.debug("ghost args:", ...arguments);
  var url = param.getValue(PARAM.URL);
  S6Context.debug("open url:", url);

  res = CardService.newUniversalActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink()
      .setOpenAs(CardService.OpenAs.FULL_SIZE)
      .setUrl(url))
    .build()
    ;
  return res;
}


/**
 * Build the UI to confirm the user really does want to create the new entity. 
 * @param {json} event - part of the Action API
 */
function buildConfirmCreateView(param) {
  var fields = param.getJSON(PARAM.FIELDS);
  var entity = S6Entity.newFromNameSpace(param.getNameSpace());

  var notification = S6UIService.validateFields(fields);
  if (notification != null) {
    return notification;
  }

  var vars = {
    createType: "",
    title: "unknown",
    hint: "unknown",
    icon: "unknown",
    butName: "unknown",
    toastMsg: ""
  }

  vars.createType = param.getValue(PARAM.CREATE_TYPE);
  //S6Context.log("CONFIRM:", fields);

  var sectionVariables = S6UIService.createSection();
  var sectionFolders = S6UIService.createSection();
  var map = S6Utility.mapCreateInstructions(entity, fields);

  //S6Context.log("Map:", map.size);

  let bePainet = "";
  if (map.size > 5) {
    let timeToCreate = (map.size * 1.4).toFixed(0);
    bePainet = `<br><br>This will take ~${timeToCreate} seconds. Please be patient  and do not click elsewhere on this tab.`;
  }
  if (vars.createType == EditType.UPDATE) {
    vars.title = "Update Drive Content for " + entity.config[ENTITY.NAME_SINGUAL];
    vars.hint = "From templates folders";
    vars.icon = ICON_CHANGE;
    vars.butName = "UPDATE";
    vars.toastMsg = "This folder to be updated.";
    sectionVariables.addWidget(S6UIService.createInfoLabel("Update existing " + entity.config[ENTITY.NAME_SINGUAL]));
    sectionFolders.addWidget(S6UIService.createInfoLabel(`Folders to be updated.${bePainet}`));
  }
  else if (vars.createType == EditType.CREATE) {
    vars.title = "New Drive Content for " + entity.config[ENTITY.NAME_SINGUAL];
    vars.hint = "From templates folders and files";
    vars.icon = ICON_CREATE_URL;
    vars.butName = "CREATE";
    vars.toastMsg = "This folder to be created.";
    sectionVariables.addWidget(S6UIService.createInfoLabel("Create new " + entity.config[ENTITY.NAME_SINGUAL]));
    sectionFolders.addWidget(S6UIService.createInfoLabel(`Folders to be created.${bePainet}`));
  }

  S6UIService.createFieldLabelsForSection(sectionVariables, fields);

  map.forEach((value, key) => {
    sectionFolders.addWidget(S6UIService.createIconLabel(key, "New Folder", ICON_FOLDER_URL));
    for (var i = 0; i < value.length; i++) {
      S6Context.debug("map(key,value)=>", key, value[i]);
      if (value != null) {
        var url = S6MasterTemplate.lookupUrl(value[i].url, fields);
        var doc = S6Utility.trim(value[i].fileName);
        S6Context.debug("value.url=>", url);
        S6Context.debug("value.fileName=>", doc);
        if (vars.createType == EditType.CREATE && doc != "") {
          sectionFolders.addWidget(S6UIService.createIconLabel(doc, "New File", S6Utility.getAppIconForTypeFromURL(url)));
        }
      }
    }
  });

  param.replaceJSON(PARAM.FIELDS, fields);
  //S6Context.log("CONFRIM:", vars);
  //S6Context.log("CONFRIM:", param.toJSON())

  var butCreate = S6UIService.createCreateButton(vars.butName, actionEventCreateEntity.name, param.toJSON());
  var butCancel = S6UIService.createCancelButton("CANCEL", "actionGoBack", param.toJSON());
  var fotter = S6UIService.createFooter(butCreate, butCancel);

  //S6Context.log("confirmCreate::End");
  var card = S6UIService.createCard(vars.title, vars.hint, vars.icon)
    .addSection(sectionVariables)
    .addSection(sectionFolders)
    .setDisplayStyle(CardService.DisplayStyle.REPLACE)
    .setFixedFooter(fotter)
    .build()
    ;

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .pushCard(card))
    .build()
    ;
}
/**
 * Allows the user to cancel the create, before they have commited to it. 
 * @param {json} event - part of the Action API
 */
function actionGoBack(event) {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .popCard())
    .build()
    ;
}
/**
 * Action to do.... well.... nothing.
 * When you need to define an action method. 
 * @param {json} event - part of the Action API
 */
function actionDoNothing(event) {
  // no op
}
/**
 * 
 */
function buildDetailView(param) {
  const entity = S6Entity.newFromNameSpace(param.getNameSpace());
  const res = S6UIService.createCard(entity.config[ENTITY.NAME_SINGUAL], "Details", entity.config[ENTITY.ENTITY_ICON_URL]);

  const instance = S6EntityInstance.newFromFolderId(param.getEntityInstanceId(), param.getNameSpace());
  const folder = instance.folder;//  DriveApp.getFolderById(param.getEntityInstanceId());

  if (instance.data[INSTANCE.IS_MANAGED] == NO) {
    return S6UIService.createNotification("This entity was not created by this tool, and so can not be viewed by this tool");
  }

  const fields = instance.data.fields;
  var sectionVariables = S6UIService.createSection();
  S6UIService.createFieldLabelsForSection(sectionVariables, fields);

  const vars = {
    path: EMPTY,
    logo: EMPTY,
    logoUrl: EMPTY,
    source: EMPTY
  }

  vars.path = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], entity.config[ENTITY.LOGO_FILE_NAME]);
  vars.logo = S6Utility.getFileFromRootFolderIdAndFromPath(entity.config[ENTITY.ROOT_DIRECTORY_ID], vars.path);

  if (vars.logo) {
    var logoid = S6Utility.getIdFromUrl(vars.logo.getUrl());
    vars.logoUrl = `https://drive.google.com/uc?export=view&id=${logoid}`;
    vars.source = "Image source:" + vars.path;
  }
  else {
    ;
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].type == DATA_TYPE_DOMAIN) {
        vars.logoUrl = "https://logo.clearbit.com/" + fields[i].value;
        vars.source = "Image source: scraped from the client's website using logo.clearbit.com.";
        break;
      }

    }
  }

  param.addJSON(PARAM.FIELDS, fields);

  if (entity.config[ENTITY.TEMPLATES]) {
    sectionVariables.addWidget(S6UIService.createDivider());
    sectionVariables.addWidget(S6UIService.createActionLabel("Create Folder or Document from Template", "For this " + entity.config[ENTITY.NAME_SINGUAL]
      , ICON_POST_ADD_URL, actionEventTemplateEditor.name, param.toJSON()));
  }
  if (entity.config[ENTITY.UPDATEABLE] == YES) {
    if (entity.config[ENTITY.TEMPLATES]) {
      sectionVariables.addWidget(S6UIService.createDivider());
    }
    param.setValue(PARAM.EDIT_TYPE, EditType.UPDATE);
    sectionVariables.addWidget(S6UIService.createActionLabel("Update " + entity.config[ENTITY.NAME_SINGUAL], "Change core attributes", ICON_CHANGE, actionEventEdit.name, param.toJSON()));
  }

  var subFolders = S6UIService.createSection();
  subFolders.addWidget(S6UIService.createInfoLabel("Folders (file count)"));

  var buttons = new Map();
  var iterator = folder.getFolders();
  while (iterator.hasNext()) {
    var next = iterator.next();
    var but = createButton_(next, true);
    buttons.set(but[0], but[1]);
  }

  var sortedMap = new Map([...buttons].sort());

  var but = createButton_(folder, false);
  subFolders.addWidget(but[1]);

  sortedMap.forEach((value, key) => {
    //S6Context.log(key);
    subFolders.addWidget(sortedMap.get(key));
  });

  if (vars.logoUrl != "") {
    var imageSection = S6UIService.createSection("Image");
    imageSection.addWidget(S6UIService.createImage(vars.logoUrl));
    imageSection.addWidget(S6UIService.createSmallLabel(vars.source));
    res.addSection(imageSection);
  }
  res.addSection(sectionVariables);
  res.addSection(subFolders);

  S6Context.debug(instance.data[INSTANCE.FIELDS]);
  S6Context.debug(entity.config[ENTITY.LOGO_FILE_NAME]);
  S6Context.debug(vars);
  return res.build();
}

function buildReviewSettingsView(param) {
  var res = S6UIService.createCard("Settings", "Customie the use of this Add On", ICON_SETTINGS_URL);

  var userProperties = PropertiesService.getUserProperties();
  var masterURL = userProperties.getProperty(USER_PROPERTY_MASTER_URL);

  var section = S6UIService.createSection("App Settings");
  section.addWidget(S6UIService.createLabel("<b>Release: </b>" + ADD_ON_RELEASE));
  section.addWidget(S6UIService.createLabel("<b>Meta Data Version: </b>" + ADD_ON_METADATA_VERSION_2));

  var userSection = S6UIService.createSection("Settings for " + S6Utility.getUsersDisplayName());
  userSection.addWidget(
    S6UIService.createTextParagraphInput("masterUrl", "Master Settings Spreadsheet URL", "This spreadsheet defines the entities you can manage with this Add On. Clear this field if you want to reset to the default spreadsheet. Or supply your own spreadsheet URL.", masterURL));

  userSection.addWidget(S6UIService.createLabel("<b>Your locale: </b>" + userProperties.getProperty(USER_PROPERTY_LOCALE)));

  var cacheSection = S6UIService.createSection("Cache Seetings");
  cacheSection.addWidget(S6UIService.createLabel("Cached  items : " + S6Cache.userCacheCount()));
  cacheSection.addWidget(S6UIService.createTextButton("Clear Cache", "#36454F", actionEventClearCache.name, {}));


  var aboutSection = S6UIService.createHelpSection("About changing these settings", "", `Once saved, the add-on needs to be refreshed for changes to the Settings to take effect.<br><br>Use either the <b>Refresh</b> option from the same menu you selected Settings, or refresh this browser tab.`, false);

  res.setFixedFooter(S6UIService.createFooter(S6UIService.createCreateButton("SAVE", actionEventSettingsSave.name, {}), S6UIService.createCancelButton("CANCEL", "actionGoBack", {})));
  res.addSection(section);
  res.addSection(userSection);
  res.addSection(cacheSection);
  res.addSection(aboutSection);
  return res.build();
}

function buildClearCacheView(param) {
  var res;
  var count = 0;
  var cacheName = EMPTY;
  if (S6Cache.userCacheCount() > 0) {
    count = S6Cache.userCacheClear();
    cacheName = "User";

  }
  else {
    count = S6Cache.globalCacheClear();
    cacheName = "Global";

  }
  res = S6UIService.createNotification(`${cacheName} cache cleared of ${count} items`);
  return res;
}

function buildEventSettingsSaveView(param) {
  var masterUrl = param.event.formInputs.masterUrl;
  var sheet;
  let url = "";

  if (S6Utility.trim(masterUrl) != "") {
    //S6Context.log("S6Utility.trim(masterUrl)", S6Utility.trim(masterUrl));
    try {
      if (!masterUrl + "".endsWith("/edit")) {
        masterUrl = masterUrl + "/edit";
      }
      sheet = SpreadsheetApp.openByUrl(masterUrl);
      url = sheet.getUrl();
    }
    catch (err) {
      S6Context.error(err);
    }
    if (!sheet) {
      return S6UIService.createNotification("The URL provided is not a valid spreadsheet. Seetings not changed.");
    }
  }
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(USER_PROPERTY_MASTER_URL, url);

  return S6UIService.createNotificationWithNavigation("Settings updated. Now Refresh this add-on.", CardService.newNavigation().popToRoot());
}


/**
 * Counts the number of files in a folder including its sub folders.
 * Folders are not included in the count of files.
 * @param {int} countTo - counting stops once this number is reached
 * @param {Foldeer} folder - folder to start counting in
 */

function countFilesInAllFolders(folder, countTo) {
  var res = 0;
  res = countFilesInThisFolder(folder, 0, countTo);
  var subFolders = folder.getFolders();
  while (res < countTo && subFolders.hasNext()) {
    res = countFilesInThisFolder(subFolders.next(), res, countTo);
  }
  return res;
}

function countFilesInThisFolder(folder, countFrom, countTo) {
  var res = countFrom;
  var files = folder.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    res++;
    if (res >= countTo) {
      break;
    }
  }
  return res;
}

function createButton_(folder, countSubFolders) {
  var res = [];
  var name = folder.getName();

  var count = 0;
  if (countSubFolders) {
    count = countFilesInAllFolders(folder, 10);
  }
  else {
    count = countFilesInThisFolder(folder, 0, 10);
  }
  var plus = count >= 10 ? "+" : EMPTY;
  var display = count > 0 ? `<b>${name} (${count}${plus})</b>` : `${name} (0)`;
  var param = new Param();
  param.setValue(PARAM.URL, folder.getUrl());
  S6Context.debugFn(createButton_, "OpenLink folder name/url", name, "/", folder.getUrl());
  var but = S6UIService.createActionLabelOpen(display, EMPTY, ICON_DRIVE_URL, actionEventOpenLink.name, param.toJSON());

  res[0] = name;
  res[1] = but;
  return res;
}


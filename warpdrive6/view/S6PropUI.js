/**
 * View for both applying propoerty values or building a template from propoerties. 
 */
const DOCUMENT_PROPERTY_NAME = "document.property";
const DOCUMENT_PROPERTY_NAME_STARTS_WITH_PARENTHESES = "{" + DOCUMENT_PROPERTY_NAME;
const DOCUMENT_PROPERTY_LINK = DOCUMENT_PROPERTY_NAME + ".link";

function buildPropertiesApplyView(param) {
  var task = param.getValue(PARAM.TASK_TYPE);
  S6Context.info("buildPropertiesApplyView")
  S6Context.debug("Task type", task);
  var config = TASK_CONFIG[TASK_VALUES][task];
  var id = param.getEntityInstanceId();
  var nameSpace = param.getNameSpace();

  //var res = S6UIService.createCard("Apply Propoerties", "Update docuyment fields with propoerties", ICON_SCATTER_URL);
  var res = S6UIService.createCard(config.title, config.hint, config.icon);

  var secHelp = S6UIService.createHelpSection(config.aboutToInfo, EMPTY, config.deepHelp, true);

  res.addSection(secHelp);

  var secRefresh = S6UIService.createSection();
  secRefresh.addWidget(S6UIService.createRefreshButton(param.toJSON()));
  res.addSection(secRefresh);

  var secInfo = S6UIService.createSection("Poperties Action");

  secInfo.addWidget(S6UIService.createInputForType("InsertType",
    "Select the type of action", config.pairedlist,
    "",
    "value",
    { selectionInputType: CardService.SelectionInputType.RADIO_BUTTON },
    "onChangeAction_InsertyType"));
  secInfo.addWidget(S6UIService.createIconLabel(`Select a single property to apply the action to. Or use the ACTION ALL button below to apply to all.`, EMPTY, ICON_DOUBLE_ARROW_LEFT));

  var i = 0;
  var paramProps = [];
  var props;
  var docSec;
  var helpDocP

  var text = CardService.newDecoratedText();
  text.setText("Highlight property");
  text.setBottomLabel("Property background to yellow.")
  var sw = CardService.newSwitch();
  sw.setControlType(CardService.SwitchControlType.SWITCH)
  sw.setFieldName("highlight_property_background");
  sw.setValue(YES);

  if (task === TASK_BUILD_TEMPLATE) {
    propInstance = S6PropertyService.newForBuild(nameSpace);
    props = propInstance.properties;

    sw.setSelected(true);
    text.setSwitchControl(sw);

    secInfo.addWidget(S6UIService.createDivider());
    secInfo.addWidget(text);

    var help =
      `Document properties are any text in a document surrounded by <b>{parenthises}</b> and does not include a <b>#</b>. For example, <b>{global#today}</b> is a global property available to all documents. While <b>{name}</b> is a document property specific to this document if you add it.

There are four types of document properties:

<b>{a string}</b> - a simple name or phrase that will prompt the user for a string to replace it with.<br>
<b>{a date}</b> - if the word "date" appears in the phrase, then the user is given a calendar control to help them find a valid date.<br>
<b>{list, of, values}</b> - a comma-separated list of values which will result in a drop-down list of the same values, from which the user can choose one from.<br> 
<b>{https://name}>/b> - a link that will be inserted with ythe given 'name'.`;

    helpDocP = S6UIService.createHelpSection("Creating Document Properties", EMPTY, help, true);

    var propText = S6PropertyServiceBuilder.propertyFactory(DOCUMENT_PROPERTY_NAME, PROPERTIES.TYPES.TEXT, "Document Property", "Name, date or list", YES, NO, PROPERTIES.AUTOMATIC, EMPTY, EMPTY, YES);
    var propLink = S6PropertyServiceBuilder.propertyFactory(DOCUMENT_PROPERTY_LINK, PROPERTIES.TYPES.TEXT, "https://Link Property", "Name for the URL link", YES, NO, PROPERTIES.AUTOMATIC, EMPTY, EMPTY, YES);
    docSec = S6UIService.createSection("Document Properties", ICON_EDIT_URL);

    paramProps[i++] = propText;
    param.replaceJSON(PARAM.FIELDS, [propText]);
    _createPropertyComponent(task, docSec, propText, actionEventPropertiesAction.name, param.toJSON(), true);

    paramProps[i++] = propLink;
    param.replaceJSON(PARAM.FIELDS, [propLink]);
    _createPropertyComponent(task, docSec, propLink, actionEventPropertiesAction.name, param.toJSON(), true);

  }
  else if (task === TASK_APPLY_PROPERTIES) {
    propInstance = S6PropertyService.newForApplyProperties(id, nameSpace);
    props = propInstance.properties;
    var docAdapter = S6DocumentAdapater.create(param.getDocumentId());
    var docProps = docAdapter.docProperties();
    var docPropsAuto = docProps[PROPERTIES.AUTOMATIC];
    var max = Object.keys(docPropsAuto).length;

    sw.setSelected(false);
    text.setSwitchControl(sw);

    secInfo.addWidget(S6UIService.createDivider());
    secInfo.addWidget(text);

    S6Context.debug("Number of automatic properties:", max, docPropsAuto, docPropsAuto.length);

    if (max > 0) {
      docSec = S6UIService.createSection("Document Properties", ICON_EDIT_URL);
      docSec.addWidget(S6UIService.createSmallLabel("Document properties allow you to enter the text for properties specific to the document."));

      for (item in docPropsAuto) {
        var apply = APPLY.TEXT;
        var type = PROPERTIES.TYPES.TEXT;
        var hint = `{${docPropsAuto[item]}} from this document`;
        if ((docPropsAuto[item]).startsWith("https://")) {
          type = PROPERTIES.TYPES.LINK;
          apply = APPLY.LINK;
          hint = `URL for {${docPropsAuto[item]}}`;
        }
        else if (S6Utility.containsWord(docPropsAuto[item], "date")) {
          type = PROPERTIES.TYPES.DATE_PRINTABLE;
        }
        else if (docPropsAuto[item].indexOf(",") > -1) {
          type = `${PROPERTIES.TYPES.INPUT_LIST}[${docPropsAuto[item]}]`;
        }
        var propText = S6PropertyServiceBuilder.propertyFactory(docPropsAuto[item], type, docPropsAuto[item], hint, YES, NO, PROPERTIES.AUTOMATIC, EMPTY, EMPTY, YES, EMPTY, apply);
        paramProps[i++] = propText;
        param.replaceJSON(PARAM.FIELDS, [propText]);

        _createPropertyComponent(task, docSec, propText, actionEventPropertiesAction.name, param.toJSON(), true);

      }
    }
  }
  res.addSection(secInfo);
  if (helpDocP) {
    res.addSection(helpDocP);
  }
  if (docSec) {
    res.addSection(docSec);
  }

  var propSec;
  var hasEntityProps = false;
  if (props.length > 0) {
    var master = S6Master.newMaster();
    var icon = master.getIconForNameSpace(nameSpace);
    propSec = S6UIService.createSection("Entity Properties", icon);
    propSec.addWidget(S6UIService.createSmallLabel("Predefined properties for the Entity."));
    globalSec = S6UIService.createSection("Global Properties", ICON_GLOBLE_URL);
    globalSec.addWidget(S6UIService.createSmallLabel("Global properties are common to all documents."));

    var addDiv;
    for (var k = 0; k < props.length; k++) {
      param.setValue(PARAM.PROPERTIES_INDEX, i);
      paramProps[i++] = props[k];
      param.replaceJSON(PARAM.FIELDS, [props[k]]);
      if (props[k][PROPERTIES.ATTR.PROP_NAME].indexOf("global#") > -1) {
        addDiv = _createPropertyComponent(task, globalSec, props[k], actionEventPropertiesAction.name, param.toJSON(), false, addDiv & props.length != k - 1);
      }
      else {
        S6Context.debug("Entity prop : ", props[k][PROPERTIES.ATTR.PROP_NAME]);
        hasEntityProps = true;
        addDiv = _createPropertyComponent(task, propSec, props[k], actionEventPropertiesAction.name, param.toJSON(), false, addDiv & props.length != k - 1)
      }
    }
    param.replaceJSON(PARAM.FIELDS, paramProps);
    param.setValue(PARAM.PROPERTIES_INDEX, -1);
    res.setFixedFooter(S6UIService.createFooter(S6UIService.createCreateButton("ACTION ALL", actionEventPropertiesAction.name, param.toJSON()), S6UIService.createCancelButton("BACK")));
  }


  if (propSec && hasEntityProps) {
    res.addSection(propSec);
  }
  if (globalSec) {
    res.addSection(globalSec);
  }
  return res.build();
}

function _createPropertyComponent(taskType, section, prop, functionName, json, auto = false, addDiv = false, param, allProps) {
  var res = false;
  var added = false;
  var dataType = S6UIService.canonicalType(prop[PROPERTIES.ATTR.TYPE]);
  var typeParams = S6UIService.typeParameters(prop[PROPERTIES.ATTR.TYPE]);

  if (auto) {
    S6Context.debugFn("auto _createPropertyComponent", prop);
    // automatic document properties 
    if (dataType == PROPERTIES.TYPES.DATE_PRINTABLE) {
      section.addWidget(S6UIService.createPropertyDateInput(prop, functionName, json));
      section.addWidget(S6UIService.createPropertyButton(prop, functionName, json));
    }
    else if (dataType == PROPERTIES.TYPES.INPUT_LIST) {
      section.addWidget(S6UIService.createInputList(prop[PROPERTIES.ATTR.PROP_ID], prop[PROPERTIES.ATTR.PROP_ID], EMPTY, typeParams, EMPTY));
      section.addWidget(S6UIService.createPropertyButton(prop, functionName, json));
    }
    else {
      section.addWidget(S6UIService.createPropertyInput(prop, functionName, json));
      section.addWidget(S6UIService.createPropertyButton(prop, functionName, json));
    }
    added = true;
  }
  else {
    // entity and global propoerties 
    S6Context.debug("Create component for:", prop, dataType, taskType);
    if (dataType == PROPERTIES.TYPES.SELECTOR) {
      if (taskType == TASK_APPLY_PROPERTIES) {
        section.addWidget(S6UIService.createDivider());
        section.addWidget(S6UIService.createLabel(`Choose the <b>${prop[PROPERTIES.ATTR.SELECTOR_DISPLAY]}</b> to populte the related properties (below).`));
        section.addWidget(S6UIService.createPropertySelector(prop));
        res = true;
      }
      added = true;
    }
    else if (dataType == PROPERTIES.TYPES.SELECTED) {
      section.addWidget(S6UIService.createPropertySelected(prop, functionName, json));
      res = true;
      added = true;
    }

    if (taskType == TASK_APPLY_PROPERTIES && addDiv && !res) {
      section.addWidget(S6UIService.createDivider());
    }

    if (!added) {
      if (dataType == PROPERTIES.TYPES.ENTITY_LOGO || dataType == PROPERTIES.TYPES.IMAGE_LINK) {
        var value = prop[PROPERTIES.ATTR.VALUE];
        if (value != EMPTY) {
          section.addWidget(S6UIService.createImage(value));
        }
        section.addWidget(S6UIService.createPropertyButton(prop, functionName, json));
      }
      else if (dataType == PROPERTIES.TYPES.INFO) {
        S6Context.debug("dataType:", dataType, prop[PROPERTIES.ATTR.TITLE]);

        var text = S6UIService._createDecoratedText(prop[PROPERTIES.ATTR.TITLE]);
        text.setStartIcon(makeIcon(ICON_INFO_URL));
        section.addWidget(text);
      }
      else if (dataType == PROPERTIES.TYPES.NOT_FOUND) {
        var text = S6UIService._createDecoratedText(prop[PROPERTIES.ATTR.TITLE]);
        text.setStartIcon(makeIcon(ICON_WARNING_URL));
        text.setTopLabel(prop[PROPERTIES.ATTR.PROP_NAME]);
        section.addWidget(text);
      }
      else if (dataType == PROPERTIES.TYPES.PAIREDLIST) {
        var list = S6UIService.typeParameters(prop[PROPERTIES.ATTR.TYPE]);
        var text = `🔽 ${prop[PROPERTIES.ATTR.TITLE]}`;
        var comp = S6UIService._createPairedListDropdown(text, EMPTY, list, "New Zealand");
        comp.setFieldName(prop[PROPERTIES.ATTR.PROP_NAME]);
        section.addWidget(comp);
        section.addWidget(S6UIService.createPropertyButton(prop, functionName, json));
      }
      else {
        section.addWidget(S6UIService.createPropertyLabel(prop, functionName, json));
      }
    }
  }

  return res;
}


function buildApplyPropertiesActionView(param) {
  var res;
  var docId = param.getDocumentId();
  var adapt = S6DocumentAdapater.create(docId);
  var factory = PropertyApplyFactory.create(param.event, adapt);

  var highlight = param.event.formInputs["highlight_property_background"];
  var color = null;
  if (highlight && highlight.toString() == YES) {
    color = "#ffff00";
  }
  S6Context.debug("highlight_property_background", color);

  var props = param.getJSON(PARAM.FIELDS);
  // iterate in reverse to ensure they appear the same way they are displayed to the user 
  S6Context.time("Apply Properties: " + props.length);
  let applied = 0;
  var actionType = PropertyApplyFactory.actionType(param.event);




  let build = (actionType == PROP_ACTION_INSERT_FIELD || actionType == PROP_ACTION_INSERT_TITLE_FIELD);
  breakme: if (build) {
    for (var i = props.length - 1; i > -1; i--) {

      var title = props[i][PROPERTIES.ATTR.TITLE];
      var name = props[i][PROPERTIES.ATTR.PROP_NAME];

      if (name.includes(DOCUMENT_PROPERTY_NAME)) {
        if (name.includes(DOCUMENT_PROPERTY_LINK)) {
          if (props[i][PROPERTIES.ATTR.VALUE] != EMPTY) {
            name = `{https://${props[i][PROPERTIES.ATTR.VALUE]}}`;
          }
          else {
            break breakme;
          }
        }
        else {
          name = `{${props[i][PROPERTIES.ATTR.VALUE]}}`;
        }
      }

      S6Context.debug("Apply, name", name, ". title:", title, ". Prop Name:", props[i][PROPERTIES.ATTR.PROP_NAME]);
      if (props[i][PROPERTIES.ATTR.TYPE] != PROPERTIES.TYPES.SELECTOR) {
        S6Context.time("Build property:" + name);
        factory
          .apply(title, props[i][PROPERTIES.ATTR.VALUE], name, props[i][PROPERTIES.ATTR.APPLY], color, props.length > 1);
        S6Context.timeEnd("Build property:" + name);
      }
      applied++;
    }
  }
  else {
    for (var i = props.length - 1; i > -1; i--) {
      S6Context.debug("Apply:", props[i]);

      if (props[i][PROPERTIES.ATTR.VALUE] != EMPTY || props[i][PROPERTIES.ATTR.EMPTY_MEANS_EMPTY] == YES) {
        var type = props[i][PROPERTIES.ATTR.TYPE];
        if (type == PROPERTIES.TYPES.LINK) {
          var url = props[i][PROPERTIES.ATTR.VALUE];
          var split = props[i][PROPERTIES.ATTR.TITLE].split("/");
          var text = split[split.length - 1];
          props[i][PROPERTIES.ATTR.VALUE] = `${text}|${url}`;
          S6Context.debug("LINK:", props[i][PROPERTIES.ATTR.VALUE]);
        }
        //
        if (props[i][PROPERTIES.ATTR.TYPE] != PROPERTIES.TYPES.SELECTOR) {
          S6Context.time("Apply property:" + props[i][PROPERTIES.ATTR.PROP_NAME]);
          factory
            .apply(props[i][PROPERTIES.ATTR.TITLE], props[i][PROPERTIES.ATTR.VALUE], props[i][PROPERTIES.ATTR.PROP_NAME], props[i][PROPERTIES.ATTR.APPLY], color, props.length > 1);
          S6Context.timeEnd("Apply property:" + props[i][PROPERTIES.ATTR.PROP_NAME]);
        }
        applied++;
      }
    }
  }
  S6Context.timeEnd("Apply Properties: " + props.length);


  if (props.length == 1 && applied == 1) {
    res = S6UIService.createNotification(`[${props[0][PROPERTIES.ATTR.TITLE]}] property applied`);
  }
  else {
    if (props.length == 1 && applied == 0) {
      res = S6UIService.createNotification(`${props[0][PROPERTIES.ATTR.TITLE]} property NOT applied becuase it was empty.`);
    }
    else if (applied == props.length) {
      res = S6UIService.createNotification(`${applied} properties applied.`);
    }
    else if (applied < props.length) {
      res = S6UIService.createNotification(`${applied} properties applied and ${props.length - applied} skiped becuase they were empty.`);
    }
  }

  return res;
}



function onChangeAction_InsertyType(event) {
  var type = S6Utility.trim(event.formInputs["InsertType"].toString());

  var res;
  switch (type) {
    case PROP_ACTION_INSERT_VALUE:
      res = S6UIService.createNotification("Values to be inserted.");
      break;
    case PROP_ACTION_INSERT_TITLE_VALUE:
      res = S6UIService.createNotification("Title:Values to be inserted.");
      break;
    case PROP_ACTION_INSERT_FIELD:
      res = S6UIService.createNotification("Property Name to be inserted. Use this to build a template.");
      break;
    case PROP_ACTION_INSERT_TITLE_FIELD:
      res = S6UIService.createNotification("Title:Property Name to be inserted. Use this to build a template.");
      break;
    case PROP_ACTION_REPLACE_VALUE:
      res = S6UIService.createNotification("Find and repalce the properties' name with their value.");
      break;
    case PROP_ACTION_REPLACE_TITLE_VALUE:
      res = S6UIService.createNotification("Find and repalce the properties' name with their title:value.");
      break;
    default:
      res = S6UIService.createNotification("Unknwon action type:" + type);
      break;
  }

  return res;
}
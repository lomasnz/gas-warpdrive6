const ENTITY = {
  NAME_SPACE: "NAME_SPACE",
  NAME_PLURAL: "NAME_PLURAL",
  DISPLAY_NAME: "NAME_SPACE",
  NAME_SINGUAL: "NAME_SINGUAL",
  ROOT_DIRECTORY_URL: "ROOT_DIRECTORY",
  ROOT_DIRECTORY_ID: "ROOT_DIRECTORY_ID",
  OVERVIEW: 'OVERVIEW',
  ENTITY_ICON_URL: 'ENTITY_ICON_URL',
  ENTITY_DIRECTORY: 'ENTITY_DIRECTORY',
  CAN_CREATE: 'CAN_CREATE',
  CAN_LIST: 'CAN_LIST',
  CAN_GET_SETTINGS: 'CAN_GET_SETTINGS',
  IGNORE_LIST: "IGNORE_LIST",
  LIST_DATATYPE: "LIST_DATATYPE",
  LIST_SORT_BY: "LIST_SORT_BY",
  LIST_SORT_BY_TYPE: "LIST_SORT_BY_TYPE",
  LIST_GROUP_BY: "LIST_GROUP_BY",
  LIST_GROUP_BY_TITLE: "LIST_GROUP_BY_TITLE",
  LIST_GROUP_BY_TYPE: "LIST_GROUP_BY_TYPE",
  SOP_CONFLUENCE: "SOP_CONFLUENCE",
  LIST_DESCRIPTION: "LIST_DESCRIPTION",
  DETAIL_HEADING: "DETAIL_HEADING",
  LOGO_FILE_NAME: "LOGO_FILE_NAME",
  DETAIL_VIEW: "DETAIL_VIEW",
  TEMPLATES_SHEET: "TEMPLATES_SHEET",
  FIELDS_SHEET: "FILEDS_SHEET",
  FOLDERS_SHEET: "FOLDERS_SHEET",
  UPDATEABLE: "UPDATEABLE",
  CONFIG_URL: "CONFIG_URL",
  CONFIG_ID: "CONFIG_ID",
  LIST_DEPTH: "LIST_DEPTH",
  PROPERTIES_FILE_NAME: "PROPERTIES_FILE_NAME",
  TEMPLATES: "TEMPLATES",
  YOU_HAVE_ACCESS: "youHaveAcces",
  TEMPLATE_ATTR: {
    ID: "id",
    HEADING: "heading",
    DESC: "desc",
    FILE_NAME: "fileName",
    URL: "url",
    IS_FOLDER: "isFolder",
    FIELDS: "fields",
    TEMPLATES: "templates",
    HAS_FIELDS: "hasFields"
  },
  FIELDS: "fields",
  FIELD_ATTR: {
    FIELD_NAME: "field",
    TITLE: "title",
    TYPE: "type",
    HINT: "hint",
    MANDATORY: "mandatory",
    UPDATEABLE: "updateable",
    ROOT_FIELD: "rootField",
    VALUE: "value",
    VALUE_FROM_FOLDER_NAME: "valueFromFolderName",
    EDITABLE: "editable"

  },

  FOLDERS: "FOLDERS",
  FOLDER: {
    FOLDER_NAME: "folder",
    OLD_FOLDER: "oldFolder",
    DOCS: "docs",
    DOC: {
      FILE_NAME: "fileName",
      URL: "url"
    }
  }

}

const ENTITY_DEPRECATED_ENTITY = "ENTITY";

/**
 * When initailsed by a factory method (do not use the constructor) the object from this class contains the configuration for a given entity according to its configuration/settings spreadsheet.
 * Use the S6Enity.new...() static factory methods to construct and populate a new instance.
 *  
 * The config property contains all of the spreadsheeet settings as a Json graph. The const {ENTITY} Json object acts as an Enum to help with referencing theese properties.
 * For example, where **entity** is an instance of S6Entity.
 *  entity.config[ENTITY.NAME_SPACE] is same as entity.config.NAME_SPACE or entity.config["NAME_SPACE"], but the first example less error prone. 
 * 
 * An S6Entity instance, its propertes, and the properties of the config Json are all frozen. Making them imutable. If you do attempt to change the object or a propertuy of the config Json it will fail silently (no change will be made, but no error will be thrown or recorded). 
 * 
 * If you need a mutable copy of the config json use the cloneConfig() function. This will provide a by value deep clone copy which you can modify wiothout modifying the orginal config.  
 *  
 * 
 */
class S6Entity {

  /**
   * Private constructor. Not to be used directly.
   */
  constructor(json, secret) {
    if (secret != "#PRIVATE") {
      throw "Use the factory functions starting with new...(). Do not construct your own S6Entity";
    }
    this.config = json;
    this.configId = json[ENTITY.CONFIG_ID];
    this.entityNameSpace = json[ENTITY.NAME_SPACE];
    Object.freeze(this.config);
    Object.freeze(this);
  }

  /**
   * Returns a mutable deep clone by value copy of the config Json. 
   */
  cloneConfig() {
    return _.cloneDeep(this.config);
  }

  templateFromId(id) {
    var res = null;
    loop:
    for (var k in this.config[ENTITY.TEMPLATES]) {
      for (var j in this.config[ENTITY.TEMPLATES][k][ENTITY.TEMPLATES]) {
        if (this.config[ENTITY.TEMPLATES][k][ENTITY.TEMPLATES][j][ENTITY.TEMPLATE_ATTR.ID] == id) {
          res = this.config[ENTITY.TEMPLATES][k][ENTITY.TEMPLATES][j];
          break loop;
        }
      }
    }
    return res;
  }

  clonedUpdateFolders(fields) {
    var res = _.cloneDeep(this.config[ENTITY.FOLDERS]);
    ////console.log(res);
    for (var folder in res) {
      ////console.log(res[folder][ENTITY.FOLDER.FOLDER_NAME]);
      for (var field in fields) {
        res[folder][ENTITY.FOLDER.FOLDER_NAME] = res[folder][ENTITY.FOLDER.FOLDER_NAME].replaceAll(fields[field][ENTITY.FIELD_ATTR.FIELD_NAME], fields[field][ENTITY.FIELD_ATTR.VALUE]);
        var docs = res[folder][ENTITY.FOLDER.DOCS];
        for (var doc in docs) {
          docs[doc][ENTITY.FOLDER.DOC.FILE_NAME] = docs[doc][ENTITY.FOLDER.DOC.FILE_NAME].replaceAll(fields[field][ENTITY.FIELD_ATTR.FIELD_NAME], fields[field][ENTITY.FIELD_ATTR.VALUE]);
        }
      }
    }
    return res;
  }

  clonedUpdateTemplates(fields) {
    var res = _.cloneDeep(this.config[ENTITY.TEMPLATES]);

    for (var tH in res) {
      ////console.log(res[folder][ENTITY.FOLDER.FOLDER_NAME]);
      for (var field in fields) {
        ////console.log("next field:",fields[field][ENTITY.FIELD.FIELD_NAME]);

        res[tH][ENTITY.TEMPLATE_ATTR.HEADING] = res[tH][ENTITY.TEMPLATE_ATTR.HEADING].replaceAll(fields[field][ENTITY.FIELD_ATTR.FIELD_NAME], fields[field][ENTITY.FIELD_ATTR.VALUE]);
        var templates = res[tH][ENTITY.TEMPLATES];
        for (var t in templates) {
          ////console.log("next template:",templates[t]);

          //templates[t][ENTITY.TEMPLATE_ATTR.FILE_NAME] = templates[t][ENTITY.TEMPLATE_ATTR.FILE_NAME].replaceAll(fields[field][ENTITY.FIELD_ATTR.FIELD_NAME], fields[field][ENTITY.FIELD_ATTR.VALUE]);
          var templatesFields = templates[t][ENTITY.TEMPLATE_ATTR.FIELDS];
          ////console.log("templatefields:",templatesFields);

          for (var f in templatesFields) {
            if (templatesFields[f][ENTITY.FIELD_ATTR.FIELD_NAME] == fields[field][ENTITY.FIELD_ATTR.FIELD_NAME]) {
              templatesFields[f][ENTITY.FIELD_ATTR.TYPE] =
                templatesFields[f][ENTITY.FIELD_ATTR.TYPE].replaceAll(fields[field][ENTITY.FIELD_ATTR.FIELD_NAME], fields[field][ENTITY.FIELD_ATTR.VALUE]);
              templatesFields[f][ENTITY.FIELD_ATTR.VALUE] = fields[field][ENTITY.FIELD_ATTR.VALUE];
              break;
            }
          }
        }
      }
      S6Context.debugFn("clonedUpdateTemplates",JSON.stringify(res[tH]));
    }
    return res;
  }

  listItemDisplay(fields, listText) {
    var res = EMPTY;
    // let json = S6Utility.getMetaDataFromFolder(folder);
    if (fields) {
      res = S6Utility.replaceFieldInText(fields, listText);
    }
    // else {
    //   S6Context.debug("listItemDisplay, use entity fields for:", folder.getName())
    //   json = _.cloneDeep(this.config);
    //   json = S6Utility.updateMetaData(json,folder);
    //   res = S6Utility.replaceFieldInText(json, listText);
    // }
    return res;
  }

  static newFromNameSpace(nameSpace, cache = true) {
    S6Context.debugFn(S6Entity.newFromNameSpace.name, nameSpace, cache);
    S6Context.time(S6Entity._cacheName(nameSpace));
    S6Validate.mandatoryType("nameSpace", nameSpace, DataType.STRING);
    var res;
    var json;
    if (cache) {
      json = S6Cache.userCacheGetJson(S6Entity._cacheName(nameSpace));
    }
    if (json) {
      res = new S6Entity(json, "#PRIVATE");
    }
    else {
      var master = S6Master.newMaster(EMPTY, cache);
      var e = master.getEntityForNameSpace(nameSpace);
      var id = e[MASTER.CONFIG_ID];
      res = S6Entity.newFromConfigId(id, cache); // this method will cache the item if created.
    }
    S6Context.timeEnd(S6Entity._cacheName(nameSpace));
    return res;
  }

  static _cacheName(name) {
    return "S6Entity:" + name;
  }

  // static methods are factory functions 
  /**
   * Use this factory method to create a new S6Entity
   * @param {string} id - the Google Drive ID for the entity - to the spreadsheet where the configuration is recorded.
   * @param {bool} cache - optional, defaults to true. When true the cache for the result will be used. This parameter is only expected to be used during testing. 
   * Caching reduce the contruct tine from aprox. 1.2 seconds to 0.2 secods. 
   * @return {S6Entity} - a new entity for the given id.
   */
  static newFromConfigId(id, cache = true) {
    S6Validate.mandatoryType("id", id, DataType.STRING);
    S6Context.time(S6Entity._cacheName(id));
    var res;
    var json
    if (cache) {
      json = S6Cache.userCacheGetJson(S6Entity._cacheName(id));
      if (json) {
        res = new S6Entity(json, "#PRIVATE");
      }
    }
    if (!res) {
      try {
        var spreadsheet = SpreadsheetApp.openById(id);
        json = S6Entity._createConfigGraph(spreadsheet, id);
        if (json) {
          S6Cache.userCachePutJson(S6Entity._cacheName(id), json);
          S6Cache.userCachePutJson(S6Entity._cacheName(json[ENTITY.NAME_SPACE]), json);
          res = new S6Entity(json, "#PRIVATE");
        }
      }
      catch (err) {
        S6Context.error(err);
        S6Context.error(err.stack);
        throw new Error(`Unable to create Entity from Spreadsheet with id ${id}`);
      }
    }
    S6Context.timeEnd(S6Entity._cacheName(id));
    return res;
  }

  /**
   * Use this factory method to create a new S6Entity
   * @param {string} url - the Google Drive url for the entity - to the spreadsheet where the configuration is recorded.
   * @param {bool} cache - optional, defaults to true. When true the cache for the result will be used. This parameter is only expected to be used during testing. 
   * Caching reduce the contruct tine from aprox. 1.2 seconds to 0.2 secods. 
   * @return {S6Entity} - a new entity for the given url.
   */
  static newFromConfigUrl(url, cache = true) {
    return S6Entity.newFromConfigId(S6Utility.getIdFromUrl(url), cache);
  }
  /**
   * Private fctory function. Do not use outside of this class.
   * Used to create the graph of json values.
   * @param {Spreadsheet} spreadsheet - contains entity configuration.
   * @return {JSON} - json of configuration.
   */
  static _createConfigGraph(spreadsheet, currentConfigId) {
    var res = {};

    var master = S6Master.newMaster();
    var m = master.getEntityForAnyConfigId(currentConfigId);
    S6Context.debug("_createConfigGraph(", spreadsheet.getName(), ")");


    // Root
    //S6Context.time("Build Entity:Root:" + currentConfigId);
    var rootValues = S6Entity._sheetValues(spreadsheet, "Root", "A:B");
    res = S6Entity._root(spreadsheet, rootValues);
    res[ENTITY.ICON_URL] = m[MASTER.ICON_URL];
    res[ENTITY.ENTITY_ICON_URL] = m[MASTER.ICON_URL];
    //S6Context.timeEnd("Build Entity:Root:" + currentConfigId);

    // Fields
    //S6Context.time("Build Entity:Fields:" + currentConfigId);
    var fieldValues = S6Entity._sheetValues(spreadsheet, res[ENTITY.FIELDS_SHEET], "A:G");
    var from_fields = S6Entity._fields(fieldValues, true, res[ENTITY.LIST_GROUP_BY], res[ENTITY.NAME_SPACE]);
    res[ENTITY.FIELDS] = from_fields[0];
    res[ENTITY.UPDATEABLE] = from_fields[1];
    res[ENTITY.LIST_GROUP_BY_TITLE] = S6Utility.trim(from_fields[2]);
    res[ENTITY.LIST_GROUP_BY_TYPE] = S6Utility.trim(from_fields[3]);

    if (S6Utility.trim(res[ENTITY.LIST_SORT_BY]) == EMPTY) {
      S6Context.debugFn("_createConfigGraph", res[ENTITY.FIELDS][0]);
      res[ENTITY.LIST_SORT_BY] = res[ENTITY.FIELDS][0][ENTITY.FIELD_ATTR.FIELD_NAME];
      res[ENTITY.LIST_SORT_BY_TYPE] = DATA_TYPE_TEXT;
      S6Context.debugFn("_createConfigGraph:", res[ENTITY.LIST_SORT_BY]);
    }

    res[ENTITY.NAME_SPACE] = m[MASTER.NAME_SPACE];

    //S6Context.timeEnd("Build Entity:Fields:" + currentConfigId);

    // Folders
    //S6Context.time("Build Entity:Folders:" + currentConfigId);
    var folderValues = S6Entity._sheetValues(spreadsheet, res[ENTITY.FOLDERS_SHEET], "A:C");
    res[ENTITY.FOLDERS] = S6Entity._folders(spreadsheet, folderValues);
    //S6Context.timeEnd("Build Entity:Folders:" + currentConfigId);
    //console.log(res);
    // Temmplates 

    if (res[ENTITY.TEMPLATES_SHEET] != EMPTY) {
      var templateValues = S6Entity._sheetValues(spreadsheet, res[ENTITY.TEMPLATES_SHEET], "A:D");
      res[ENTITY.TEMPLATES] = S6Entity._templates(spreadsheet, templateValues, res[ENTITY.FIELDS], res[ENTITY.NAME_SPACE]);
    }

    if (S6Utility.hasEditAccess(res[ENTITY.ROOT_DIRECTORY_ID]) == NO) {
      res[ENTITY.YOU_HAVE_ACCESS] = NO;
      res[ENTITY.CAN_CREATE] = NO;
      res[ENTITY.UPDATEABLE] = NO;
    }
    else {
      res[ENTITY.YOU_HAVE_ACCESS] = YES;
    }

    return res;
  }

  /**
    * Private fctory function. Do not use outside of this class.
    * Creates the part of the graph from the Root sheet. 
    */
  static _root(spreadsheet, values) {
    var res = {};
    // skip first row
    for (let k = 1; k < values.length; k++) {
      var value = S6Utility.trim(values[k][0]);
      if (value != EMPTY) { // skip rows where the first cell is empty 
        res[value] = S6Utility.trim(values[k][1]);
      }
    }
    // defaults 
    if (S6Utility.trim(res[ENTITY.FIELDS_SHEET]) == EMPTY) {
      res[ENTITY.FIELDS_SHEET] = "Fields";
    }
    if (S6Utility.trim(res[ENTITY.FOLDERS_SHEET]) == EMPTY) {
      res[ENTITY.FOLDERS_SHEET] = "Folders";
    }
    if (S6Utility.trim(res[ENTITY.TEMPLATES_SHEET]) == EMPTY) {
      res[ENTITY.TEMPLATES_SHEET] = EMPTY;
    }
    if (S6Utility.trim(res[ENTITY.NAME_SINGUAL]) == EMPTY) {
      res[ENTITY.NAME_SINGUAL] = res[[ENTITY_DEPRECATED_ENTITY]];
    }
    if (S6Utility.trim(res[ENTITY.NAME_PLURAL]) == EMPTY) {
      res[ENTITY.NAME_PLURAL] = res[[ENTITY_DEPRECATED_ENTITY]];
    }
    if (S6Utility.trim(res[ENTITY.SOP_CONFLUENCE]) == EMPTY) {
      res[ENTITY.SOP_CONFLUENCE] = EMPTY;
    }
    if (S6Utility.trim(res[ENTITY.LIST_GROUP_BY]) == EMPTY) {
      res[ENTITY.LIST_GROUP_BY] = EMPTY;
    }


    if (S6Utility.trim(res[ENTITY.LIST_DEPTH]) == EMPTY) {
      res[ENTITY.LIST_DEPTH] = 0;
    }
    else {
      res[ENTITY.LIST_DEPTH] = parseInt(res[ENTITY.LIST_DEPTH]);
    };

    res[ENTITY.LIST_GROUP_BY_TITLE] = EMPTY;

    res[ENTITY.ROOT_DIRECTORY_ID] = S6Utility.getIdFromUrl(res[ENTITY.ROOT_DIRECTORY_URL]);
    res[ENTITY.CONFIG_ID] = spreadsheet.getId();
    res[ENTITY.CONFIG_URL] = spreadsheet.getUrl();

    return res;
  }

  /**
    * Private fctory function. Do not use outside of this class.
    * Helper method to get the range of values from the spreadheet for a given sheet. 
    */
  static _sheetValues(spreadsheet, sheetName, range) {
    var res;
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (sheet == null) {
      throw new Error(`Spreadsheet does not contain a sheet named [${sheetName}]`);
    }
    else {
      res = sheet.getRange(range).getValues();
    }
    return res;
  }

  /**
    * Private fctory function. Do not use outside of this class.
    * Creates the part of the graph from the Fields sheet. 
    */
  static _fields(values, isRoot = NO, groupBy = EMPTY, nameSpace = EMPTY, entityFields = true) {
    var res = [];
    var isUpdateble = NO;
    var groupByTitle = EMPTY;
    var groupBySort = DATA_TYPE_TEXT;
    let folderFieldIdentified = false;
    let x = 0;
    for (var i = 1; i < values.length; i++) {
      var field = S6Utility.trim(values[i][0]);
      if (field != EMPTY) {
        var title = S6Utility.trim(values[i][1]);
        var type = S6Utility.trim(values[i][2]);
        var hint = S6Utility.trim(values[i][3]);
        var mandatory = S6Utility.trim(values[i][4]);
        var updateable = S6Utility.trim(values[i][5]);
        var valueFromFolderName = S6Utility.trim(values[i][6]);

        if (isUpdateble == NO && updateable == YES) {
          isUpdateble = YES;
        }
        if (valueFromFolderName == EMPTY) {
          valueFromFolderName = META_DATA.NOT_VALUE_FROM_FOLDER;
        }
        else if (folderFieldIdentified && valueFromFolderName != NO) {
          folderFieldIdentified = true;
        }
        if (field == groupBy) {
          groupByTitle = title;
          groupBySort = type == DATA_TYPE_DATE ? DATA_TYPE_DATE : DATA_TYPE_TEXT;
        }

        res[x++] = S6Entity.fieldFactory(field, title, type, hint, EMPTY, mandatory, updateable, valueFromFolderName, isRoot);
        S6Context.trace(res[x - 1]);
      }
    }
    if (entityFields && !folderFieldIdentified) {
      // one field must be the value of the folder so we will get the first field 
      S6Context.warn("S6Entity:", nameSpace, ". No field identifed as the folder value field, guessing it is: ", res[0][ENTITY.FIELD_ATTR.FIELD_NAME]);
      res[0][ENTITY.FIELD_ATTR.VALUE_FROM_FOLDER_NAME] = YES;
    }
    return [res, isUpdateble, groupByTitle, groupBySort];
  }

  static fieldFactory(field, title, type, hint, value = EMPTY, mandatory = NO, updateable = YES, valueFromFolderName = META_DATA.NOT_VALUE_FROM_FOLDER, isRoot = NO, isEditable = isRoot) {
    return {
      [ENTITY.FIELD_ATTR.FIELD_NAME]: field,
      [ENTITY.FIELD_ATTR.TITLE]: title,
      [ENTITY.FIELD_ATTR.TYPE]: type,
      [ENTITY.FIELD_ATTR.HINT]: hint,
      [ENTITY.FIELD_ATTR.MANDATORY]: mandatory,
      [ENTITY.FIELD_ATTR.UPDATEABLE]: updateable,
      [ENTITY.FIELD_ATTR.ROOT_FIELD]: isRoot ? YES : NO,
      [ENTITY.FIELD_ATTR.VALUE]: value, // unknown 
      [ENTITY.FIELD_ATTR.EDITABLE]: isEditable,
      [ENTITY.FIELD_ATTR.VALUE_FROM_FOLDER_NAME]: valueFromFolderName
    }
  };

  /**
    * Private fctory function. Do not use outside of this class.
    * Creates the part of the graph from the Folders sheet. 
    */
  static _folders(spreadSheet, values) {
    var res = [];
    var masterTemplate = S6MasterTemplate.new();
    var x = 0;
    // skip row 1 with headers 
    if (values.length > 2) {
      for (var i = 1; i < values.length; i++) {
        var folder = S6Utility.trim(values[i][0]);
        var oldFolder = S6Utility.trim(values[i][2]);
        // make sure the coulum is not empty
        if (folder != EMPTY) {
          //var docs = [{ fileName: EMPTY, url: EMPTY }];
          var docs = [];
          var y = 0;
          res[x++] = { [ENTITY.FOLDER.FOLDER_NAME]: folder, [ENTITY.FOLDER.OLD_FOLDER]: oldFolder, [ENTITY.FOLDER.DOCS]: [] };
          var docsSheet = values[i][1];
          if (docsSheet != EMPTY) {
            var sheet = spreadSheet.getSheetByName(docsSheet);

            if (sheet != null) {
              //console.info("Looking for documents for Folder :", folder, ", in Sheet: [", docsSheet, "]");
              var documentRange = sheet.getRange("A:B");
              var documentValues = documentRange.getValues();
              //docs[0] = { "fileName": EMPTY, "url": EMPTY };
              for (var j = 1; j < documentValues.length; j++) {
                if (documentValues[j][0] != EMPTY) {
                  var fileName = S6Utility.trim(documentValues[j][0]);
                  //var fileName = S6Utility.evaluateCell(sheet, "A" + (j + 1));
                  // // for some reason if there is no formula the cell.getValue() does not return the value.
                  // if (fileName == EMPTY) {
                  //   fileName = S6Utility.trim(documentValues[j][0]);
                  // }

                  var urlDoc = documentValues[j][1];
                  //urlDoc = masterTemplate.lookupUrl(urlDoc);
                  if (fileName != EMPTY && urlDoc != EMPTY) {
                    res[x - 1][ENTITY.FOLDER.DOCS][y++] = {
                      [ENTITY.FOLDER.DOC.FILE_NAME]: fileName, [ENTITY.FOLDER.DOC.URL]: urlDoc
                    };
                  }
                }
              }
            }
          }

        }
      }
    }
    return res;
  }
  /**
  * Private fctory function. Do not use outside of this class.
  * Creates the part of the graph from the Templates sheet. 
  */
  static _templates(spreadSheet, values, rootFields, nameSpace) {
    var res = [];

    var headingCount = 0;
    var headingIndex = 0;
    var templateCount = 0;
    var noHeading = true;
    if (values.length > 2) { // skip row 1 as its a header row 
      res[0] = { heading: "TEMPLATES", [ENTITY.TEMPLATE_ATTR]: [] };

      for (var i = 1; i < values.length; i++) {

        var description = S6Utility.trim(values[i][0]);
        if (description != EMPTY) {
          var fileName = S6Utility.trim(values[i][1]);
          if (fileName == EMPTY) {
            // heading only 
            res[headingCount++] = { [ENTITY.TEMPLATE_ATTR.HEADING]: description, [ENTITY.TEMPLATES]: [] };
            templateCount = 0;
            if (noHeading) {
              headingIndex = 0;
              noHeading = false;
            }
            else {
              headingIndex = headingCount - 1;
            }
            ////console.log(res);
          }
          else {

            var desc = S6Utility.trim(values[i][0]);
            var templateUrl = S6Utility.trim(values[i][2]);
            var fieldsSheet = S6Utility.trim(values[i][3]);

            var templateId = S6Utility.makePseudoGuid(12);// Utilities.computeHmacSignature() S6Utility.getIdFromUrl(templateUrl);
            var fields;
            var hasFeilds = NO;
            if (fieldsSheet != EMPTY) {
              let valuesFileds = S6Entity._sheetValues(spreadSheet, fieldsSheet, "A:E");
              let from_fields = S6Entity._fields(valuesFileds, false, EMPTY, nameSpace, false);
              fields = from_fields[0];
              hasFeilds = YES;
              fields = rootFields.concat(fields);
            }
            else {
              var hasFeilds = NO;
              fields = rootFields;
            }
            // temaples alwyas have access to the root fields.
           
            res[headingIndex][ENTITY.TEMPLATES][templateCount++] = {
              [ENTITY.TEMPLATE_ATTR.DESC]: desc,
              [ENTITY.TEMPLATE_ATTR.FILE_NAME]: fileName,
              [ENTITY.TEMPLATE_ATTR.URL]: templateUrl,
              [ENTITY.TEMPLATE_ATTR.IS_FOLDER]: templateUrl == EMPTY ? YES : NO,
              [ENTITY.TEMPLATE_ATTR.FIELDS]: fields,
              [ENTITY.TEMPLATE_ATTR.ID]: templateId,
              [ENTITY.TEMPLATE_ATTR.HAS_FIELDS]: hasFeilds
            };
            S6Context.debug("Next template created",res[headingIndex][ENTITY.TEMPLATES][templateCount-1]);
            //}

          }
        }

      }
    }
    return res;
  }

}



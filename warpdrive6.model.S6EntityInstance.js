const INSTANCE_V11 = {
  ADD_ON_NAME: ADD_ON_NAME_FIELD,
  ADD_ON_VERSION: ADD_ON_VERSION_FIELD,
  FIELDS: "fields",
  CONFIG_ID: "configSheetId",
  FOLDER_TYPE: "folderType"
}

const INSTANCE = {
  ADD_ON_NAME: ADD_ON_NAME_FIELD,
  ADD_ON_VERSION: ADD_ON_VERSION_FIELD,
  FIELDS: "fields",
  DEPRECATED_CONFIG_ID: INSTANCE_V11.CONFIG_ID,
  NAME_SPACE: "nameSpace",
  INSTANCE_ID: "rootFolderId",
  YOU_HAVE_ACCESS: "youHaveAcces",
  FIELD: {
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
  IS_MANAGED: "isManaged"
}


class S6EntityInstance {

  constructor(json, folder, id, entity, nameSpace = EMPTY, secret, managed = true) {
    if (secret != "#PRIVATE") {
      throw "Use the factory functions starting with new...(). Do not construct your own S6EntityInstance";
    }
    S6Validate.mandatory("json", json).mandatoryType("id", id, DataType.DriveID);
    this.isManaged = managed;
    this.entity = entity;
    this.data = json;
    this.instanceId = id;
    this.folder = folder;

    if (this.data[INSTANCE.ADD_ON_VERSION] == "1.1" && nameSpace != EMPTY) {
      delete this.data[INSTANCE_V11.FOLDER_TYPE];
      this.data[INSTANCE.NAME_SPACE] = nameSpace;
      this.data[INSTANCE.ADD_ON_VERSION] = ADD_ON_METADATA_VERSION_2;
    }
    this.entityNameSpace = json[INSTANCE.NAME_SPACE];
    Object.freeze(this);
  }

  static newFromFolderId(folderId, nameSpace = EMPTY) {
    return S6EntityInstance._newFromFolderOrId(null, folderId, nameSpace);
  }

  static newFromFolder(folder, nameSpace = EMPTY) {
    return S6EntityInstance._newFromFolderOrId(folder, EMPTY, nameSpace);
  }

  static _newFromFolderOrId(folder, folderId, nameSpace = EMPTY) {
    var res;
    if (folderId == EMPTY) {
      folderId = folder.getId();
    }
    S6Context.time("S6EntityInstance::_newFromFolderOrId:" + S6EntityInstance._cacheName(folderId, nameSpace));
    //S6Context.warn(new Error().stack);
    const elements = S6EntityInstance._helpGetElements(nameSpace, folderId, folder);
    if (elements.entity[ENTITY.YOU_HAVE_ACCESS] == NO) {
      elements.folderMetaData[INSTANCE.YOU_HAVE_ACCESS] = S6Utility.hasEditAccess(elements.folderId);
    }
    else {
      elements.folderMetaData[INSTANCE.YOU_HAVE_ACCESS] = YES;
    }
    res = new S6EntityInstance(elements.folderMetaData, elements.folder, elements.folderId, elements.entity, nameSpace, "#PRIVATE", true);

    S6Context.timeEnd("S6EntityInstance::_newFromFolderOrId:" + S6EntityInstance._cacheName(folderId, nameSpace));
    S6Context.trace(res);
    return res;
  }

  static _cacheName(instanceId, namespace) {
    return `${namespace}:${instanceId}`;
  }

  static _helpGetElements(nameSpace = EMPTY, folderId = EMPTY, folder) {
    S6Context.debugFn("_helpGetElements begin:", nameSpace, "id:", folderId, !folder);
    var res = {
      folder: folder,
      folderId: folderId,
      entity: null,
      folderMetaData: {},
    };
    if (!res.folder) {
      res.folder = S6DriveApp.getFolderById(folderId);
      res.folderId = res.folder.getId();
    }
    res.folderId = res.folder.getId();
    var desc = res.folder.getDescription();
    var configId;
    if (desc) {
      res.folderMetaData = JSON.parse(desc);
      if (res.folderMetaData) {
        if (nameSpace == EMPTY) {
          if (res.folderMetaData.hasOwnProperty(INSTANCE.DEPRECATED_CONFIG_ID)) {
            configId = res.folderMetaData[INSTANCE.DEPRECATED_CONFIG_ID];
            var master = S6Master.new();
            nameSpace = master.getNameSpaceForConfigID(configId);
          }
        }
      }
    }
    if (nameSpace != EMPTY) {
      res.entity = S6Entity.newFromNameSpace(nameSpace);
    }
    var info = S6EntityInstance._helpMakeFields(res.folderMetaData[INSTANCE.FIELDS], res.entity, res.folder);

    res.folderMetaData[INSTANCE.FIELDS] = info.fields;
    res.folderMetaData[INSTANCE.IS_MANAGED] = info.managed;

    S6Context.debugFn("_helpGetElements end:", res.folderMetaData[INSTANCE.FIELDS]);
    return res;

  }

  static _helpMakeFields(fields, entity, folder) {
    //S6Context.debugFn("_helpMakeFields:", fields);
    var res = {
      managed: YES,
      fields: fields
    };
    var folderFieldIdentified = false; // a field must be identfied as the folder field. If not we will guess it to be the first field 
    var eFields = entity.config[ENTITY.FIELDS]
    //S6Context.debugFn("_helpMakeFields: entity fields", eFields);

    if (!res.fields || res.fields == {}) {
      res.fields = {};
      res.fields = _.cloneDeep(eFields);
      //S6Context.debugFn("_helpMakeFields: cloned", fields);
    }

    let next = 0;
    for (var index = 0; index < eFields.length; index++) {
      for (var fi = 0; fi < res.fields.length; fi++) {
        if (res.fields[fi][INSTANCE.FIELD.FIELD_NAME] == eFields[index][ENTITY.FIELD_ATTR.FIELD_NAME]) {
          //S6Context.debugFn("_helpMakeFields: found", fields[fi]);
          var info = S6EntityInstance._populateFields(res.fields[fi], eFields[index], folder);
          res[next++] = info.iField;
          if (info.managed == NO) {
            res.managed = NO;
          }
          if (!folderFieldIdentified && info.iField[ENTITY.FIELD_ATTR.VALUE_FROM_FOLDER_NAME] != NO) {
            folderFieldIdentified = true;
          }
          break;
        }
      }
    }
    if (!folderFieldIdentified) {
      // one field must be the value of the folder so we will get the first field 
      S6Context.warn("S6Entity", entity.nameSpace, ". No field identifed as the folder value field, guessing it is: ", res[0][ENTITY.FIELD_ATTR.FIELD_NAME]);
      res[0][ENTITY.FIELD_ATTR.VALUE_FROM_FOLDER_NAME] = YES;
      res[0][ENTITY.FIELD_ATTR.VALUE] = folder.getName();
    }
    //S6Context.debugFn("_helpMakeFields, updated", res);
    return res;
  }
  static _populateFields(iField, eField, folder) {
    var res = {
      managed: YES,
      iField: iField
    }
    res.iField[INSTANCE.FIELD.FIELD_NAME] = eField[ENTITY.FIELD_ATTR.FIELD_NAME];
    res.iField[INSTANCE.FIELD.TITLE] = eField[ENTITY.FIELD_ATTR.TITLE];
    res.iField[INSTANCE.FIELD.UPDATEABLE] = eField[ENTITY.FIELD_ATTR.UPDATEABLE];
    res.iField[INSTANCE.FIELD.ROOT_FIELD] = eField[ENTITY.FIELD_ATTR.ROOT_FIELD];
    res.iField[INSTANCE.FIELD.HINT] = eField[ENTITY.FIELD_ATTR.HINT];
    res.iField[INSTANCE.FIELD.VALUE_FROM_FOLDER_NAME] = eField[ENTITY.FIELD_ATTR.VALUE_FROM_FOLDER_NAME];

    if (res.iField[INSTANCE.FIELD.VALUE_FROM_FOLDER_NAME] == META_DATA.VALUE_FROM_FOLDER) {
      res.iField[INSTANCE.FIELD.VALUE] = folder.getName();
    }
    else if (res.iField[INSTANCE.FIELD.VALUE_FROM_FOLDER_NAME] == META_DATA.VALUE_FROM_PARENT_FOLDER) {
      var p = folder.getParentFolder();
      if (p) {
        res.iField[INSTANCE.FIELD.VALUE] = p.getName();

      }
      else {
        res.managed = NO;
      }
    }
    return res;
  }
}


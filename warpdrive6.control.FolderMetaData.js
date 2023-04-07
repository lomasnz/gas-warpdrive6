class FolderMetaData {


  static makeFromJson(json) {
    return new FolderMetaData(json.fields, json.configSheetId, json.rootFolderId, json.name, json.version);
  }

  constructor(fields, configSheetId, rootFolderId, nameSpace, folderType = EMPTY, addOnName = EMPTY, addOnVersion = EMPTY) {
    S6Validate.mandatory("fields", fields).mandatory("configSheetId", configSheetId).mandatory("rootFolderId", rootFolderId).mandatory("nameSpace",nameSpace);
    //console.log("before:", JSON.stringify(fields));
    this._fields = FolderMetaData._pruneFields(fields);
    //console.log("after:", JSON.stringify(this._fields));

    //console.log("FolderMetaData:Pruend Fields:" + JSON.stringify(fields));
    this._configSheetId = configSheetId;
    this._rootFolderId = rootFolderId;
    this._nameSpace = nameSpace;

    //this._folderType = folderType != null ? folderType : "UNKNOWN";
    this._name = addOnName != EMPTY ? addOnName : ADD_ON_NAME;
    this._version = addOnVersion != EMPTY ? addOnVersion : ADD_ON_METADATA_VERSION_2;
  }
  static _pruneFields(fieldsToPrune) {
    var res = [];
    for (var i = 0; i < fieldsToPrune.length; i++) {
      res[i] = {
        field: fieldsToPrune[i].field,
        value: fieldsToPrune[i].value,
        title: fieldsToPrune[i].title,
        type: fieldsToPrune[i].type,
        rootField: fieldsToPrune[i].rootField,
        valueFromFolderName : fieldsToPrune[i].valueFromFolderName
      };
    }
    return res;
  }
  toJSON() {
    var res =
    {
      "name": this._name,
      "version": this._version,
      "nameSpace" : this._nameSpace,
      "fields": this._fields,
      "configSheetId": this._configSheetId,
      "rootFolderId": this._rootFolderId
    };
    return res;
  }
  get name() {
    return this._name;
  }
  set name(newValue) {
    this._name = newValue;
  }
  get version() {
    return this._version;
  }
  set version(newValue) {
    this._version = newValue;
  }

  get fields() {
    return this._fields;
  }
  set fields(newValue) {
    this._fields = newValue;
  }
  get configSheetId() {
    return this._configSheetId;
  }
  set configSheetId(newValue) {
    this._configSheetId = newValue;
  }
  get folderType() {
    return this._folderType;
  }
  set folderType(newValue) {
    this._folderType = newValue;
  }
  get rootFolderId() {
    return this._rootFolderId;
  }
  set rootFolderId(newValue) {
    this._rootFolderId = newValue;
  }



}

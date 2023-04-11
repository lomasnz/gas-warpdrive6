/**
 * This factory creates folders and files and keeps track of state about what it has done.
 */
class S6DriveFactory {

  constructor() {
    this._foldersCreated = 0;
    this._foldersRenamed = 0;
    this._filesCreated = 0;
    this._rootFolderId = "unknown";
    this._rootFolderUrl = "unknown_url";
    this._record = new Map();
    this._cacheFolders = new Map();
    this._lastRecorded = null;
  }
  get rootFolderUrl() {
    return this._rootFolderUrl;
  }
  set rootFolderUrl(newValue) {
    this._rootFolderUrl = newValue;
  }
  _recordIt(name, item) {
    S6Context.debugFn(this._recordIt, name);
    this._lastRecorded = item;
    return this._record.set(name, item);
  }
  getLastRecorded() {
    return this._lastRecorded;
  }
  getFromRecord(name) {
    S6Context.debugFn(this.getFromRecord, name);
    S6Context.debug(`getFromRecord(${name})`);
    return this._record.get(name);
  }
  get rootFolderId() {
    return this._rootFolderId;
  }
  set rootFolderId(newValue) {
    this._rootFolderId = newValue;
  }
  get foldersCreated() {
    return this._foldersCreated;
  }
  get foldersRenamed() {
    return this._foldersRenamed;
  }
  get filesCreated() {
    return this._filesCreated;
  }
  set foldersCreated(newValue) {
    this._foldersCreated = newValue;
  }
  set filesCreated(newValue) {
    this._filesCreated = newValue;
  }
  set foldersRenamed(newValue) {
    this.foldersRenamed = newValue;
  }
  _incFoldersRenamed() {
    return ++this._foldersRenamed;
  }
  _incFilesCreated() {
    return ++this._filesCreated;
  }
  _incFoldersCreated() {
    return ++this._foldersCreated;
  }
  _incFoldersUpdated() {
    return ++this._foldersUpdated;
  }

  _createNewFolder(rootFolder, name) {
    var res;
    var exists = false;
    res = this._cacheGet(rootFolder, name);
    if (res != null) {
      S6Context.debug("_createNewFolder/ folder CACHED not created:" + name);
      exists = true;
    }
    else {
      console.time("getFoldersByName");
      var iterator = rootFolder.getFoldersByName(name);
      if (iterator.hasNext()) {
        res = iterator.next();
        this._cacheSet(rootFolder, name, res);
        exists = true;
        S6Context.debug("_createNewFolder/ folder EXISTS not created:" + name);
      }
      console.timeEnd("getFoldersByName");
    }
    if (!exists) {
      S6Context.debug("createFolder:", name, "/on:", rootFolder.getName());
      console.time("createFolder");

      res = rootFolder.createFolder(name);
      console.info("Created folder:" + name);

      this._recordIt(name, res);
      this._incFoldersCreated();
      this._cacheSet(rootFolder, name, res);
      S6Context.debug("_createNewFolder/ folder NOT FOUND created:" + name);
      console.timeEnd("createFolder");
    }
    else {
        this._recordIt(name, res);
    }
    return res;
  }
  _cacheSet(rootFolder, name, folder) {
    var cacheKey = rootFolder.getId() + name;
    return this._cacheFolders.set(cacheKey, folder);
  }
  _cacheGet(folder, name) {
    var res = null;
    var cacheKey = folder.getId() + name;
    res = this._cacheFolders.get(cacheKey);
    return res;
  }
  /**
   * @param {DriveApp.Folder} rootFolder - The root folder on which all other folders are created 
   * @param {String[]} folders - array of folder names, with each elemt in the array being a sub folder on the element before it.
   * @param {String} oldFolder - if this oldFolder exists the new folder is created by renaming the old folder 
   * @return {DriveApp.Folder} - the last folder created
   */
  _createFolders(rootFolder, folders, oldFolder = EMPTY) {
    var res = rootFolder;
    S6Context.debug("create folder count " + folders.length);
    for (var i = 0; i < folders.length; i++) {
      var name = folders[i];
      S6Context.debug("create folder " + name);
      if (name != "") {
        // check if this is the last folder (eg /a/b/c, where c would be the last folder), and it needs to be renamed from the oldFolder.
        if (i == folders.length - 1 && oldFolder != EMPTY) {
          // this is the last folder to create and there is possibly an old folder to rename 
          var iteratorOld = res.getFoldersByName(oldFolder);
          if (iteratorOld.hasNext()) {
            // rename the old folder
            var rf = res;
            res = iteratorOld.next();
            res.setName(name);
            this._cacheSet(rf, name, res)
            this._recordIt(name, res);
            this._incFoldersRenamed();
            S6Context.info(`Rename folder from[${oldFolder}] to [${name}]`);
          }
          else {
            res = this._createNewFolder(res, name);
          }
        }
        else {
          res = this._createNewFolder(res, name);
        }

      }
    }
    return res;
  }

  static makeFoldersAndDoc(fileName, url = EMPTY) {
    S6Validate.mandatory("makeFoldersAndDoc.fileName", fileName);//.mandatory("makeFoldersAndDoc.url", url);
    var res = {};
    const split = fileName.split(FOLDER_SEPERATOR);
    const newFileName = split[split.length - 1];
    const folder = fileName.substring(0, fileName.length - newFileName.length - 1);
    res =
      [{
        [ENTITY.FOLDER.FOLDER_NAME]: folder,
        [ENTITY.FOLDER.OLD_FOLDER]: EMPTY,
        [ENTITY.FOLDER.DOCS]: [{
          [ENTITY.FOLDER.DOC.FILE_NAME]: newFileName,
          [ENTITY.FOLDER.DOC.URL]: url
        }]
      }];

    return res;
  }
  /**
  * @param {string} rootFolder - ID of root folder underwhich folders and docs will be created 
  * @param {array} foldersAndDocs - in the format {folder, docs{fileName,url}}}
  * @param {FolderMetaData} folderMetaData - add to the first folder's description. 
  */
  createFoldersAndFiles(rootFolderId, foldersAndDocs, folderMetaData, depth = 0) {
    let res = {};
    var rootFolder = DriveApp.getFolderById(rootFolderId);

    //Create the new folder
    for (var i = 0; i < foldersAndDocs.length; i++) {
      let vars = {
        newFolder: foldersAndDocs[i].folder,
        newFoldersSplit: EMPTY,
        oldFolder: EMPTY
      }
      vars.newFoldersSplit = vars.newFolder.split(FOLDER_SEPERATOR);

      if (foldersAndDocs[i].hasOwnProperty("oldFolder")) {
        vars.oldFolder = foldersAndDocs[i].oldFolder;
      }
      S6Context.debug(vars);

      if (vars.newFoldersSplit.length > 0) {
        vars.newFolder = this._createFolders(rootFolder, vars.newFoldersSplit, vars.oldFolder);
        var fields;
        if (folderMetaData) {
          fields = folderMetaData.fields;
          if (i == depth) {
            this.rootFolderUrl = vars.newFolder.getUrl();
            this.rootFolderId = vars.newFolder.getId();

            folderMetaData.rootFolderId = vars.newFolder.getId();
            var folderMetaDataString = folderMetaData.toJSON();
            vars.newFolder.setDescription(JSON.stringify(folderMetaDataString));
          }
          else {
            folderMetaData.folderType = FOLDER_TYPE_SUB;
          }
          S6Context.debug("Set description:", vars.newFolder.getName(), ":", folderMetaDataString);
        }
        else if (i == depth) {
          this.rootFolderUrl = vars.newFolder.getUrl();
          this.rootFolderId = vars.newFolder.getId();
        }

        var docs = foldersAndDocs[i][ENTITY.FOLDER.DOCS];
        for (var j = 0; j < docs.length; j++) {
          if (docs[j][ENTITY.FOLDER.DOC.URL] != EMPTY) {
            var templateUrl = S6MasterTemplate.lookupUrl(docs[j][ENTITY.FOLDER.DOC.URL], fields);
            this._createCopyOfFile(templateUrl, docs[j][ENTITY.FOLDER.DOC.FILE_NAME], vars.newFolder);
          }
          else {
            S6Context.debug("S6DriveFactory skipped creating file as their is no URL to create it from:", vars.newFolder.getName());
          } 

        }

      }
    }
    res = { rootFolderUrl: this.rootFolderId, folderCount: this.foldersCreated, docCount: this.filesCreated };
    S6Context.debug(`${this.foldersCreated} folder(s) and ${this.filesCreated} file(s) created, plus ${this.foldersRenamed} folder(s) renamed.`);
    return res;
  }
  /**
   * Creates a copy of the file given by the url with the name toFileName to the folder
   */
  _createCopyOfFile(url = EMPTY, toFileName, folder) {
    var result;
    // if (url == EMPTY) {
    //   result = this._createFolder(toFileName, folder);
    // }
    if (toFileName != EMPTY && folder) {
      // Copying a files has to be done by the file's specific document type's App
      var app = S6Utility.getAppForTypeFromUrl(url);
      result = this._createCopyOfFileWorker(app, url, toFileName, folder);
    }
    //
    if (result != null) {
      console.info("File copy created " + result.getName());
    }
    return result;
  }
  // _createFolder(name, folder) {
  //   var res;
  //   var it = folder.getFoldersByName(name);
  //   if (it.hasNext()) {
  //     console.error(`Unable to create folder name[${name}] because the the folder already exists`);
  //   }
  //   else {
  //     var res = S6DriveApp.createFolder(name, folder);
  //     this._recordIt(name, res);
  //     this._incFoldersCreated();
  //   }
  //   return res;
  // }

  /** 
  * Utility functiuon to attempt to copy / create a new file 
  */
  _createCopyOfFileWorker(app, url, name, folder) {
    var result;
    var file;

    var folderName = folder.getName()
    S6Context.debug(`copyFileWorker Create file name[${name}] from url[${url}] on folder[${folderName}]`);
    try {
      file = app.openByUrl(url);
    }
    catch (err) {
      console.error(err.stack);
      console.error(`Unable to create file name[${name}] because the the template file can not be opend @ url[${url}] err:${err}`);
    }
    if (file != null) {
      var existingfiles = folder.getFilesByName(name);
      if (!existingfiles.hasNext()) {
        S6Context.debug("Copying file: " + file.getId() + "; name: " + name + "; folder: " + folder.getName());
        file = DriveApp.getFileById(file.getId());
        result = file.makeCopy(name, folder);
        S6Context.debug(`Copied file: (${name})`);
        this._recordIt(name, result);
        this._incFilesCreated();
      }
      else {
        S6Context.debug("File exists:" + name + "; folder: " + folder.getName() + ". File not created.");
        result = existingfiles.next();
        this._recordIt(name, result);
      }
    }
    return result;
  }


}

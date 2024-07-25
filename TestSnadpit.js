
const  TEST_FOLDER_ID = '0AKNS_3CSeYV_Uk9PVA';




function listShortcutFoldersInDriveFolder() {
  try {
    Logger.log('Folder ID: ' + TEST_FOLDER_ID);
    
    var folder = DriveApp.getFolderById(TEST_FOLDER_ID);
    Logger.log('Folder Name: ' + folder.getName());
    
    var files = folder.getFiles();
    var shortcutMimeType = 'application/vnd.google-apps.shortcut';
    var shortcutFolders = [];

    while (files.hasNext()) {
      var file = files.next();
      Logger.log('File Name: ' + file.getName() + ', MimeType: ' + file.getMimeType());
      
      if (file.getMimeType() === shortcutMimeType) {
        var targetId = file.getTargetId();
        var targetFile = DriveApp.getFileById(targetId);
        if (targetFile.getMimeType() === MimeType.FOLDER) {
          shortcutFolders.push({
            name: file.getName(),
            id: file.getId(),
            targetName: targetFile.getName(),
            targetId: targetId
          });
        }
      }
    }

    Logger.log('Shortcut Folders:');
    shortcutFolders.forEach(function(shortcutFolder) {
      Logger.log('Name: ' + shortcutFolder.name + ', ID: ' + shortcutFolder.id + ', Target Name: ' + shortcutFolder.targetName + ', Target ID: ' + shortcutFolder.targetId);
    });
  } catch (e) {
    Logger.log('Error: ' + e.toString());
  }
}


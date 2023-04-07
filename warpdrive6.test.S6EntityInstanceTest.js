function test_In() {

  var res = S6EntityInstance.newFromFolderIdAndNameSpace("1bzOd5TP1f0VLP21X2epmuduKx-2q37id", "customer.accounts", true);
  console.log(res.instance);
}

function test_Insta() {
  var json;
  var folder = DriveApp.getFolderById("1nc-86q0tqSx_uc_LatlFtZ5MqWyavcTB");
  console.log(folder.getDescription());
  if (folder) {
    let desc = folder.getDescription();
    if (desc && desc != EMPTY) {
      json = JSON.parse(desc);
    }
  }
  console.log(json);
}

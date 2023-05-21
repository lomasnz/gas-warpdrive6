function testBatch() {
  S6Batch.batch("testBatchReturn", { test: "Test" });
}

function testBatchReturn(data) {
  console.log(data);

}
function testUrlWebApp() {

  var appUrl = ScriptApp.getService().getUrl();
  return console.log(appUrl);

}

function testDeploymentUrl() {
  var scriptId = ScriptApp.getScriptId();
  var deploymentId;
  var domain = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL).getAuthorizationUrl().match(/\/\/(.+?)\//)[1];
  console.log(domain);

  // Check if the script is deployed as a web app
  var webApps = ScriptApp.getProjectTriggers().filter(function (trigger) {
    return trigger.getHandlerFunction() == "doGet" || trigger.getHandlerFunction() == "doPost";
  });
  console.log(webApps.length);

  if (webApps.length > 0) {
    deploymentId = webApps[0].getUniqueId();
    console.log(deploymentId);
    return "https://script.google.com/macros/s/" + scriptId + "/exec?deploymentId=" + deploymentId;
  }

  // Check if the script is deployed as an API executable
  var apiExecutables = ScriptApp.getProjectTriggers().filter(function (trigger) {
    return trigger.getEventType() == ScriptApp.EventType.ON_OPEN;
  });
  if (apiExecutables.length > 0) {
    var domain = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL).getAuthorizationUrl().match(/\/\/(.+?)\//)[1];
    deploymentId = apiExecutables[0].getUniqueId();
    return "https://script.google.com/a/macros/" + domain + "/s/" + scriptId + "/exec?deploymentId=" + deploymentId;
  }

  // Script is not deployed
  return null;
}

function testgetDeployments() {
  console.log("https://script.google.com/a/macros/section6.nz/s/AKfycbz5U9UZ_ArAiCAG6oIgtNlUbu-9gY92a7K0jW4ynUw/dev");
  console.log(ScriptApp.getService().getUrl());
  console.log(getScriptUrl());
}

function getScriptUrl() {
  var res = ScriptApp.getService().getUrl();
  const deployments = getDeployments();

  if (!res.includes(`/exec?id=${deployments.deploymentId}`)) {
    var domain = S6Utility.getDomainName();
    res = `https://script.google.com/a/macros/${domain}/s/${deployments.deploymentId}/dev`;
  }
  return res;
}


function getDeployments() {
  const id = ScriptApp.getScriptId();
  const token = ScriptApp.getOAuthToken();

  const uri = `https://script.googleapis.com/v1/projects/${id}/deployments`;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(uri, options);

  if (response.getResponseCode() !== 200) {
    console.log(response.getContentText());
    return [];
  }

  const { deployments } = JSON.parse(response.getContentText());

  return deployments[0];
}

function getSecret() {
  // name of project
  const projectId = 's6-g-tools';

  // resource ID of the secret to retrieve
  const resourceId = 'projects/538345115646/secrets/ServiceAccount';

  // Version of the secret to retrieve
  const version = 'latest';
  const url = `https://secretmanager.googleapis.com/v1/${resourceId}/versions/${version}:access`;

  const accessToken = ScriptApp.getOAuthToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const options = {
    method: "GET",
    headers: headers,
  };

  const response = UrlFetchApp.fetch(url, options);
  const base64Secret = JSON.parse(response.getContentText()).payload.data;
  const secret = JSON.parse(Utilities.newBlob(Utilities.base64Decode(base64Secret)).getDataAsString());

  // Do something with the secret
  console.log(secret);
}

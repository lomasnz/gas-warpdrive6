function testFileType() {
  var f = DriveApp.getFileById("1GijvuHFE8blgUL0TeNC2FHE3X65h7DZz");
  //var f = DriveApp.getFileById("1NHLK5p5s9QB5iecpe3zbe4ue8Qy9_YKsX7MNbstGqcE");

  console.log(f.getName());
    console.log(f.getMimeType()); 
    console.log(f.toString());

  

}
function testPicker() {
  var p = new google.picker.PickerBuilder();
}

const event = {
  clientPlatform: 'web',
  userLocale: 'en',
  userCountry: 'GB',
  formInput:
  {
    '{taskType}': 'Copy',
    '{fileName}': 'SECTION6 TSB BANK VIRTUAL TEAM PROPOSAL 7 JUNE 2022',
    '{folders}': 'SECTION6 TSB BANK VIRTUAL TEAM PROPOSAL 7 JUNE 2022'
  },
  parameters:
  {
    url_0: 'https://drive.google.com/drive/folders/1VccoDEOwGzLMaCNVAlLmt6i2ApACxQNj',
    'active.document.id_0': '1R8V4bvejV1f3ewSgak5HqfTK3rZ2e4islstTMinIhVo',
    templateUrl_0: 'undefined',
    url: '0',
    entity_0: 'Customer Accounts',
    taskType_0: 'Copy',
    'active.document.id': '0',
    fields: '0',
    id_0: '1VccoDEOwGzLMaCNVAlLmt6i2ApACxQNj',
    id: '0',
    entity: '0',
    taskType: '0',
    settingsUrl_0: 'https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit',
    fields_0: '[{"field":"{allfolders}","hint":"Folder","title":"Folder","type":"allfolders","mandatory":"YES","value":""},{"field":"{subfolder}","hint":"Subfolder","title":"Subfolder","type":"text","mandatory":"NO","value":""},{"field":"{fileName}","hint":"File name","title":"File name","type":"text","mandatory":"YES","value":""},{"field":"{taskType}","hint":"Task type","title":"File name","type":"choose","mandatory":"YES","value":""}]',
    settingsUrl: '0',
    templateUrl: '0'
  },
  commonEventObject:
  {
    parameters:
    {
      taskType_0: 'Copy',
      templateUrl: '0',
      taskType: '0',
      url_0: 'https://drive.google.com/drive/folders/1VccoDEOwGzLMaCNVAlLmt6i2ApACxQNj',
      'active.document.id': '0',
      id_0: '1VccoDEOwGzLMaCNVAlLmt6i2ApACxQNj',
      settingsUrl_0: 'https://docs.google.com/spreadsheets/d/1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0/edit',
      fields: '0',
      'active.document.id_0': '1R8V4bvejV1f3ewSgak5HqfTK3rZ2e4islstTMinIhVo',
      url: '0',
      settingsUrl: '0',
      templateUrl_0: 'undefined',
      fields_0: '[{"field":"{allfolders}","hint":"Folder","title":"Folder","type":"allfolders","mandatory":"YES","value":""},{"field":"{subfolder}","hint":"Subfolder","title":"Subfolder","type":"text","mandatory":"NO","value":""},{"field":"{fileName}","hint":"File name","title":"File name","type":"text","mandatory":"YES","value":""},{"field":"{taskType}","hint":"Task type","title":"File name","type":"choose","mandatory":"YES","value":""}]',
      entity_0: 'Customer Accounts',
      id: '0',
      entity: '0'
    },
    hostApp: 'DOCS',
    formInputs:
    {
      '{folders}': [Object],
      '{fileName}': [Object],
      '{taskType}': [Object]
    },
    userLocale: 'en-GB',
    timeZone: { offset: 43200000, id: 'Pacific/Auckland' },
    platform: 'WEB'
  },
  formInputs:
  {
    '{folders}': ['SECTION6 TSB BANK VIRTUAL TEAM PROPOSAL 7 JUNE 2022'],
    '{taskType}': ['Copy'],
    '{fileName}': ['SECTION6 TSB BANK VIRTUAL TEAM PROPOSAL 7 JUNE 2022']
  },
  hostApp: 'docs',
  docs: {},
  userTimezone: { id: 'Pacific/Auckland', offSet: '43200000' }
};

function test_JSON_PARAM() {

  var param = new Param(event);
  //param.addJSON(FIELDS,TASK_FILEDS.fields);
  var j = param.getJSON(FIELDS);
  var j1 = param.getAllArrayOfJSON(FIELDS);

  console.log(j);
  console.log(j1);



}
function test_AddFields() {
  var param1 = new Param();
  var param2 = new Param();
  param1.addJSON(FIELDS, TASK_FILEDS.fields[0]);
  param1.addJSON(FIELDS, TASK_FILEDS.fields[1]);
  param1.addJSON(FIELDS, TASK_FILEDS.fields[2]);

  param2.addJSON(FIELDS, TASK_FILEDS.fields);

  var j1 = param1.getJSON(FIELDS);
  var j2 = param2.getJSON2(FIELDS);

  console.log(j1);
  console.log(j2);
}

function testJson() {

  const TASK_FUNCTION =
  {
    "TASKS":
    {
      "Copy": { "function": "action_do_copy", "icon": ICON_COPY_FILE_URL },
      "Move": { "function": "action_do_move", "icon": ICON_MOVE_FILE_URL },
      "Short cut": { "function": "action_do_shortcut", "icon": ICON_CREATE_SHORTCUT_URL }
    }
  };

  console.log(TASK_FUNCTION);
  console.log(TASK_FUNCTION["TASKS"][TASK_COPY].icon);


}
function test_m() {
  var m = {
    "timeZone": "Pacific/Auckland",
    "dependencies": {
      "enabledAdvancedServices": [
        {
          "userSymbol": "Drive",
          "serviceId": "drive",
          "version": "v2"
        },
        {
          "userSymbol": "AdminDirectory",
          "serviceId": "admin",
          "version": "directory_v1"
        },
        {
          "userSymbol": "Sheets",
          "serviceId": "sheets",
          "version": "v4"
        },
        {
          "userSymbol": "DriveActivity",
          "serviceId": "driveactivity",
          "version": "v2"
        }
      ],
      "libraries": [
        {
          "userSymbol": "LodashGS",
          "libraryId": "1SQ0PlSMwndIuOAgtVJdjxsuXueECtY9OGejVDS37ckSVbMll73EXf2PW",
          "version": "5"
        }
      ]
    },
    "webapp": {
      "executeAs": "USER_ACCESSING",
      "access": "DOMAIN"
    },
    "exceptionLogging": "STACKDRIVER",
    "oauthScopes": [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/presentations",
      "https://www.googleapis.com/auth/drive.addons.metadata.readonly",
      "https://www.googleapis.com/auth/script.external_request",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/forms",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.google.com/m8/feeds",
      "https://www.googleapis.com/auth/script.locale",
      "https://www.googleapis.com/auth/drive.file "
    ],
    "urlFetchWhitelist": [
      "https://drive.google.com/drive/",
      "https://drive.google.com/drive/folders/",
      "https://google.com/",
      "https://www.google.com/s2",
      "https://logo.clearbit.com/",
      "https://section6.pipedrive.com/"
    ],
    "runtimeVersion": "V8",
    "addOns": {
      "common": {
        "useLocaleFromApp": "true",
        "name": "S6 G-TOOLS",
        "logoUrl": "https://section6.nz/img/signature.png",
        "layoutProperties": {
          "primaryColor": "#61166d",
          "secondaryColor": "#424242"
        },
        "homepageTrigger": {
          "runFunction": "onHomePage",
          "enabled": false
        },
        "universalActions": [
          {
            "label": "Home",
            "runFunction": "S6UIService_actionGoHome"
          },
          {
            "label": "Settings",
            "runFunction": "action_Settings"
          },
          {
            "label": "Feedback",
            "openLink": "mailto:paul.armstrong@section6.io?subject=FEEDBACK ON SECTION6 GOOGLE ADD-ON"
          }
        ],
        "openLinkUrlPrefixes": [
          "https://github.com/googleworkspace/add-ons-samples/",
          "https://drive.google.com/drive/",
          "https://section6.atlassian.net/",
          "https://section6.pipedrive.com/"
        ]
      },
      "drive": {
        "homepageTrigger": {
          "runFunction": "onDriveHomePage",
          "enabled": true
        }
      },
      "docs": {
        "homepageTrigger": {
          "runFunction": "onEditorHomepage_Docs",
          "enabled": true
        }
      },
      "slides": {
        "homepageTrigger": {
          "runFunction": "onEditorHomepage_Slides",
          "enabled": true
        }
      },
      "sheets": {
        "homepageTrigger": {
          "runFunction": "onEditorHomepage_Sheers",
          "enabled": true
        }
      }
    }
  };
  console.log(m);
}

function testMetaJson() {
  var m = {
    name: 'S6 TOOL BOX',
    version: '1.1',
    fields:
      [{
        field: '{domain-name}',
        value: '3mnz.co.nz',
        title: 'Internet domain',
        type: 'domain'
      },
      {
        field: '{long-name}',
        value: '3M NEW ZEALAND LIMITED',
        title: 'Full name',
        type: 'text'
      },
      {
        field: '{short-name}',
        value: '3m',
        title: 'Short name',
        type: 'text'
      }],
    configSheetId: '1NlhwlgRfmQ_jDnRIV-t-OLFyuBNHyW-S-JTjIVGSEH0',
    folderType: 'SubFolder',
    rootFolderId: '1GijvuHFE8blgUL0TeNC2FHE3X65h7DZz'
  };

  var folder = DriveApp.getFolderById("1GijvuHFE8blgUL0TeNC2FHE3X65h7DZz");

  m.entityId = folder.getId();
  console.log(m);

}




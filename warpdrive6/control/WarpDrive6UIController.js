const S6Event = {};
const S6EventUser = {};

const S6EventSettings = {
  LogTraceDefault: false,
  LogDebugDefault: false,
  LogInfoDefault: false,

  TimeWarningDefault: 20000,
  TimeErrorDefault: 25000,

  LogDebugOn: { LogDebug: true },
  LogDebugOff: { LogDebug: false },
  LogTraceOn: { LogTrace: true },
  LogTraceOff: { LogTrace: false },
  LogInfoOn: { LogInfo: true },
  LogInfoOff: { LogInfo: false },

  TimeWarningTest0: { TimeWarningThreshhold: 0 },
  TimeWarningAt5Seconds: { TimeWarningThreshhold: 5000 },
  TimeWarningAt10Seconds: { TimeWarningThreshhold: 10000 },
  TimeWarningAt20Seconds: { TimeWarningThreshhold: 20000 },

  TimeErrorTest0: { TimeErrorThreshhold: 0 },
  TimeErrorAt10Seconds: { TimeErrorThreshhold: 10000 },
  TimeErrorAt20Seconds: { TimeErrorThreshhold: 20000 },
  TimeErrorAt25Seconds: { TimeErrorThreshhold: 25000 }

}

class WarpDrive6UIController {

  static initS6Event() {
    WarpDrive6UIController.initUserOverides();
    //
    WarpDrive6UIController.addEvent(actionEventDefault, null, S6EventSettings.LogDebugOn, S6EventSettings.LogInfoOn)
    WarpDrive6UIController.addEvent(testAction, testBuildView, S6EventSettings.LogInfoOn, S6EventSettings.LogDebugOn, S6EventSettings.TimeWarningAt5Seconds);
    // events that are triggered by the ui
    WarpDrive6UIController.addEvent(onDriveHomePage, onDriveHomePageView);
    WarpDrive6UIController.addEvent(onDriveSelectItemHomePage, onDriveSelectItemHomePageView);
    WarpDrive6UIController.addEvent(onEditorHomePage_Docs, onEditorHomePage_DocsView);
    WarpDrive6UIController.addEvent(onEditorHomePage_Slides, onEditorHomePage_SlidesView);
    WarpDrive6UIController.addEvent(onEditorHomePage_Sheets, onEditorHomePage_SheetsView);
    WarpDrive6UIController.addEvent(onDrive_ItemsSelected, onDrive_ItemsSelectedView);
    WarpDrive6UIController.addEvent(actionEventSubEntities, buildtSubEntitiesView);
    // S6DriveUI events
    WarpDrive6UIController.addEvent(actionEventList, buildListEntitiesView);
    WarpDrive6UIController.addEvent(actionEventDetail, buildDetailView);
    WarpDrive6UIController.addEvent(actionEventTemplateEditor, buildTemplateEditorView, S6EventSettings.LogDebugOn);
    WarpDrive6UIController.addEvent(actionEventEdit, buidEditView, S6EventSettings.LogDebugOn);
    WarpDrive6UIController.addEvent(actionEventCreate, buildConfirmCreateView);
    WarpDrive6UIController.addEvent(actionEventCreateEntity, buildCreateEntityView);
    WarpDrive6UIController.addEvent(actionEventConfirmCreateDocFromTemplate, buildConfirmCreateDocFromTemplateView);
    WarpDrive6UIController.addEvent(actionEventConfirmConfirmCreateDocWithFieldsFromTemplate, buildConfirmConfirmCreateDocWithFieldsFromTemplateView);
    WarpDrive6UIController.addEvent(actionEventReviewSettings, buildReviewSettingsView);
    WarpDrive6UIController.addEvent(actionEventSettingsSave, buildEventSettingsSaveView);
    WarpDrive6UIController.addEvent(actionEventClearCache, buildClearCacheView);
    WarpDrive6UIController.addEvent(actionEventEntity, buildMainEntityView);
    WarpDrive6UIController.addEvent(actionEventRefreshSettings, buildRefreshSettingsView);
    WarpDrive6UIController.addEvent(actionEventCreateDocFromTemplate, buildCreateDocFromTemplateView);
    // S6EditorUI events
    WarpDrive6UIController.addEvent(actionEventChooseTask, buildChooseTaskView);
    WarpDrive6UIController.addEvent(actionEventTaskAction, buildTaskActionConfirmView);
    WarpDrive6UIController.addEvent(actionEventConfirmTask, buildConfirmTaskView);
    WarpDrive6UIController.addEvent(actionEventPerformAction, buildPerformActionView);
    WarpDrive6UIController.addEvent(actionEventEntityList, buildEntityListView2);
    WarpDrive6UIController.addEvent(actionEventFileAction, buildFileActionView, S6EventSettings.LogTraceOn);
    WarpDrive6UIController.addEvent(actionEventOpenLink, buildOpenLinkView);
    // AI Processor
    WarpDrive6UIController.addEvent(actionAITextProcessor, bulildAITextProcessorView);
    WarpDrive6UIController.addEvent(actionDoAITextProcessor, bulildDoAITextProcessorView);
    WarpDrive6UIController.addEvent(actionEventReloadInstruction, buildReloadInstructionView);
    WarpDrive6UIController.addEvent(actionEventReloadBackstory, buildReloadBackstortyView);
    WarpDrive6UIController.addEvent(actionEventReloadWritringStyle, buildReloadWritingStyleView);
    // S6PropUI events 
    WarpDrive6UIController.addEvent(actionEventPropertiesApply, buildPropertiesApplyView);

    // NZBN 
    WarpDrive6UIController.addEvent(actionEventNZBNConfirm, buildNZBNConfirmView);
    WarpDrive6UIController.addEvent(actionEventPropertiesAction, buildApplyPropertiesActionView);

    //
    WarpDrive6UIController.addEvent(actionEventBoilerplateAction, buildBoilerplateView);
    WarpDrive6UIController.addEvent(actionEventBoilerplateConfrimEvent, buildBoilerplateConfrimView);
    WarpDrive6UIController.addEvent(actionEventBoilerplateApply, buildBoilerplateApply);

    Object.freeze(S6Event);

  }

  static initUserOverides() {
    WarpDrive6UIController.addUser("paul.armstrong@section6.nz", S6EventSettings.LogDebugOn, S6EventSettings.LogInfoOn, S6EventSettings.LogTraceOn);
    Object.freeze(S6EventUser);
  }

  /**
   * For recording a record in the S6Event  for each action_ build_ pairing, along with configuration (...args)
   */
  static addEvent(actionFn, viewBuildFn, ...args) {
    S6Event[actionFn.name] = {
      ActionFn: actionFn,
      ActionName: actionFn.name,
      ViewBuildFn: viewBuildFn,
      LogInfo: S6EventSettings.LogInfoDefault,
      LogDebug: S6EventSettings.LogDebugDefault,
      LogTrace: S6EventSettings.LogTraceDefault,
      TimeWarningThreshhold: S6EventSettings.TimeWarningDefault,
      TimeErrorThreshhold: S6EventSettings.TimeErrorDefault
    };
    if (S6EventUser[Session.getActiveUser().getEmail()]) {
      var override = S6EventUser[Session.getActiveUser().getEmail()];
      for (let a in override) {
        S6Event[actionFn.name][a] = override[a];
      }
    }
    else {
      if (args.length > 0) {
        for (let a in args) {
          for (let j in args[a]) {
            S6Event[actionFn.name][j] = args[a][j];
          }
        }
      }
    }
  }
  static addUser(userEmail, ...args) {
    S6EventUser[userEmail] = {
      LogInfo: S6EventSettings.LogInfoDefault,
      LogDebug: S6EventSettings.LogDebugDefault,
      LogTrace: S6EventSettings.LogTraceDefault,
      TimeWarningThreshhold: S6EventSettings.TimeWarningDefault,
      TimeErrorThreshhold: S6EventSettings.TimeErrorDefault
    };
    for (let a in args) {
      for (let j in args[a]) {
        S6EventUser[userEmail][j] = args[a][j];
      }
    }
  }
  static execute(event, functionName) {
    WarpDrive6UIController.initS6Event();
    return S6Context.new(functionName).executeBuild(event);
  }
}

function actionEventDefault(event) {
  S6Context.new(actionEventDefault);
  S6Context.error("S6Context default action triggered. This should not happen!");
  return S6UIService.createNotification("S6Context default action triggered. This should not happen!")
}
function onDriveHomePage(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function onDriveSelectItemHomePage(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function onEditorHomePage_Docs(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function onEditorHomePage_Slides(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function onEditorHomePage_Sheets(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function onDrive_ItemsSelected(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventList(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventDetail(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventTemplateEditor(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventEdit(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventCreate(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventCreateEntity(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventConfirmCreateDocFromTemplate(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventConfirmConfirmCreateDocWithFieldsFromTemplate(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventReviewSettings(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventSettingsSave(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventClearCache(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventEntity(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventRefreshSettings(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventCreateDocFromTemplate(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

// editor actions
function actionEventdChooseTask(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventTaskAction(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventConfirmTask(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventChooseTask(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventPerformAction(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventEntityList(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventFileAction(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventOpenLink(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventSubEntities(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventNZBNConfirm(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventPropertiesApply(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventPropertiesAction(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventBoilerplateAction(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}
function actionEventBoilerplateAction(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventBoilerplateConfrimEvent(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventBoilerplateApply(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionAITextProcessor(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionDoAITextProcessor(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventReloadInstruction(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventReloadBackstory(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionEventReloadWritringStyle(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionList(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}


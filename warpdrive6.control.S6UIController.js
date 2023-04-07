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

class S6UIController {

  static initS6Event() {
    S6UIController.initUserOverides();
    //
    S6UIController.addEvent(actionEventDefault, null, S6EventSettings.LogDebugOn, S6EventSettings.LogInfoOn)
    S6UIController.addEvent(testAction, testBuildView, S6EventSettings.LogInfoOn, S6EventSettings.LogDebugOn, S6EventSettings.TimeWarningAt5Seconds);
    // events that are triggered by the ui
    S6UIController.addEvent(onDriveHomePage, onDriveHomePageView);
    S6UIController.addEvent(onDriveSelectItemHomePage, onDriveSelectItemHomePageView);
    S6UIController.addEvent(onEditorHomePage_Docs, onEditorHomePage_DocsView);
    S6UIController.addEvent(onEditorHomePage_Slides, onEditorHomePage_SlidesView);
    S6UIController.addEvent(onEditorHomePage_Sheets, onEditorHomePage_SheetsView);
    S6UIController.addEvent(onDrive_ItemsSelected, onDrive_ItemsSelectedView);
    S6UIController.addEvent(actionEventSubEntities, buildtSubEntitiesView);
    // S6DriveUI events
    S6UIController.addEvent(actionEventList, buildListEntitiesView);
    S6UIController.addEvent(actionEventDetail, buildDetailView);
    S6UIController.addEvent(actionEventTemplateEditor, buildTemplateEditorView, S6EventSettings.LogDebugOn);
    S6UIController.addEvent(actionEventEdit, buidEditView, S6EventSettings.LogDebugOn);
    S6UIController.addEvent(actionEventCreate, buildConfirmCreateView);
    S6UIController.addEvent(actionEventCreateEntity, buildCreateEntityView);
    S6UIController.addEvent(actionEventConfirmCreateDocFromTemplate, buildConfirmCreateDocFromTemplateView);
    S6UIController.addEvent(actionEventConfirmConfirmCreateDocWithFieldsFromTemplate, buildConfirmConfirmCreateDocWithFieldsFromTemplateView);
    S6UIController.addEvent(actionEventReviewSettings, buildReviewSettingsView);
    S6UIController.addEvent(actionEventSettingsSave, buildEventSettingsSaveView);
    S6UIController.addEvent(actionEventClearCache, buildClearCacheView);
    S6UIController.addEvent(actionEventEntity, buildMainEntityView);
    S6UIController.addEvent(actionEventRefreshSettings, buildRefreshSettingsView);
    S6UIController.addEvent(actionEventCreateDocFromTemplate, buildCreateDocFromTemplateView);
    // S6EditorUI events
    S6UIController.addEvent(actionEventChooseTask, buildChooseTaskView);
    S6UIController.addEvent(actionEventTaskAction, buildTaskActionConfirmView);
    S6UIController.addEvent(actionEventConfirmTask, buildConfirmTaskView);
    S6UIController.addEvent(actionEventPerformAction, buildPerformActionView);
    S6UIController.addEvent(actionEventEntityList, buildEntityListView2);
    S6UIController.addEvent(actionEventFileAction, buildFileActionView, S6EventSettings.LogTraceOn);
    S6UIController.addEvent(actionEventOpenLink, buildOpenLinkView);
    // AI Processor
    S6UIController.addEvent(actionAITextProcessor, bulildAITextProcessorView);
    S6UIController.addEvent(actionDoAITextProcessor, bulildDoAITextProcessorView);
    S6UIController.addEvent(actionEventReloadInstruction, buildReloadInstructionView);
    S6UIController.addEvent(actionEventReloadBackstory,buildReloadBackstortyView);
    S6UIController.addEvent(actionEventReloadWritringStyle,buildReloadWritingStyleView);
    // S6PropUI events 
    S6UIController.addEvent(actionEventPropertiesApply, buildPropertiesApplyView);

    // NZBN 
    S6UIController.addEvent(actionEventNZBNConfirm, buildNZBNConfirmView);
    S6UIController.addEvent(actionEventPropertiesAction, buildApplyPropertiesActionView);

    //
    S6UIController.addEvent(actionEventBoilerplateAction, buildBoilerplateView);
    S6UIController.addEvent(actionEventBoilerplateConfrimEvent,buildBoilerplateConfrimView);
    S6UIController.addEvent(actionEventBoilerplateApply,buildBoilerplateApply);

    Object.freeze(S6Event);

  }

  static initUserOverides() {
    S6UIController.addUser("paul.armstrong@section6.nz", S6EventSettings.LogDebugOn, S6EventSettings.LogInfoOn, S6EventSettings.LogTraceOn);
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
}

function actionEventDefault(event) {
  S6Context.new(actionEventDefault);
  S6Context.error("S6Context default action triggered. This should not happen!");
  return S6UIService.createNotification("S6Context default action triggered. This should not happen!")
}
function onDriveHomePage(event) {
  return S6Context.new(onDriveHomePage).executeBuild(event);
}
function onDriveSelectItemHomePage(event) {
  return S6Context.new(onDriveSelectItemHomePage).executeBuild(event);
}
function onEditorHomePage_Docs(event) {
  return S6Context.new(onEditorHomePage_Docs).executeBuild(event);
}
function onEditorHomePage_Slides(event) {
  return S6Context.new(onEditorHomePage_Slides).executeBuild(event);
}
function onEditorHomePage_Sheets(event) {
  return S6Context.new(onEditorHomePage_Sheets).executeBuild(event);
}
function onDrive_ItemsSelected(event) {
  return S6Context.new(onDrive_ItemsSelected).executeBuild(event);
}

function actionEventList(event) {
  return S6Context.new(actionEventList).executeBuild(event);
}
function actionEventDetail(event) {
  return S6Context.new(actionEventDetail).executeBuild(event);
}
function actionEventTemplateEditor(event) {
  return S6Context.new(actionEventTemplateEditor).executeBuild(event);
}
function actionEventEdit(event) {
  return S6Context.new(actionEventEdit).executeBuild(event);
}
function actionEventCreate(event) {
  return S6Context.new(actionEventCreate).executeBuild(event);
}
function actionEventCreateEntity(event) {
  return S6Context.new(actionEventCreateEntity).executeBuild(event);
}
function actionEventConfirmCreateDocFromTemplate(event) {
  return S6Context.new(actionEventConfirmCreateDocFromTemplate).executeBuild(event);
}
function actionEventConfirmConfirmCreateDocWithFieldsFromTemplate(event) {
  return S6Context.new(actionEventConfirmConfirmCreateDocWithFieldsFromTemplate).executeBuild(event);
}
function actionEventReviewSettings(event) {
  return S6Context.new(actionEventReviewSettings).executeBuild(event);
}
function actionEventSettingsSave(event) {
  return S6Context.new(actionEventSettingsSave).executeBuild(event);
}
function actionEventClearCache(event) {
  return S6Context.new(actionEventClearCache).executeBuild(event);
}
function actionEventEntity(event) {
  return S6Context.new(actionEventEntity).executeBuild(event);
}
function actionEventRefreshSettings(event) {
  return S6Context.new(actionEventRefreshSettings).executeBuild(event);
}
function actionEventCreateDocFromTemplate(event) {
  return S6Context.new(actionEventCreateDocFromTemplate).executeBuild(event);
}

// editor actions
function actionEventdChooseTask(event) {
  return S6Context.new(actionEventdChooseTask).executeBuild(event);
}
function actionEventTaskAction(event) {
  return S6Context.new(actionEventTaskAction).executeBuild(event);
}
function actionEventConfirmTask(event) {
  return S6Context.new(actionEventConfirmTask).executeBuild(event);
}

function actionEventChooseTask(event) {
  return S6Context.new(actionEventChooseTask).executeBuild(event);
}
function actionEventPerformAction(event) {
  return S6Context.new(actionEventPerformAction).executeBuild(event);
}

function actionEventEntityList(event) {
  return S6Context.new(actionEventEntityList).executeBuild(event);
}
function actionEventFileAction(event) {
  return S6Context.new(actionEventFileAction).executeBuild(event);
}

function actionEventOpenLink(event) {
  return S6Context.new(actionEventOpenLink).executeBuild(event);
}

function actionEventSubEntities(event) {
  return S6Context.new(actionEventSubEntities).executeBuild(event);
}
function actionEventNZBNConfirm(event) {
  return S6Context.new(actionEventNZBNConfirm).executeBuild(event);
}
function actionEventPropertiesApply(event) {
  return S6Context.new(actionEventPropertiesApply).executeBuild(event);
}
function actionEventPropertiesAction(event) {
  return S6Context.new(actionEventPropertiesAction).executeBuild(event);
}
function actionEventBoilerplateAction(event) {
  return S6Context.new(actionEventBoilerplateAction).executeBuild(event);
}
function actionEventBoilerplateConfrimEvent(event) {
  return S6Context.new(actionEventBoilerplateConfrimEvent).executeBuild(event);
}
function actionEventBoilerplateApply(event) {
  return S6Context.new(actionEventBoilerplateApply).executeBuild(event);
}
function actionAITextProcessor(event) {
  return S6Context.new(actionAITextProcessor).executeBuild(event);
}

function actionDoAITextProcessor(event) {
  return S6Context.new(actionDoAITextProcessor).executeBuild(event);
}
function actionEventReloadInstruction(event) {
  return S6Context.new(actionEventReloadInstruction).executeBuild(event);
}
function actionEventReloadBackstory(event) {
  return S6Context.new(actionEventReloadBackstory).executeBuild(event);
}

function actionEventReloadWritringStyle(event) {
  return S6Context.new(actionEventReloadWritringStyle).executeBuild(event);
}
function actionList(event) {

}
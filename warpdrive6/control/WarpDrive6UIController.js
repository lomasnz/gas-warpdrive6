

class WarpDrive6UIController {

  static initS6Event() {
    WarpDrive6UIController.initUserOverides();
    //
    S6Context.addEvent(actionEventDefault, actionEventDefault, S6EventSettings.LogDebugOn, S6EventSettings.LogInfoOn)

    // events that are triggered by the ui
    S6Context.addEvent(onDriveHomePage, onDriveHomePageView);
    S6Context.addEvent(onDriveSelectItemHomePage, onDriveSelectItemHomePageView);
    S6Context.addEvent(onEditorHomePage_Docs, onEditorHomePage_DocsView);
    S6Context.addEvent(onEditorHomePage_Slides, onEditorHomePage_SlidesView);
    S6Context.addEvent(onEditorHomePage_Sheets, onEditorHomePage_SheetsView);
    S6Context.addEvent(onDrive_ItemsSelected, onDrive_ItemsSelectedView);
    S6Context.addEvent(actionEventSubEntities, buildtSubEntitiesView);
    // S6DriveUI events
    S6Context.addEvent(actionEventList, buildListEntitiesView);
    S6Context.addEvent(actionEventDetail, buildDetailView);
    S6Context.addEvent(actionEventTemplateEditor, buildTemplateEditorView, S6EventSettings.LogDebugOn);
    S6Context.addEvent(actionEventEdit, buidEditView, S6EventSettings.LogDebugOn);
    S6Context.addEvent(actionEventCreate, buildConfirmCreateView);
    S6Context.addEvent(actionEventCreateEntity, buildCreateEntityView);
    S6Context.addEvent(actionEventConfirmCreateDocFromTemplate, buildConfirmCreateDocFromTemplateView);
    S6Context.addEvent(actionEventConfirmConfirmCreateDocWithFieldsFromTemplate, buildConfirmConfirmCreateDocWithFieldsFromTemplateView);
    S6Context.addEvent(actionEventReviewSettings, buildReviewSettingsView);
    S6Context.addEvent(actionEventSettingsSave, buildEventSettingsSaveView);
    S6Context.addEvent(actionEventClearCache, buildClearCacheView);
    S6Context.addEvent(actionEventEntity, buildMainEntityView);
    S6Context.addEvent(actionEventRefreshSettings, buildRefreshSettingsView);
    S6Context.addEvent(actionEventCreateDocFromTemplate, buildCreateDocFromTemplateView);
    // S6EditorUI events
    S6Context.addEvent(actionEventChooseTask, buildChooseTaskView);
    S6Context.addEvent(actionEventTaskAction, buildTaskActionConfirmView);
    S6Context.addEvent(actionEventConfirmTask, buildConfirmTaskView);
    S6Context.addEvent(actionEventPerformAction, buildPerformActionView);
    S6Context.addEvent(actionEventEntityList, buildEntityListView2);
    S6Context.addEvent(actionEventFileAction, buildFileActionView, S6EventSettings.LogTraceOn);
    S6Context.addEvent(actionEventOpenLink, buildOpenLinkView);
    // AI Processor
    S6Context.addEvent(actionAITextProcessor, bulildAITextProcessorView);
    S6Context.addEvent(actionDoAITextProcessor4, bulildDoAITextProcessorView4);
    S6Context.addEvent(actionEventReloadInstruction, buildReloadInstructionView);
    S6Context.addEvent(actionEventReloadBackstory, buildReloadBackstortyView);
    S6Context.addEvent(actionEventReloadWritringStyle, buildReloadWritingStyleView);
    // S6PropUI events 
    S6Context.addEvent(actionEventPropertiesApply, buildPropertiesApplyView);

    // NZBN 
    S6Context.addEvent(actionEventNZBNConfirm, buildNZBNConfirmView);
    S6Context.addEvent(actionEventPropertiesAction, buildApplyPropertiesActionView);

    //
    S6Context.addEvent(actionEventBoilerplateAction, buildBoilerplateView);
    S6Context.addEvent(actionEventBoilerplateConfrimEvent, buildBoilerplateConfrimView);
    S6Context.addEvent(actionEventBoilerplateApply, buildBoilerplateApply);

    S6Context.addEvent(actionEventDisplayGPT4Progress, displayGPT4ProgressView);

    //Object.freeze(S6Event);

  }

  static initUserOverides() {
    S6Context.addUser("paul.armstrong@section6.nz", S6EventSettings.LogDebugOn, S6EventSettings.LogInfoOn, S6EventSettings.LogTraceOff);
    //Object.freeze(S6EventUser);
  }


  static execute(event, functionName) {
    WarpDrive6UIController.initS6Event();
    console.log(functionName);
    var context = S6Context.newFromName(functionName);
    return context.executeBuild(event);
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

function actionDoAITextProcessor4(event) {
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
function actionEventDisplayGPT4Progress(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}

function actionList(event) {
  return WarpDrive6UIController.execute(event, arguments.callee.name);
}


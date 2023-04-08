const PROMPT = "PROMPT";
const PROMPT_NAME = "PROMPT-NAME";
const PROMPT_NAME_SELECTEDTEXT = "PROMPT-NAME-SELECTEDTEXT";
const PROMPT_TEMPERATURE = "PROMPT-TEMPERATURE";
const BACKSTORY_USER_CONTENT = "BACKSTORY-USER-CONTENT";
const BACKSTORY_NAME = "BACKSTORY-NAME";
const USE_BACKSTORY = "USE-BACKSTORY";
const BACKSTORY_ASSISTANCE_CONTENT = "BACKSTORY-ASSISTANCE-CONTENT";
const WRITING_STYLE_NAME = "WRITING-STYLE-NAME";

function bulildAITextProcessorView(param) {
  var res = S6UIService.createCard("OpenAI", "Answer questions, rewrite text", ICON_OPEN_AI_URL);

  var task = param.getValue(PARAM.TASK_TYPE);
  S6Context.info("bulildAITextProcessorView")
  S6Context.debug("Task type", task);

  var service = S6AITextProcessor.newS6AITextProcessor();

  var section = S6UIService.createSection();
  var sectionWritingStyle = S6UIService.createSection();
  //var sectionSettings = S6UIService.createSection();
  var helpInfoSection = S6UIService.createInfoSection("OPEN-AI-HELP");
  var backstorySection = S6UIService.createSection();
  S6UIService.createInfoSection("OPEN-AI-TIP", helpInfoSection);

  var fields = param.getJSON(PARAM.FIELDS);
  var prompt = S6Utility.trim(param.getValue(PROMPT));
  var userContent = S6Utility.trim(param.getValue(BACKSTORY_USER_CONTENT));
  var assistanceContent = S6Utility.trim(param.getValue(BACKSTORY_ASSISTANCE_CONTENT));
  var promptSelectedText = S6Utility.trim(param.getValue(PROMPT_NAME_SELECTEDTEXT));
  var useBackstrory = S6Utility.trim(param.getValue(USE_BACKSTORY));
  var writingStyleName = S6Utility.trim(param.getValue(WRITING_STYLE_NAME));
  //  var temperature = param.getValue(PROMPT_TEMPERATURE);

  S6Context.debug("Template promptSelectedText, before", promptSelectedText);
  if (!promptSelectedText || promptSelectedText == EMPTY) {
    promptSelectedText = YES_IF_SELECTED;
  }
  // S6Context.debug("Template promptSelectedText, after", promptSelectedText);
  // if (!temperature || temperature == EMPTY) {
  //   temperature = "0.2";
  // }

  if (!fields) {
    fields = service.fields;
  }

  param.replaceJSON(PARAM.FIELDS, fields)
  var fieldMap = S6Utility.mapFields(fields);

  var title = DocumentApp.getActiveDocument().getName();
  console.log("call guessWritingType", title);
  var wt = writingStyleName != EMPTY ? writingStyleName : fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value == EMPTY? S6AITextProcessor.guessWritingType(title, fields, service.writing) : fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value;
  console.log("wt guessWritingType", wt);

  fieldMap[AI_FIELDS.INSTRUCTION].value = prompt == EMPTY ? fieldMap[AI_FIELDS.INSTRUCTION].value : prompt;
  fieldMap[AI_FIELDS.SELECTED_TEXT].value = promptSelectedText == EMPTY ? fieldMap[AI_FIELDS.SELECTED_TEXT].value : promptSelectedText;
  //fieldMap[AI_FIELDS.TEMPERATURE].value = temperature == EMPTY ? fieldMap[AI_FIELDS.TEMPERATURE].value : temperature;
  fieldMap[AI_FIELDS.BACKSTORY_USER].value = userContent == EMPTY ? fieldMap[AI_FIELDS.BACKSTORY_USER].value : userContent;
  fieldMap[AI_FIELDS.BACKSTORY_ASSITANCE].value = assistanceContent == EMPTY ? fieldMap[AI_FIELDS.BACKSTORY_ASSITANCE].value : assistanceContent;
  fieldMap[AI_FIELDS.USE_BACKSTORY].value = useBackstrory == EMPTY ? fieldMap[AI_FIELDS.USE_BACKSTORY].value : useBackstrory;
  fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value = wt; // writingStyleName;// == EMPTY ? fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value : writingStyleName;

  param.setValue(PROMPT_NAME_SELECTEDTEXT, YES_IF_SELECTED);

  section.addWidget(S6UIService.createInfoLabel("Instructions"));
  section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.INSTRUCTION]));

  sectionWritingStyle.addWidget(S6UIService.createIconLabel("<b>Writing Style</b>", "Expend ▼ to adjust style", ICON_BRUSH_URL));
  sectionWritingStyle.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE]));
  sectionWritingStyle.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.DOCUMENT_WRTING_CREATATIVITY]));
  sectionWritingStyle.setCollapsible(true);
  sectionWritingStyle.setNumUncollapsibleWidgets(1);
  S6UIService.createInfoSection("OPEN-AI-WRITING", sectionWritingStyle);
  for (const writingType in service.writing) {
    //sectionWritingStyle.addWidget(S6UIService.createLabel(`<b>${writingType}</b>: ${service.writing[writingType].DESCRIPTION}`));
    param.replaceValue(WRITING_STYLE_NAME, writingType);
    sectionWritingStyle.addWidget(S6UIService.createActionLabel(`<b>${writingType}</b>: ${service.writing[writingType].DESCRIPTION}`, EMPTY, EMPTY, actionEventReloadWritringStyle.name, param.toJSON(), ICON_REFRESH_URL));
  }

  param.replaceValue(WRITING_STYLE_NAME, EMPTY);

  if (userContent == EMPTY) {
    backstorySection.addWidget(S6UIService.createIconLabel("<b>Backstory</b>", "Expend ▼ to add context", ICON_QUOTE_URL));
    backstorySection.setCollapsible(true);
    backstorySection.setNumUncollapsibleWidgets(1);
    S6UIService.createInfoSection("BACKSTORY-INFO", backstorySection);
    backstorySection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.BACKSTORY_USER]));
  }
  else {
    backstorySection.addWidget(S6UIService.createIconLabel("<b>Backstory</b>", EMPTY, ICON_QUOTE_URL));
    backstorySection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.BACKSTORY_USER]));
    backstorySection.setCollapsible(true);
    backstorySection.setNumUncollapsibleWidgets(2);
    S6UIService.createInfoSection("BACKSTORY-INFO", backstorySection);
  }

  //section.addWidget(S6UIService.createDivider());

  section.addWidget(S6UIService.createInfoLabel("Response Settings"));
  section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.SELECTED_TEXT]));
  section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.ANSWER_REPLACES_TEXT]));
  section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.COLOR_TEXT]));
  section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.USE_BACKSTORY]));


  var tempSection = S6UIService.createSection();
  tempSection.setCollapsible(true);
  tempSection.setNumUncollapsibleWidgets(1);
  tempSection.addWidget(S6UIService.createIconLabel("<b>Instruction Templates</b>", "Expend ▼ to select a template", ICON_QUOTE_URL));


  for (let t = 0; t < service.templates.length; t++) {
    const template = service.templates[t];
    param.replaceValue(PROMPT, template[AI_FIELDS.AI_TEMPLATE.PROMPT]);
    param.replaceValue(PROMPT_NAME, template[AI_FIELDS.AI_TEMPLATE.NAME]);
    param.replaceValue(PROMPT_NAME_SELECTEDTEXT, template[AI_FIELDS.AI_TEMPLATE.SELECTED_TEXT]);
    param.replaceValue(PROMPT_TEMPERATURE, template[AI_FIELDS.AI_TEMPLATE.TEMPERATURE]);
    tempSection.addWidget(S6UIService.createActionLabel(template[AI_FIELDS.AI_TEMPLATE.NAME], template[AI_FIELDS.AI_TEMPLATE.HINT], EMPTY, actionEventReloadInstruction.name, param.toJSON(), ICON_REFRESH_URL));
  }

  param.replaceValue(PROMPT, EMPTY);
  param.replaceValue(PROMPT_NAME, EMPTY);
  param.replaceValue(PROMPT_NAME_SELECTEDTEXT, EMPTY);
  param.replaceValue(PROMPT_TEMPERATURE, EMPTY);

  backstorySection.addWidget(S6UIService.createLabel("Backstory Templates"));
  backstorySection.addWidget(S6UIService.createDivider());

  for (let t = 0; t < service.backstories.length; t++) {
    const backstory = service.backstories[t];
    param.replaceValue(BACKSTORY_USER_CONTENT, backstory[AI_FIELDS.AI_BACKSTORY.USER_CONTENT]);
    param.replaceValue(BACKSTORY_NAME, backstory[AI_FIELDS.AI_BACKSTORY.NAME]);
    param.replaceValue(BACKSTORY_ASSISTANCE_CONTENT, backstory[AI_FIELDS.AI_BACKSTORY.USER_ASSISTANCE]);
    param.replaceValue(USE_BACKSTORY, YES);
    backstorySection.addWidget(S6UIService.createActionLabel(backstory[AI_FIELDS.AI_BACKSTORY.NAME], backstory[AI_FIELDS.AI_BACKSTORY.HINT], EMPTY, actionEventReloadBackstory.name, param.toJSON(), ICON_REFRESH_URL));
  }
  param.replaceValue(BACKSTORY_USER_CONTENT, EMPTY);
  param.replaceValue(BACKSTORY_NAME, EMPTY);
  param.replaceValue(BACKSTORY_ASSISTANCE_CONTENT, EMPTY);
  param.replaceValue(USE_BACKSTORY, EMPTY);

  var advSection = S6UIService.createSection();
  advSection.setCollapsible(true);
  advSection.setNumUncollapsibleWidgets(1);
  advSection.addWidget(S6UIService.createIconLabel("<b>Advanced Settings</b>", "Expend ▼ to see settings", ICON_APP_SETTINGS_URL));
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.ENDPOINT]));
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.CHAT_MODEL]));
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.TEXT_MODEL]));
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.EDIT_MODEL]));


  advSection.addWidget(S6UIService.createDivider());
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.N]));
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.BEST_OF]));
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.SUFFIX]));
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.TOP_P]));
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.PRESENCE_PENALTY]));
  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.FREQUENCY_PENALTY]));

  advSection.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.MAX_TOKENS]));
  advSection.addWidget(S6UIService.createDivider());
  S6UIService.createInfoSection("OPEN-AI-ADVANCED", advSection);

  res.addSection(section);
  res.addSection(helpInfoSection);
  //res.addSection(sectionSettings)
  res.addSection(tempSection);
  res.addSection(backstorySection);
  res.addSection(sectionWritingStyle);
  res.addSection(advSection);

  var canBut = S6UIService.createCancelButton("BACK");
  var confirmBut = S6UIService.createCreateButton("PROCESS", actionDoAITextProcessor.name, param.toJSON());
  res.setFixedFooter(S6UIService.createFooter(confirmBut, canBut));

  return res.build();

}

function buildReloadWritingStyleView(param) {
  var name = param.getValue(WRITING_STYLE_NAME);
  S6Context.debugFn("buildReloadWritingStyleView", name);

  var card = bulildAITextProcessorView(param, false);
  var notify = CardService.newNotification().setText(`${name} writing style applied.`);
  var navigation = CardService.newNavigation();
  navigation.updateCard(card);
  return CardService.newActionResponseBuilder()
    .setNavigation(navigation)
    .setNotification(notify)
    .build();

}

function buildReloadInstructionView(param) {
  var name = param.getValue(PROMPT_NAME);
  var temp = param.getValue(PROMPT_TEMPERATURE);
  S6Context.debugFn("buildReloadInstructionView", name, temp);

  var card = bulildAITextProcessorView(param, false);
  var notify = CardService.newNotification().setText(`${name} instruction template applied.`);
  var navigation = CardService.newNavigation();
  navigation.updateCard(card);
  return CardService.newActionResponseBuilder()
    .setNavigation(navigation)
    .setNotification(notify)
    .build();
}
function buildReloadBackstortyView(param) {
  var name = param.getValue(BACKSTORY_NAME);
  var userContent = param.getValue(BACKSTORY_USER_CONTENT);
  S6Context.debugFn("buildReloadBackstortyView", name, userContent);

  var card = bulildAITextProcessorView(param, false);
  var notify = CardService.newNotification().setText(`${name} backstory template applied.`);
  var navigation = CardService.newNavigation();
  navigation.updateCard(card);
  return CardService.newActionResponseBuilder()
    .setNavigation(navigation)
    .setNotification(notify)
    .build();
}

function _tokensLen(text = EMPTY) {
  return (text.match(/[^\s]/g) || []).length;
}

function _calculateInputTokens(input, aiService) {
  const count = _tokensLen(input.text) + _tokensLen(input.backstoryUser) + _tokensLen(input.backstoryAssistance);
  const letters_per_token = parseFloat(aiService.properties[AI_FIELDS.AI_PROPERTES.LETTERS_PER_TOKEN]);
  const max = parseFloat(aiService.properties[AI_FIELDS.AI_PROPERTES.MAX_TOKENS]);

  const estimate_prompt_tokens = parseInt(count / letters_per_token);
  const max_tokens = max - estimate_prompt_tokens;

  input.estimate_prompt_tokens = estimate_prompt_tokens;
  input.max_tokens = max_tokens;
}


function bulildDoAITextProcessorView(param) {
  var res = S6UIService.createCard("ChatGPT", "Process result", ICON_OPEN_AI_URL);
  let vars = {
    edit_model: EMPTY,
    text_model: EMPTY,
    chat_model: EMPTY,
    selectedText: NO,
    color: EMPTY,
    selectedText: EMPTY,
    answerReplacesText: NO,
    formatOutput: false,
    writing_type: EMPTY,
    modifier: EMPTY,
    letters_per_token: 4,
    useBackstory: NO
  }
  let input = {
    instruction: EMPTY,
    endPoint: EMPTY,
    temperature: 1,
    model: EMPTY,
    text: EMPTY,
    max_tokens: 500,
    n: EMPTY,
    suffix: EMPTY,
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
    top_p: EMPTY,
    best_of: EMPTY,
    outputFormatPrompt: EMPTY,
    estimate_prompt_tokens: 0,
    backstoryUser: EMPTY,
    backstoryAssistance: EMPTY,
    systemMessage: EMPTY
  }
  const aiService = S6AITextProcessor.newS6AITextProcessor();
  input.systemMessage = aiService.properties[AI_FIELDS.AI_PROPERTES.SYSTEM_CONTENT];

  console.log("aiService.properties", aiService.properties);

  let pricePerK = 0.0;
  let cost = 0.0;
  var fields = param.getJSON(PARAM.FIELDS);
  var notification = S6UIService.validateFields(fields);
  if (notification) {
    return notification;
  }
  var fieldMap = S6Utility.mapFields(fields);
  input.instruction = fieldMap[AI_FIELDS.INSTRUCTION].value;
  var variables = S6AITextProcessor.findUserVariables(input.instruction);
  console.log("start it");
  if (variables.length > 0) {
    return S6UIService.createNotification("You need to replace " + variables + " in your Instructions.");
  }

  vars.color = fieldMap[AI_FIELDS.COLOR_TEXT].value == YES ? aiService.properties[AI_FIELDS.AI_PROPERTES.COLOUR] : EMPTY;
  vars.writing_type = fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value;
  vars.modifier = fieldMap[AI_FIELDS.DOCUMENT_WRTING_CREATATIVITY].value;
  vars.useBackstory = fieldMap[AI_FIELDS.USE_BACKSTORY].value;

  input.frequency_penalty = aiService.writing[vars.writing_type][vars.modifier][AI_WRITING_CONFIG.FREQUENCY_PENALTY];
  input.presence_penalty = aiService.writing[vars.writing_type][vars.modifier][AI_WRITING_CONFIG.PRESENCE_PENALTY];
  input.temperature = aiService.writing[vars.writing_type][vars.modifier][AI_WRITING_CONFIG.TEMPERATURE];
  input.endPoint = fieldMap[AI_FIELDS.ENDPOINT].value;
  input.backstoryUser = vars.useBackstory == YES ? fieldMap[AI_FIELDS.BACKSTORY_USER].value : EMPTY;
  input.backstoryAssistance
    = S6Utility.trim(fieldMap[AI_FIELDS.BACKSTORY_USER].value) == EMPTY ? EMPTY : aiService.properties[AI_FIELDS.AI_PROPERTES.ASSISTANCE_CONTENT];


  input.n = fieldMap[AI_FIELDS.N].value;
  input.best_of = fieldMap[AI_FIELDS.BEST_OF].value;
  vars.edit_model = fieldMap[AI_FIELDS.EDIT_MODEL].value;
  vars.text_model = fieldMap[AI_FIELDS.TEXT_MODEL].value;
  vars.chat_model = fieldMap[AI_FIELDS.CHAT_MODEL].value;
  vars.selectedText = fieldMap[AI_FIELDS.SELECTED_TEXT].value;
  vars.answerReplacesText = fieldMap[AI_FIELDS.ANSWER_REPLACES_TEXT].value;
  input.suffix = fieldMap[AI_FIELDS.SUFFIX].value;
  input.top_p = fieldMap[AI_FIELDS.TOP_P].value;


  console.log("aiService.properties", aiService.properties);

  let models;
  if (input.endPoint == OPEN_AI.TEXT_PROCESS_ENDPOINTS.COMPLETIONS) {
    input.model = vars.text_model;
    models = OPEN_AI_MODELS_COMPLETES;
  }
  else if (input.endPoint == OPEN_AI.TEXT_PROCESS_ENDPOINTS.CHAT) {
    input.model = vars.chat_model;
    models = OPEN_AI_MODELS_CHAT;
  }
  else {
    input.model = vars.edit_model;
    models = OPEN_AI_MODELS_EDITS
  }

  for (var m = 0; m < models.length; m++) {
    console.log(models[m].PRICE_PER_1000_TOKENS);
    if (models[m].MODEL_NAME == input.model) {
      pricePerK = models[m].PRICE_PER_1000_TOKENS;
      //vars.max_tokens = models[m].MAX_TOKEN;
      break;
    }
  }
  var aDoc = DocumentApp.getActiveDocument();
  var doc = S6DocumentAdapater.create(aDoc.getId());

  if (vars.selectedText != NO) {
    input.text = doc.getSelectedText(true);
    if (input.text == EMPTY && vars.selectedText == ALWAYS) {
      return S6UIService.createNotification("Instructions NOT processed. You have to selected text in the document as input to the instruction. Or change the Selected Text option.");
    }
    _calculateInputTokens(input, aiService);
  }
  S6Context.debug("Vars", vars);
  S6Context.debug("Input", input);

  var response = OpenAIService.processText(input);

  var sectionHeader = S6UIService.createSection();
  var tecSection = S6UIService.createSection("<b>Technical Information</b>");
  var sectionHTTP = tecSection;
  if (response.responseStatus.statusCode >= 200 & response.responseStatus.statusCode < 300) {
    var lab = S6UIService.createIconLabel("<b>Success.</b>");
    lab.setStartIcon(makeIcon(ICON_TASKS_URL));
    sectionHeader.addWidget(lab);
    sectionHeader.addWidget(S6UIService.createIconLabel(`<b>Time to execute:</b> ${(response.responseStatus.time / 1000).toFixed(2)} seconds`));
  }
  else {
    sectionHTTP = sectionHeader;
    var lab = S6UIService.createIconLabel(`<font color="${CANCEL_COLOUR}">Process Failed.</font>`);
    lab.setStartIcon(makeIcon(ICON_WARNING_URL));
    sectionHeader.addWidget(lab);
  }


  tecSection.setCollapsible(true);
  tecSection.setNumUncollapsibleWidgets(1);

  S6Context.debug("Input", input);
  input["Selected text count"] = `${input.text.length} characters`;

  tecSection.addWidget(S6UIService.createLablesFromJson(input, "User Input"));
  tecSection.addWidget(S6UIService.createDivider());
  if (response.payload) {
    S6Context.debug("Payload", response.payload);
    tecSection.addWidget(S6UIService.createLablesFromJson(S6Utility.flattenJSON(response.payload), "OpenAI Payload"));
    tecSection.addWidget(S6UIService.createDivider());
  }

  var output = response.output;
  if (output) {
    if (output.choices) {
      if (output.choices.length == 1) {
        doc.parseText2Document(output.choices[0].text, vars.answerReplacesText == YES, vars.color);
      }
      else {
        // go backwards through the choices beceduase the document inserts them in the reverse order
        for (let c = output.choices.length - 1; c > -1; c--) {
          console.log("Best of choices:", c, output.choices[c])
          doc.update(`\n[OpenAI, n=${c + 1}]` + _addDoubleLineFeed(output.choices[c].text), vars.answerReplacesText == YES, vars.color);
          S6Context.trace(`[OpenAI, n=${c}]`, output.choices[c].text);
        }
      }
      let finish_reason = output.choices[0].finish_reason;
      let explain_finish_reason = EMPTY;
      if (finish_reason == "length") {
        explain_finish_reason = "not enough tokens."
      }
      else if (finish_reason == "stop") {
        explain_finish_reason = "the model reached a natural stopping point.";
      }
      else {
        explain_finish_reason = "unknown";
      }


      var outputToUI = S6Utility.flattenJSON(output);

      sectionHTTP.addWidget(S6UIService.createLablesFromJson(outputToUI, "OpenAI Output"));
      sectionHTTP.addWidget(S6UIService.createDivider());
      if (output.usage) {
        var tokensPerK = parseFloat(output.usage.total_tokens) / 1000.0;
        cost = (pricePerK * tokensPerK).toFixed(4);
        sectionHeader.addWidget(S6UIService.createLablesFromJson({
          "Used tokens": `${output.usage.total_tokens}`,
          "Cost per 1000 tokens": `${pricePerK} ¢`,
          "Cost USD": `${cost} ¢`
        }, "Cost"));
      }

    }
    else if (output.error) {
      var labOutput = S6UIService.createLablesFromJson({
        "Message": output.error.message,
        "Type": output.error.type,
        "Param": output.error.param,
        "Code": output.error.code,
      }, "Error Output");
      sectionHeader.addWidget(labOutput);
    }
  }
  var labHttps = S6UIService.createLablesFromJson({
    "Status code": response.responseStatus.statusCode,
    "Status name": response.responseStatus.statusName,
    "Error message": response.responseStatus.errorMessage,
    "Time to execute in ms": response.responseStatus.time,
    "Time to execute in seconds": (response.responseStatus.time / 1000).toFixed(2),
  }, "HTTPS Response");
  sectionHTTP.addWidget(labHttps);
  tecSection.addWidget(S6UIService.createDivider());
  tecSection.addWidget(S6UIService.createLablesFromJson(S6Utility.flattenJSON(response.headers), "HTTP Response Headers"));

  var canBut = S6UIService.createCancelButton(" ");
  var confirmBut = S6UIService.createCreateButton("BACK", S6UIService_actionGoBack.name);

  res.addSection(sectionHeader);
  res.addSection(tecSection);
  res.setFixedFooter(S6UIService.createFooter(confirmBut, canBut));

  return res.build();

}
/**
 * Function uses a regular expression that will find any instances of a period followed immediately by an upper case alpha character, with no space between the period and alpha character, and insert a double line feed between them:
 */
function _addDoubleLineFeed(str) {
  return str.replace(/(?<=\.)([A-Z])/g, "\n\n$1");
}



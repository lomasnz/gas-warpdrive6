const PROMPT = "PROMPT";
const PROMPT_NAME = "PROMPT-NAME";
const PROMPT_NAME_SELECTEDTEXT = "PROMPT-NAME-SELECTEDTEXT";
const PROMPT_RESPONSE_SIZE = "PROMPT-RESPONSE-SIZE-TEMPERATURE";
const BACKSTORY_USER_CONTENT = "BACKSTORY-USER-CONTENT";
const BACKSTORY_NAME = "BACKSTORY-NAME";
const USE_BACKSTORY = "USE-BACKSTORY";
const BACKSTORY_ASSISTANCE_CONTENT = "BACKSTORY-ASSISTANCE-CONTENT";
const WRITING_STYLE_NAME = "WRITING-STYLE-NAME";
const GPT4_STATUSES = {
  QUEUED: "queued",
  PROCESSING: "processing",
  SUCCESS: "success",
  ERROR: "error"
}
const GPT4_STATUS = {
  KEY_PREFIX: "gpt-4 open-ai",
  STATUS: {
    [GPT4_STATUSES.QUEUED]: "🟢 Queued\n⚫️ Process\⚫️ Complete",
    [GPT4_STATUSES.PROCESSING]: "🔵 Queued\n🟢 Processing\n⚫️ Complete",
    [GPT4_STATUSES.SUCCESS]: "🔵 Queued\n🔵 Pocessed\n🟢 Completed OK",
    [GPT4_STATUSES.ERROR]: "🔵 Queued\n🔵 Pocessed\n🔴 Error"
  }
}

const MODEL_SIZE_MESSAGE = {
  [AI_FIELDS.RESPONSE_SIZES.SMALL]: {
    msg:
      `You selected the <b>Small</b> response size. 
This option is faster but restricts the response to being smaller than the input. 
The Small size is ideal for summarizing text or answering brief questions.`
  },
  [AI_FIELDS.RESPONSE_SIZES.MEDIUM]: {
    msg:
      `You selected the <b>Medium</b> response size. 
While this option is quicker than larger sizes, it allows the response to be longer than the input.
The Medium size is suitable for tasks like rewriting text or answering extended questions.`
  },
  [AI_FIELDS.RESPONSE_SIZES.LARGE]: {
    msg:
      `You selected the <b>Large</b> response size. 
This option runs slower but enables the response to be much larger than the input.
The Large size is beneficial when generating more extensive text responses.`
  },
  [AI_FIELDS.RESPONSE_SIZES.MAX]: {
    msg:
      `You selected the <b>Maximum</b> response size. 
This option takes the longest to run but allows the response to be as lengthy as possible.
The Maximum size is optimal for creating the most extensive text responses.`
  }
};


function bulildAITextProcessorView(param) {
  var res = S6UIService.createCard("OpenAI GPT", "Answer questions, rewrite text", ICON_OPEN_AI_URL);

  var task = param.getValue(PARAM.TASK_TYPE);
  S6Context.info("bulildAITextProcessorView")
  S6Context.debug("Task type", task);

  var service = S6AITextService.newS6AITextService();

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
  var responseSize = param.getValue(PROMPT_RESPONSE_SIZE);

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
  var wt = writingStyleName != EMPTY ? writingStyleName : fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value == EMPTY ? S6AITextService.guessWritingType(title, fields, service.writing) : fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value;
  console.log("wt guessWritingType", wt);

  fieldMap[AI_FIELDS.INSTRUCTION].value = prompt == EMPTY ? fieldMap[AI_FIELDS.INSTRUCTION].value : prompt;
  fieldMap[AI_FIELDS.RESPONSE_SIZE].value = responseSize == EMPTY ? fieldMap[AI_FIELDS.RESPONSE_SIZE].value : responseSize;
  fieldMap[AI_FIELDS.SELECTED_TEXT].value = promptSelectedText == EMPTY ? fieldMap[AI_FIELDS.SELECTED_TEXT].value : promptSelectedText;
  //fieldMap[AI_FIELDS.TEMPERATURE].value = temperature == EMPTY ? fieldMap[AI_FIELDS.TEMPERATURE].value : temperature;
  fieldMap[AI_FIELDS.BACKSTORY_USER].value = userContent == EMPTY ? fieldMap[AI_FIELDS.BACKSTORY_USER].value : userContent;
  fieldMap[AI_FIELDS.BACKSTORY_ASSITANCE].value = assistanceContent == EMPTY ? fieldMap[AI_FIELDS.BACKSTORY_ASSITANCE].value : assistanceContent;
  fieldMap[AI_FIELDS.USE_BACKSTORY].value = useBackstrory == EMPTY ? fieldMap[AI_FIELDS.USE_BACKSTORY].value : useBackstrory;
  fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value = wt; // writingStyleName;// == EMPTY ? fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value : writingStyleName;

  param.setValue(PROMPT_NAME_SELECTEDTEXT, YES_IF_SELECTED);

  section.addWidget(S6UIService.createInfoLabel("Instructions"));
  section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.INSTRUCTION]));
  section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.MODEL]));
  section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.SELECTED_TEXT]));
  section.addWidget(S6UIService.createDivider());

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
  section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.RESPONSE_SIZE]));
  //section.addWidget(S6UIService.createInputFromField(fieldMap[AI_FIELDS.ANSWER_REPLACES_TEXT]));
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
    param.replaceValue(PROMPT_RESPONSE_SIZE, template[AI_FIELDS.AI_TEMPLATE.RESPONSE_SIZE]);
    tempSection.addWidget(S6UIService.createActionLabel(template[AI_FIELDS.AI_TEMPLATE.NAME], template[AI_FIELDS.AI_TEMPLATE.HINT], EMPTY, actionEventReloadInstruction.name, param.toJSON(), ICON_REFRESH_URL));
  }

  param.replaceValue(PROMPT, EMPTY);
  param.replaceValue(PROMPT_NAME, EMPTY);
  param.replaceValue(PROMPT_NAME_SELECTEDTEXT, EMPTY);
  param.replaceValue(PROMPT_RESPONSE_SIZE, EMPTY);

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
  var confirmBut = S6UIService.createCreateButton("PROCESS", actionDoAITextProcessor4.name, param.toJSON());
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
  S6Context.debugFn("buildReloadInstructionView", name);

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
  var max = OpenAIService.getTokensFormModel(input.model);
  const letters_per_token = parseFloat(aiService.properties[AI_FIELDS.AI_PROPERTES.LETTERS_PER_TOKEN]);
  const min_response_size = parseInt(aiService.properties[AI_FIELDS.AI_PROPERTES.MIN_RESPONSE_SIZE]);

  // number of words in the input 
  const count = _tokensLen(input.text) + _tokensLen(input.backstoryUser) + _tokensLen(input.backstoryAssistance);
  // count of words as token count 
  const estimate_prompt_tokens = parseInt(count / letters_per_token);
  input.estimate_prompt_tokens = estimate_prompt_tokens;
  // the factor to find the response size 
  let factor = aiService.getResponseSizeFactor(input.responseSize);
  factor = (!factor ? 1 : factor);
  let calcResponseSize = 0;

  calcResponseSize = Math.max(estimate_prompt_tokens * parseFloat(factor), min_response_size);
  input.max_tokens = parseInt(estimate_prompt_tokens + calcResponseSize);

  S6Context.debug("c_calculateInputTokens", max, count, letters_per_token, calcResponseSize);
  console.log("calcResponseSize", calcResponseSize);
  return { max, calcResponseSize };

}


function bulildGPT3ResponseView(input, vars, res) {

  const aiService = S6AITextService.newS6AITextService();
  input.systemMessage = aiService.properties[AI_FIELDS.AI_PROPERTES.SYSTEM_CONTENT];

  let pricePerK = 0.0;
  let cost = 0.0;

  var aDoc = DocumentApp.getActiveDocument();
  var doc = S6DocumentAdapater.create(aDoc.getId());

  if (vars.selectedText != NO) {
    input.text = doc.getSelectedText(true);
    if (input.text == EMPTY && vars.selectedText == ALWAYS) {
      return S6UIService.createNotification("Instructions NOT processed. You have to selected text in the document as input to the instruction. Or change the Selected Text option.");
    }
    var { max, calcResponseSize } = _calculateInputTokens(input, aiService);

    if (input.max_tokens < 0) {
      var factor = parseFloat(aiService.properties["LETTERS_PER_TOKEN"]);
      return S6UIService.createNotification(`The text you've selected is too long for this model to process. The model can handle approximately ${max / factor} words or ${parseInt(max * factor)} characters. Please reduce the size of your input text and try again.`)
    }
    var response = OpenAIService.processText(input);

    var sectionHeader = S6UIService.createSection();
    sectionHeader.addWidget(S6UIService.createParagraph(MODEL_SIZE_MESSAGE[input.responseSize].msg));
    sectionHeader.addWidget(S6UIService.createParagraph(`The response will be no more than aproximtaley <b>${parseInt(calcResponseSize)}</b> words.`));
    sectionHeader.addWidget(S6UIService.createDivider());

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
      tecSection.addWidget(S6UIService.createLablesFromJson(S6Utility.flattenJSON(response.payload), "OpenAI GPT Payload"));
      tecSection.addWidget(S6UIService.createDivider());
    }

    var output = response.output;
    if (output) {
      if (output.choices) {
        if (output.choices.length == 1) {
          doc.parseText2Document(output.choices[0].text, vars.answerReplacesText == YES, input.color);
        }
        else {
          // go backwards through the choices beceduase the document inserts them in the reverse order
          for (let c = output.choices.length - 1; c > -1; c--) {
            console.log("Best of choices:", c, output.choices[c])
            doc.update(`\n[OpenAI, n=${c + 1}]` + _addDoubleLineFeed(output.choices[c].text), vars.answerReplacesText == YES, input.color);
            S6Context.trace(`[OpenAI, n=${c}]`, output.choices[c].text);
          }
        }
        let finish_reason = output.choices[0].finish_reason;
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

        sectionHTTP.addWidget(S6UIService.createLablesFromJson(outputToUI, "OpenAI GPT Output"));
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
  }
  return res;

}

function bulildDoAITextProcessorView4(param) {
  var res = S6UIService.createCard("ChatGPT", "Process result", ICON_OPEN_AI_URL);
  let vars = {
    edit_model: EMPTY,
    text_model: EMPTY,
    chat_model: EMPTY,
    selectedText: NO,
    selectedText: EMPTY,
    formatOutput: false,
    writing_type: EMPTY,
    modifier: EMPTY,
    letters_per_token: 4,
    useBackstory: NO
  }
  let input = {
    responseSize: 1,
    color: EMPTY,
    answerReplacesText: NO,
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
    systemMessage: EMPTY,
    documentId: EMPTY,
    placeholder: `+ ${Utilities.formatDate(new Date(), param.getTimeZone(), "dd-M-yyyy hh:mm:ss")}`
  }
  const aiService = S6AITextService.newS6AITextService();
  input.systemMessage = aiService.properties[AI_FIELDS.AI_PROPERTES.SYSTEM_CONTENT];

  console.log("aiService.properties", aiService.properties);

  var fields = param.getJSON(PARAM.FIELDS);
  var notification = S6UIService.validateFields(fields);
  if (notification) {
    return notification;
  }
  var fieldMap = S6Utility.mapFields(fields);
  input.instruction = fieldMap[AI_FIELDS.INSTRUCTION].value;
  var variables = S6AITextService.findUserVariables(input.instruction);
  console.log("start it");
  // if (variables.length > 0) {
  //   return S6UIService.createNotification("You need to replace " + variables + " in your Instructions.");
  // }

  var modelAndEndpoint = (fieldMap[AI_FIELDS.MODEL].value).split("#");
  input.model = modelAndEndpoint[0];
  input.endPoint = modelAndEndpoint[1]

  input.color = fieldMap[AI_FIELDS.COLOR_TEXT].value == YES ? aiService.properties[AI_FIELDS.AI_PROPERTES.COLOUR] : EMPTY;
  vars.writing_type = fieldMap[AI_FIELDS.DOCUMENT_WRTING_TYPE].value;
  vars.modifier = fieldMap[AI_FIELDS.DOCUMENT_WRTING_CREATATIVITY].value;
  vars.useBackstory = fieldMap[AI_FIELDS.USE_BACKSTORY].value;

  input.frequency_penalty = aiService.writing[vars.writing_type][vars.modifier][AI_WRITING_CONFIG.FREQUENCY_PENALTY];
  input.presence_penalty = aiService.writing[vars.writing_type][vars.modifier][AI_WRITING_CONFIG.PRESENCE_PENALTY];
  input.temperature = aiService.writing[vars.writing_type][vars.modifier][AI_WRITING_CONFIG.TEMPERATURE];
  //input.endPoint = fieldMap[AI_FIELDS.ENDPOINT].value;
  input.backstoryUser = vars.useBackstory == YES ? fieldMap[AI_FIELDS.BACKSTORY_USER].value : EMPTY;
  input.backstoryAssistance
    = S6Utility.trim(fieldMap[AI_FIELDS.BACKSTORY_USER].value) == EMPTY ? EMPTY : aiService.properties[AI_FIELDS.AI_PROPERTES.ASSISTANCE_CONTENT];

  input.n = fieldMap[AI_FIELDS.N].value;
  input.responseSize = fieldMap[AI_FIELDS.RESPONSE_SIZE].value;
  input.best_of = fieldMap[AI_FIELDS.BEST_OF].value;
  vars.edit_model = fieldMap[AI_FIELDS.EDIT_MODEL].value;
  vars.text_model = fieldMap[AI_FIELDS.TEXT_MODEL].value;
  vars.chat_model = fieldMap[AI_FIELDS.CHAT_MODEL].value;
  vars.selectedText = fieldMap[AI_FIELDS.SELECTED_TEXT].value;
  input.answerReplacesText = fieldMap[AI_FIELDS.ANSWER_REPLACES_TEXT].value;
  input.suffix = fieldMap[AI_FIELDS.SUFFIX].value;
  input.top_p = fieldMap[AI_FIELDS.TOP_P].value;

  console.log("aiService.properties", aiService.properties);

  let models;
  if (input.endPoint == OPEN_AI.TEXT_PROCESS_ENDPOINTS.COMPLETIONS) {
    // input.model = vars.text_model;
    models = OPEN_AI_MODELS_COMPLETES;
  }
  else if (input.endPoint == OPEN_AI.TEXT_PROCESS_ENDPOINTS.CHAT) {
    // input.model = vars.chat_model;
    models = OPEN_AI_MODELS_CHAT;
  }
  else {
    // input.model = vars.edit_model;
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
  input.documentId = aDoc.getId();
  var doc = S6DocumentAdapater.create(aDoc.getId());

  if (vars.selectedText != NO) {
    input.text = doc.getSelectedText(true);
    if (input.text == EMPTY && vars.selectedText == ALWAYS) {
      return S6UIService.createNotification("Instructions NOT processed. You have to selected text in the document as input to the instruction. Or change the Selected Text option.");
    }
    var { max, calcResponseSize } = _calculateInputTokens(input, aiService);
    if (input.max_tokens < 0) {
      var factor = parseFloat(aiService.properties["LETTERS_PER_TOKEN"]);
      return S6UIService.createNotification(`The text you've selected is too long for this model to process. The model can handle approximately ${max / factor} words or ${parseInt(max * factor)} characters. Please reduce the size of your input text and try again.`)
    }
  }
  S6Context.debug("Vars", vars);
  S6Context.debug("Input", input);

  if (input.model === "gpt-3.5-turbo-0301") {
    res = S6UIService.createCard("OpenAI GPT", "Process result", ICON_OPEN_AI_URL);
    res = bulildGPT3ResponseView(input, vars, res);
    // return what would have been returned by bulildDoAITextProcessorView()
    res = res.build();
  }
  else if (input.model === "gpt-4") {
    doc.parseText2Document(input.placeholder, false, input.color);
    //doc.insert(input.placeholder, input.color, EMPTY, false);
    S6Hyperdrive.engage(processGPT4.name, input);
    input.calcResponseSize = calcResponseSize;
    param.setValue("input", JSON.stringify(input));
    res = displayGPT4ProgressView(param)
  }
  else {
    S6Context.warn(`Unknown model ${input.model}`);
  }
  return res;
}

function _displayGPT4ProgressStatus(event) {
  const param = new Param(event);
  return displayGPT4Progress(param);
}


function displayGPT4ProgressView(param) {
  var res;
  var card = S6UIService.createCard("OpenAI GPT", "Process result", ICON_OPEN_AI_URL);
  var section = S6UIService.createSection();
  const input = JSON.parse(param.getValue("input"));
  var status = param.getValue("status");
  if (status != YES) {
    section.addWidget(S6UIService.createParagraph(MODEL_SIZE_MESSAGE[input.responseSize].msg));
    section.addWidget(S6UIService.createParagraph(`The response will be no more than aproximtaley <b>${parseInt(input.calcResponseSize)}</b> words.`));
    section.addWidget(S6UIService.createDivider());
  }

  section.addWidget(S6UIService.createParagraph(
    `Your request to GPT-4 has been queued. Once complete, your document will be updated by replacing the following text:

${input.placeholder}`));
  section.addWidget(S6UIService.createDivider());
  var status = param.getValue("status");
  if (status != YES) {
    section.addWidget(S6UIService.createParagraph(
      `Currently, there are delays in processing requests as the GPT-4 model is rate-limited by OpenAI. This could result in waiting times exceeding 60 seconds. While GPT-4 offers superior performance compared to GPT-3, it is worth noting that GPT-3 is still highly capable in handling most tasks efficiently and providing faster responses. If you prefer a quicker reply, it is advisable to use the GPT-3 language model. Thank you for your patience.`
    ));

    section.addWidget(S6UIService.createDivider());
  }
  else {
  }
  param.setValue("status", YES);
  section.addWidget(S6UIService.createCreateButton("Status", "actionEventDisplayGPT4Progress", param.toJSON()));
  section.addWidget(S6UIService.createParagraph(_getGpt4Status(input.placeholder)));
  card.addSection(section);
  card.setFixedFooter(S6UIService.createFooter(S6UIService.createCreateButton("BACK"), S6UIService.createCancelButton(" ")));
  if (status == YES) {
    var arb = CardService.newActionResponseBuilder();
    arb.setNavigation(CardService.newNavigation().updateCard(card.build()));
    res = arb.build();
  }
  else {
    res = card.build();
  }
  return res;

}

function _setGpt4Status(placeholder, status, suffix = EMPTY) {
  S6Context.info("Set GPT4 Processing Status:", status);
  S6Cache.userCachePutString(GPT4_STATUS.KEY_PREFIX + placeholder, GPT4_STATUS.STATUS[status] + suffix);
}
function _getGpt4Status(placeholder) {
  var res = S6Cache.userCacheGetString(GPT4_STATUS.KEY_PREFIX + placeholder);
  return !res || res == EMPTY ? " " : res;
}
function processGPT4(input) {
  _setGpt4Status(input.placeholder, GPT4_STATUSES.QUEUED);
  console.log("Run processText", input);


  _setGpt4Status(input.placeholder, GPT4_STATUSES.PROCESSING);
  var response = OpenAIService.processText(input);

  var aDoc = DocumentApp.openById(input.documentId);
  var doc = S6DocumentAdapater.create(aDoc.getId());

  var output = response.output;
  var sucess = false;
  let usage = {};
  if (output) {
    if (output.choices) {
      if (output.choices.length == 1) {
        sucess = true;
        doc.parseTextInPlace(input.placeholder, output.choices[0].text, input.color);
        aDoc.saveAndClose();
      }
    }
    usage = output.usage;
  }
  if (sucess) {
    _setGpt4Status(input.placeholder, GPT4_STATUSES.SUCCESS);
  }
  else {
    _setGpt4Status(input.placeholder, GPT4_STATUSES.ERROR, output.error);
  }
  var results = { response: response, usage: usage };
  S6Cache.userCachePutJson(input.placeholder, results);

  S6Context.info("Status code:", response.responseStatus.statusCode,
    "Status name:", response.responseStatus.statusName,
    "Error message:", response.responseStatus.errorMessage,
    "Time to execute in ms:", response.responseStatus.time,
    "Time to execute in seconds:", (response.responseStatus.time / 1000).toFixed(2));

}
/**
 * Function uses a regular expression that will find any instances of a period followed immediately by an upper case alpha character, with no space between the period and alpha character, and insert a double line feed between them:
 */
function _addDoubleLineFeed(str) {
  return str.replace(/(?<=\.)([A-Z])/g, "\n\n$1");
}

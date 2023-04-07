const BOILERPLATE = {
  MASTER_SHEET_NAME: "BOILERPLATES",
  ID: "id",
  NAME: "name",
  URL: "url",
  HINT: "hint",
  HEADERS_AND_FOOTERS: "haedersAndFooters",
  TITLE: "title",
  INFO: "info"
}


class S6BoilerplateService {

  static instance() {
    if (!S6BoilerplateService._instance) {
      S6BoilerplateService._instance = S6BoilerplateService.newS6BoilerplateService();
    }
    return S6BoilerplateService._instance;
  }

  constructor(docs, secret) {
    if (secret != "#PRIVATE") {
      throw "Use the factory functions starting with new...(). Do not construct your own S6BoilerPlateService";
    }
    this.docs = docs;
    Object.freeze(this.docs);
    Object.freeze(this);
  }

  static newS6BoilerplateService() {
    var res;
    var json;

    json = S6Cache.userCacheGetJson(S6BoilerplateService._cacheName());
    if (!json) {
      json = S6BoilerplateService._create();
      const jsonString = JSON.stringify(Object.assign({}, json));
      json = JSON.parse(jsonString);
      S6Context.debug("Cache miss:", S6BoilerplateService._cacheName(), json);
      S6Cache.userCachePutJson(S6BoilerplateService._cacheName(), json);
    }
    else {
      S6Context.debug("Cache hit:", S6BoilerplateService._cacheName(), json);
    }
    res = new S6BoilerplateService(json, "#PRIVATE");
    return res;
  }

  static _cacheName() {
    return "boilerplate";
  }
  static _create() {
    var res = [];
    var masterUrl = PropertiesService.getUserProperties().getProperty(USER_PROPERTY_MASTER_URL);
    var master = SpreadsheetApp.openByUrl(masterUrl);
    var sheet = master.getSheetByName(BOILERPLATE.MASTER_SHEET_NAME);
    if (sheet == null) {
      S6Context.warn(`Spreadsheet does not contain a sheet named [${BOILERPLATE.MASTER_SHEET_NAME}]`);
    }
    else {
      var values = sheet.getRange("A:E").getValues();
      var title = EMPTY;
      for (var i = 1; i < values.length; i++) {
        var name = values[i][0];
        var url = S6Utility.trim(values[i][2]);
        if (S6Utility.trim(name) != EMPTY  ) {
          var hint = S6Utility.trim(values[i][1]);
          if (S6Utility.trim(url) != EMPTY) {
        
            var hf = S6Utility.trim(values[i][3]);
            var info = S6Utility.trim(values[i][4]);
            hf = hf == YES ? YES : hf == NO ? NO : NO;

            var id = S6Utility.getIdFromUrl(url);

            res[id] = {
              [BOILERPLATE.ID]: id, [BOILERPLATE.NAME]: name, [BOILERPLATE.URL]: url, [BOILERPLATE.HINT]: hint,
              [BOILERPLATE.HEADERS_AND_FOOTERS]: hf, [BOILERPLATE.TITLE]: title, [BOILERPLATE.INFO]: info
            };
          }
          else {
            title = name;
          }
        }
      }
    }
    S6Context.trace("newS6BoilerplateService_create", res);
    return res;
  }

  static applyBoilerplate(boilerplateId, doc, headersAndFooters = false) {
    var res = true;
    var bolierplateDoc = DocumentApp.openById(boilerplateId);
    try {
      var element;
      var postion = doc.getCursor();
      if (!postion) {
        var re = doc.getSelection();
        if (re) {
          element = re[0];
        }
      }
      else {
        element = postion.getElement();
      }
      var body = doc.getBody();
      var childIndex = 0;
      try {
        childIndex = !element ? 0 : body.getChildIndex(element);
      }
      catch (err) {
        S6Context.error(err.stack);
        S6Context.error(err);
      }
      S6Context.debug("applyBoilerplate at:", childIndex);

      console.log("Merge in Body");
      S6BoilerplateService._loopElements(bolierplateDoc.getBody(), body, childIndex);

      S6Context.debug("applyBoilerplate headersAndFooters:", headersAndFooters);
      if (headersAndFooters) {
        var footer = doc.getFooter();
        var header = doc.getHeader();
        if (!footer && bolierplateDoc.getFooter()) {
          footer = doc.addFooter();
        }
        if (bolierplateDoc.getFooter()) {
          console.log("Merge in Fotter");
          S6BoilerplateService._loopElements(bolierplateDoc.getFooter().copy(), footer);
        }
        if (!header && bolierplateDoc.getHeader()) {
          header = doc.addHeader();
        }
        if (bolierplateDoc.getHeader()) {
          console.log("Merge in Header");
          S6BoilerplateService._loopElements(bolierplateDoc.getHeader().copy(), header);
        }
      }
    }
    catch (err) {
      res = false;
      S6Context.error(err.stack);
      S6Context.error(err);
    }
    return res;

  }

  static _loopElements(parent, base, childIndex = 0) {
    if (parent) {
      var totalElements = parent.getNumChildren();
      S6Context.trace("_loopElements:total:", totalElements);
      for (var j = totalElements - 1; j > -1; j--) {
        S6Context.trace("_loopElements:next", j);
        S6BoilerplateService._mergeElements(parent.getChild(j).copy(), base, childIndex);
      }
    }
    else {
      S6Context.debug("skip _loopElements, no parent");
    }
  }
  static _mergeElements(element, base, childIndex = 0) {
    var type = element.getType();
    console.log("Merge type:", type.toString());
    if (type == DocumentApp.ElementType.PARAGRAPH) {
      base.insertParagraph(childIndex, element);
      //base.appendParagraph(element);
    }
    else if (type == DocumentApp.ElementType.TABLE) {
      base.insertTable(childIndex, element)
      //base.appendTable(element);
    }
    else if (type == DocumentApp.ElementType.LIST_ITEM) {
      base.insertListItem(childIndex, element);
      //base.appendListItem(element);
    }
    else if (type == DocumentApp.ElementType.PAGE_BREAK) {
      base.insertPageBreak(childIndex);
      //base.appendPageBreak();
    }
    else if (type == DocumentApp.ElementType.HORIZONTAL_RULE) {
      base.insertHorizontalRule(childIndex);
      //base.appendHorizontalRule();
    }
    else if (type == DocumentApp.ElementType.INLINE_IMAGE) {
      base.insertImage(childIndex, element);
      base.appendImage(element);
    }
    else if (type == DocumentApp.ElementType.INLINE_DRAWING) {
      //base.appendImage(element);
    }
    // else if (type == DocumentApp.ElementType.FOOTNOTE) {
    //   base.appendFootnote(element);
    // }
    else if (type == DocumentApp.ElementType.FOOTER_SECTION) {
      var f = element.asFooterSection();
      S6BoilerplateService._loopElements(f, base, childIndex)
    }

    else if (type == DocumentApp.ElementType.HEADER_SECTION) {
      var h = element.asHeaderSection();
      S6BoilerplateService._loopElements(h, base, childIndex)
    }
    else throw new Error('Unknown element type: ' + type);
  }


}
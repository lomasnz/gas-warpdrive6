const TEMPLATE_LOOKUP = {
  LOOKUP: "lookup",
  URL: "url"
}
class S6MasterTemplate {

  constructor(json, secret) {
    if (secret != "#PRIVATE") {
      throw "Use the factory functions starting with new...(). Do not construct your own S6Master";
    }
    this.templates = json;
    Object.freeze(this.templates);
    Object.freeze(this);
  }

  static lookupUrl(templateName, fields) {
    S6Context.debug("lookupUrl(", templateName,",", fields, ")");
    var master = S6MasterTemplate.new();
    var res = EMPTY;
    if (templateName) {
      if (templateName.startsWith("https://")) {
        res = templateName;
      }
      else {
        if (templateName.indexOf("{") >= 0 && fields) {
          for (var field in fields) {
            var value = fields[field][ENTITY.FIELD_ATTR.VALUE];
            templateName = templateName.replaceAll(fields[field][ENTITY.FIELD_ATTR.FIELD_NAME], value);
            if (templateName.indexOf("{") < 0) {
              break;
            }
          }
        }
        templateName = templateName.toLowerCase();

        for (var t = 0; t < master.templates.length; t++) {
          var temp = master.templates[t][TEMPLATE_LOOKUP.LOOKUP].toLowerCase();
          S6Context.debug("lookupUrl=>",templateName,temp);
          if (temp == templateName) {
            res = master.templates[t][TEMPLATE_LOOKUP.URL];
            break;
          }
        }
        ////console.log("lookup(", templateName, ") =>", res);
      }
    }
    return res;
  }

  static new(masterUrl = EMPTY, cache = true) {
    var res;
    var json;
    if (masterUrl == EMPTY) {
      masterUrl = PropertiesService.getUserProperties().getProperty(USER_PROPERTY_MASTER_URL);
    }
    let masterId = S6Utility.getIdFromUrl(masterUrl);

    if (cache) {
      json = S6Cache.userCacheGetJson(S6MasterTemplate._cacheName(masterId));
      if (json) {
        res = new S6MasterTemplate(json, "#PRIVATE");
      }
    }
    if (!res) {
      json = S6MasterTemplate._listTemplates(masterId, cache);
      res = new S6MasterTemplate(json, "#PRIVATE");
      S6Cache.userCachePutJson(S6MasterTemplate._cacheName(masterId), json);
    }
    return res;
  }
  static _cacheName(masterId) {
    return "S6MasterTemplate:" + masterId;
  }

  static _listTemplates(masterId) {
    S6Validate.mandatory("masterId", masterId);
    var res = [];
    var masterSpreadsheet = SpreadsheetApp.openById(masterId);
    console.info("Opened:", masterId);
    try {
      var masterSheet = masterSpreadsheet.getSheetByName("TemplateLookup");
      var range = masterSheet.getRange("A:B");
      var values = range.getValues();
      let itemCount = 0;
      // start at row 1 to skip header
      for (var i = 1; i < values.length; i++) {
        let lookup = S6Utility.trim(values[i][0]);
        let url = S6Utility.trim(values[i][1]);
        if (url != EMPTY) {
          res[itemCount++] = { [TEMPLATE_LOOKUP.LOOKUP]: lookup, [TEMPLATE_LOOKUP.URL]: url };
        }
      }
    }
    catch (err) {
      console.error(err.stack);
      console.warn("Spreadsheet Not found. It's assumed the user does not have access to it. Error:\n" + err + "\nID:" + masterId);
    }

    return res;
  }
}

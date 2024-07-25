const PROPERTIES = {
  GLOABL: "global",
  ATTR: {
    PROP_ID: "fieldId",
    PROP_NAME: "propName",
    FIELD: "field",
    TYPE: "type",
    TITLE: "title",
    HINT: "hint",
    EDITABLE: "editable",
    EMPTY_MEANS_EMPTY: "emptyMeansEmpty",
    ORGINAL_VALUE: "orginalValue",
    VALUE: "value",
    SOURCE: "source",
    FIELD_SOURCE: "fieldSource",
    VISIBLE: "visible",
    APPLY: "apply",
    SELECTOR: DATA_TYPE_SELECTOR,
    SELECTOR_MAP: "selectorMap",
    SELECTOR_LIST: "selectorList",
    SELECTOR_DISPLAY: "selectorDisplay"
  },
  ORG: {
    NZBN: "nzbn",
    ABN: "abn",
    ORG_LINK: "pipedrive.link",
    NUMBER_TYPE: "number.type",
    NUMBER: "number",
    NAME: "name",
    TYPE: "type",
    PHONE_NUMBER: "phone.number",
    EMAIL_ADDRESS: "email.address",
    TYPE_DESCTRIPTION: "type.description",
    STATUS_DESCRIPTION: "status",
    ADDRESS: "address",
    ADDRESS_TYPE: "address.type",
    OTHER_TERMS: "other.terms"
  },
  COLUMNS: {
    PROP_ID: 0,
    TYPE: 1,
    TITLE: 2,
    HINT: 3,
    EDITABLE: 4,
    EMPTY_MEANS_EMPTY: 5,
    VALUE: 6
  },
  TYPES: {
    INFO: "info",
    NOT_FOUND: "noFound",
    TEXT: "text",
    INPUT_LIST: "inputList",
    TODAY: "today",
    DATE_PRINTABLE: "datePrintable",
    FIELDS: "fields",
    FIELD: "field",
    ORGANISATION: "organisation",
    PSEUDO_GUID: "pseudoGuid",
    ENTITY_LOGO: "entityLogo",
    IMAGE_LINK: "imageLink",
    RED_HAT_ACCOUNT_NUMBER: "redhatAccount",
    PAIREDLIST: "pairedlist",
    PIPEDRIVE_DEALS_IDS: "pipedrive.deals.ids",
    HARVEST_PROJECTS_IDS: "harvest.projects.ids",
    PIPEDRIVE_MSA: "pipedrive.msa",
    SELECTOR: "selector",
    SELECTED: "selected",
    LINK: "link",
    YOU: "you"
  },
  SHEET_ENTITY_PROPOERTIES: "ENTITY PROPERTIES",
  STANDARD: "STANDARD",
  AUTOMATIC: "AUTOMATIC",
  SHEET_GLOBAL: "GLOBAL PROPERTIES",
  SHEET_PROP_DEFAULT: "DEFAULT",
  SHEET_VALUES: "VALUES",
  SHEET_LOCAL: "LOCAL"
}

class S6PropertyService {

  /**
   * Private constructor. Not to be used directly.
   */
  constructor(json, entity, nameSpace, instance, secret) {
    if (secret != "#PRIVATE") {
      throw "Use the factory functions starting with new...(). Do not construct your own S6Entity";
    }
    this.properties = json;
    this.entity = entity;
    this.instance = instance;
    this.nameSpace = nameSpace;
    Object.freeze(this.properties);
    Object.freeze(this);
  }

  isEnityOnly() {
    return this.instance == null;
  }

  isEnityAndInstanceOnly() {
    return this.instance != null;
  }

  static newForApplyProperties(id, nameSpace, cache = true) {
    var instance;
    var entity;
    if (nameSpace != PROPERTIES.GLOABL) {
      instance = S6EntityInstance.newFromFolderId(id, nameSpace);
      entity = instance.entity;
    }
    return this._new(entity, instance, true, cache);
  }

  static newForBuild(nameSpace, cache = true) {
    var entity;
    if (nameSpace != PROPERTIES.GLOABL) {
      entity = S6Entity.newFromNameSpace(nameSpace, cache);
    }
    return S6PropertyService._new(entity, null, false, cache);
  }

  static _new(entity, instance, forApplication = true, cache = true) {
    var res;
    var cacheId = instance ? instance.instanceId : EMPTY;
    const nameSpace = !entity ? PROPERTIES.GLOABL : entity.entityNameSpace;

    S6Context.debugFn(S6PropertyService.newFromEntity, cache);
    S6Context.time(S6PropertyService.timerName(nameSpace, cacheId));

    var builder = new S6PropertyServiceBuilder(forApplication, nameSpace);

    var json = builder.create(nameSpace, entity, instance, cache);
    res = new S6PropertyService(json, entity, nameSpace, instance, "#PRIVATE");

    S6Context.timeEnd(S6PropertyService.timerName(nameSpace, cacheId));
    return res;
  }
  // static newFromEntity(entity, cache = true) {
  //   return S6PropertyService._new(entity, null, cache);
  // }

  static timerName(name, id) {
    return "S6PropertyEntity:" + name + ":id:" + id;
  }

}
class S6PropertyServiceBuilder {

  constructor(forApplication = false, nameSpace) {
    this._forApplication = forApplication;
    this._nameSpace = nameSpace;
  }
  isForApplication() {
    return this._forApplication;
  }
  getNameSpace() {
    return this._nameSpace;
  }
  isForGlobalApplication() {
    return this.isForApplication() && getNameSpace() == PROPERTIES.GLOABL;
  }
  isForGlobalBuild() {
    return !this.isForApplication() && getNameSpace() == PROPERTIES.GLOABL;
  }

  _getSpreadSheet(instance, templateName) {
    var res;
    const root = S6DriveApp.getFolderById(instance.entity.config[ENTITY.ROOT_DIRECTORY_ID]);
    const file = S6Utility.getFileFromRootFolderAndFromPath(root, templateName);
    if (file) {
      res = SpreadsheetApp.openById(file.getId());
    }
    return res;
  }

  create(nameSpace, entity, instance, cache = true) {
    var res = [];
    var valuesGlobalRange = this._getSheetProps(EMPTY, PROPERTIES.SHEET_GLOBAL, "A:G", cache);
    var valuesEntitysRange = this._getSheetProps(nameSpace, PROPERTIES.SHEET_ENTITY_PROPOERTIES, "A:G", cache);


    if (valuesEntitysRange && valuesEntitysRange.length > 0) {
      for (let j = 1; j < valuesEntitysRange.length; j++) {
        if (S6Utility.trim(valuesEntitysRange[j][0]) != EMPTY) {
          var ary = this._makeProperty(entity, instance, valuesEntitysRange[j], nameSpace, PROPERTIES.SHEET_ENTITY_PROPOERTIES);
          if (ary) {
            for (let a = 0; a < ary.length; a++) {
              res[res.length] = ary[a]
            }
          }
        }
      }
    }
    else {
      if (nameSpace != PROPERTIES.GLOABL) {
        var ary = this._propertyValueForFields(nameSpace, PROPERTIES.SHEET_ENTITY_PROPOERTIES, entity, instance, "this");
        for (let a = 0; a < ary.length; a++) {
          res[res.length] = ary[a]
        }
      }
    }
    for (let g = 1; g < valuesGlobalRange.length; g++) {
      if (S6Utility.trim(valuesGlobalRange[g][0]) != EMPTY) {
        var ary = this._makeProperty(entity, instance, valuesGlobalRange[g], PROPERTIES.GLOABL, PROPERTIES.SHEET_GLOBAL);
        for (let a = 0; a < ary.length; a++) {
          res[res.length] = ary[a]
        }
      }
    }
    if (instance) {
      for (var r = 0; r < res.length; r++) {
        S6Context.trace("replace text in ", res[r][PROPERTIES.ATTR.TYPE]);
        res[r][PROPERTIES.ATTR.TYPE] = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], res[r][PROPERTIES.ATTR.TYPE]);
        S6Context.trace("replaced ", res[r][PROPERTIES.ATTR.TYPE]);
      }
    }
    return res;

  }



  static makePropoertyName(nameSpace, propId) {
    var newNameSpace = nameSpace == EMPTY ? EMPTY : `${nameSpace}#`;
    return `{${newNameSpace}${propId}}`;
  }

  _makeProperty(entity, instance, sheetValue, nameSpace, source) {
    var res = [];
    var type = S6UIService.canonicalType(S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.TYPE]));

    S6Context.debug("Making properties of type:", type);
    switch (type) {
      case (PROPERTIES.TYPES.YOU):
        res = this._propertyValueForYou(instance, nameSpace, source, S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]));
        break;
      case (PROPERTIES.TYPES.IMAGE_LINK):
        res = this._propertyValueImageLink(sheetValue, nameSpace, instance, source);
        break;
      case (PROPERTIES.TYPES.ENTITY_LOGO):
        res = this._propertyValueEntityLogo(sheetValue, nameSpace, source, entity, instance, true);
        break;
      case (PROPERTIES.TYPES.TODAY):
        res = this._propertyValueForToday(sheetValue, instance, nameSpace, source, S6UIService.typeParameters(sheetValue[PROPERTIES.COLUMNS.TYPE]));
        break;
      case (PROPERTIES.TYPES.FIELDS):
        res = this._propertyValueForFields(nameSpace, source, entity, instance, S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]));
        break;
      case (PROPERTIES.TYPES.RED_HAT_ACCOUNT_NUMBER):
        res = this._propertyValuesForRedHatAccountNumber(nameSpace, source, instance, S6UIService.typeParameters(sheetValue[PROPERTIES.COLUMNS.TYPE]), sheetValue);
        break;
      case (PROPERTIES.TYPES.HARVEST_PROJECTS_IDS):
        res = this._propertyValuesForHarvestProjects(nameSpace, source, instance, S6UIService.typeParameters(sheetValue[PROPERTIES.COLUMNS.TYPE]), sheetValue);
        break;
      case (PROPERTIES.TYPES.PIPEDRIVE_DEALS_IDS):
        res = this._propertyValuesForDeals(nameSpace, source, instance, S6UIService.typeParameters(sheetValue[PROPERTIES.COLUMNS.TYPE]), sheetValue);
        break;
      case (PROPERTIES.TYPES.PIPEDRIVE_MSA):
        res = this._propertyValuesMSA(nameSpace, source, entity, instance, S6UIService.typeParameters(sheetValue[PROPERTIES.COLUMNS.TYPE]), sheetValue);
        break;
      case (PROPERTIES.TYPES.ORGANISATION):
        res = this._propertyValuesForOrganisation(nameSpace, source, entity, instance, S6UIService.typeParameters(sheetValue[PROPERTIES.COLUMNS.TYPE]), sheetValue);
        break;
      case (PROPERTIES.TYPES.PSEUDO_GUID):
        res = this._propertyValuesPseudoGuid(nameSpace, source, instance, S6UIService.typeParameters(sheetValue[PROPERTIES.COLUMNS.TYPE]), sheetValue);
        break;
      case (PROPERTIES.TYPES.FIELD):
        res = this._propertyValueForAField(nameSpace, source, entity, instance,
          S6UIService.typeParameters(sheetValue[PROPERTIES.COLUMNS.TYPE]),
          S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]),
          S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]));
        break;
      default:
        res[0] = S6PropertyServiceBuilder.propertyFactory(
          S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]),
          S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.TYPE]),
          S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.TITLE]),
          S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.HINT]),
          S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.EDITABLE]),
          S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.EMPTY_MEANS_EMPTY]),
          source,
          EMPTY,
          nameSpace,
          YES,
          EMPTY,
          APPLY.TEXT);
    }
    S6Context.debug("Made properties:", res);
    return res;
  }


  _propertyValueForAField(nameSpace, source, entity, instance, typeParameters, propId) {
    var res = [];
    var field = typeParameters[0];
    S6Context.debug("_propertyValueForAField", field);
    if (!field.startsWith("{")) {
      field = `{${field}}`;
    }
    if (this.isForApplication()) {
      var fields = instance.data[INSTANCE.FIELDS];
      for (var i = 0; i < fields.length; i++) {
        var fieldName = fields[i][INSTANCE.FIELD.FIELD_NAME];
        S6Context.debug("_propertyValueForAField", field, fieldName);
        if (fieldName == field) {
          var fieldName = fieldName.substring(1, fieldName.length - 1);
          res[0] = S6PropertyServiceBuilder.propertyFactory(
            propId,
            fields[i][INSTANCE.FIELD.TYPE],
            fields[i][INSTANCE.FIELD.TITLE],
            fields[i][INSTANCE.FIELD.HINT],
            NO,
            NO,
            source,
            fields[i][INSTANCE.FIELD.VALUE],
            nameSpace,
            YES,
            propId
          );
          break
        }
      }
    }
    else {
      var fields = entity.config[ENTITY.FIELDS];
      for (var i = 0; i < fields.length; i++) {
        var fieldName = fields[i][ENTITY.FIELD_ATTR.FIELD_NAME];
        S6Context.debug("_propertyValueForAField", field, fieldName);
        if (fieldName == field) {
          var fieldName = fieldName.substring(1, fieldName.length - 1);
          res[0] = S6PropertyServiceBuilder.propertyFactory(
            propId,
            fields[i][ENTITY.FIELD_ATTR.TYPE],
            fields[i][ENTITY.FIELD_ATTR.TITLE],
            fields[i][ENTITY.FIELD_ATTR.HINT],
            NO,
            NO,
            source,
            EMPTY,
            nameSpace,
            YES,
            propId
          );
          break
        }
      }

    }
    return res;
  }



  _propertyValuesPseudoGuid(nameSpace, source, instance, typeParameters, sheetValue) {
    var res = [];
    var guidValue = EMPTY;
    if (this.isForApplication()) {
      const len = parseInt(typeParameters[0]);
      guidValue = S6Utility.makePseudoGuid(len);
    }
    const propId = S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]);
    res[0] = S6PropertyServiceBuilder.propertyFactory(
      propId,
      "text",
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.TITLE]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.HINT]),
      NO,
      NO,
      source,
      guidValue,
      nameSpace,
      YES,
      EMPTY);
    return res;
  }

  _propertyValuesForRedHatAccountNumber(nameSpace, source, instance, typeParameters, sheetValue) {
    var res = [];
    var value = EMPTY;

    if (this.isForApplication()) {
      var domain = typeParameters[0];
      domain = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], domain);
      var id = S6PipeDrive.getOrganisationID(domain);

      var pipeDriveRec = S6PipeDrive.getOrganisationDetailsForID(id);
      value = S6Utility.trim(pipeDriveRec[PIPEDRIVE_FIELDS.DATA][PIPEDRIVE_FIELDS.RED_HAT_ACCOUNT_NUMBER]);
    }

    var propId = S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]);
    res[0] = S6PropertyServiceBuilder.propertyFactory(
      propId,
      PROPERTIES.TYPES.TEXT,
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.TITLE]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.HINT]),
      NO,
      NO,
      source,
      value,
      nameSpace,
      YES,
      EMPTY);

    return res;
  }

  _propertyValuesForDeals(nameSpace, source, instance, typeParameters, sheetValue) {
    var res = [];
    var defValue = EMPTY;
    var propId = S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]);
    var selectorDisplay = "[Slected Deal]";
    var dealsList = [];
    var dealsMap = [];

    if (this.isForApplication()) {
      var domain = typeParameters[0];
      S6Context.debugFn("_propertyValuesForDeals:", typeParameters);
      domain = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], domain);

      dealsMap = S6PipeDrive.getOpenDealsForOrgDomain(domain);
      console.error("dealsMap", dealsMap);

      dealsMap[defValue] = {
        [PIPDRIVE_ATTR.DEAL_ID]: EMPTY,
        [PIPDRIVE_ATTR.CONATCT_NAME]: EMPTY,
        [PIPDRIVE_ATTR.CONTACT_PHONE]: EMPTY,
        [PIPDRIVE_ATTR.CONTACT_EMAIL]: EMPTY,
        [PIPDRIVE_ATTR.DEAL_NAME]: EMPTY,
        [PIPDRIVE_ATTR.DEAL_RENEWAL_DATE]: EMPTY,
        [PIPDRIVE_ATTR.RENEWED_DEAL]: EMPTY,
        [PIPDRIVE_ATTR.CLASSIFICATION]: EMPTY,

      }
      S6Context.debugFn("_propertyValuesForDeals: deals", dealsMap, dealsMap.length);
      dealsList[0] = selectorDisplay;
      dealsList[1] = EMPTY;
      let x = 2;
      for (var d in dealsMap) {
        dealsList[x++] = dealsMap[d][PIPDRIVE_ATTR.DEAL_NAME];
        dealsList[x++] = dealsMap[d][PIPDRIVE_ATTR.DEAL_ID] + EMPTY;
      }

      if (x == 2) {
        dealsList[0] = "[No Deals]";
        dealsList[1] = EMPTY;
      }
    }

    S6Context.debugFn("_propertyValuesForDeals: dealValues", dealsList);
    let r = 0;
    var sourcreField = S6PropertyServiceBuilder.makePropoertyName(nameSpace, propId);

    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId,
      PROPERTIES.TYPES.SELECTOR,
      "Select Deal",
      "Select the PipeDrive deal",
      NO,
      NO,
      source,
      EMPTY,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      PIPDRIVE_ATTR.DEAL_NAME,
      dealsMap,
      selectorDisplay,
      dealsList);

    //var sourcreField = res[0][PROPERTIES.ATTR.PROP_NAME];

    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".name",
      PROPERTIES.TYPES.SELECTED,
      "Deal name",
      "Name of deal recorded in PipeDrive",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      PIPDRIVE_ATTR.DEAL_NAME,
      dealsMap,
      selectorDisplay);
    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".id",
      PROPERTIES.TYPES.SELECTED,
      "PipeDrive Deal Number",
      "ID Number of deal in PipeDrive",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      PIPDRIVE_ATTR.DEAL_ID,
      dealsMap,
      selectorDisplay);
    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".classification",
      PROPERTIES.TYPES.SELECTED,
      "Class of deal",
      "New Business, Renewal Business, UpSell",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      PIPDRIVE_ATTR.CLASSIFICATION,
      dealsMap,
      selectorDisplay);
    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".section6.id",
      PROPERTIES.TYPES.SELECTED,
      "SECTION6 Deal ID",
      "Unique deal ID for SECTION6",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      PIPDRIVE_ATTR.SECTION6_DEAL_ID,
      dealsMap,
      selectorDisplay);
    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".section6.id.link",
      PROPERTIES.TYPES.SELECTED,
      "PipeDrive Deal Link",
      "SECTION6 Deal ID with link to PipeDrive",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.LINK,
      PIPDRIVE_ATTR.SECTION6_LINK_DEAL_ID,
      dealsMap,
      selectorDisplay);

    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".contact.name",
      PROPERTIES.TYPES.SELECTED,
      "Deal Contact's Name",
      "Name of the client contact for the deal",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      PIPDRIVE_ATTR.CONATCT_NAME,
      dealsMap,
      selectorDisplay);
    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".contact.phone",
      PROPERTIES.TYPES.SELECTED,
      "Deal Contact's Phone Number",
      "Contact's phone number",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      PIPDRIVE_ATTR.CONTACT_PHONE,
      dealsMap,
      selectorDisplay);
    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".renewal.date",
      PROPERTIES.TYPES.SELECTED,
      "Deal Renewal Date",
      "The date the deal is to expire and neeeds to renew",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      PIPDRIVE_ATTR.DEAL_RENEWAL_DATE,
      dealsMap,
      selectorDisplay);
    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".renewed.deal",
      PROPERTIES.TYPES.SELECTED,
      "Renewed Deal",
      "Link to deal that this deal renews",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.LINK,
      PIPDRIVE_ATTR.RENEWED_DEAL,
      dealsMap,
      selectorDisplay);
    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".contact.email",
      PROPERTIES.TYPES.SELECTED,
      "Deal Contact's Email",
      "Contact's email address",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      PIPDRIVE_ATTR.CONTACT_EMAIL,
      dealsMap,
      selectorDisplay);
    S6Context.trace("_propertyValuesForDeals", res);
    return res;
  }

  _propertyValuesForHarvestProjects(nameSpace, source, instance, typeParameters, sheetValue) {
    var res = [];
    var defValue = EMPTY;
    var propId = S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]);
    var selectorDisplay = "[Selected Harvest Project]";
    var projectList = [];
    var projectsMap = [];

    if (this.isForApplication()) {
      var domain = typeParameters[0];
      S6Context.debugFn("_propertyValuesForHarvestProjectss:", typeParameters);
      domain = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], domain);

      projectsMap = HarvestAPIService.getProjectsForClientDomainName(domain);
      console.error("projectsMap", projectsMap);

      projectsMap[defValue] = {
        [HARVEST_FIELDS.CODE]: EMPTY,
        [HARVEST_FIELDS.NAME]: EMPTY,
        [HARVEST_FIELDS.TITLE]: EMPTY
      }
      S6Context.debugFn("_propertyValuesForHarvestProjectss: deals", projectsMap, projectsMap.length);
      projectList[0] = selectorDisplay;
      projectList[1] = EMPTY;
      let x = 2;
      for (var d in projectsMap) {
        projectList[x++] = projectsMap[d][HARVEST_FIELDS.TITLE];
        projectList[x++] = projectsMap[d][HARVEST_FIELDS.CODE];
      }

      if (x == 2) {
        projectList[0] = "[No Projects]";
        projectList[1] = EMPTY;
      }
    }

    S6Context.debugFn("_propertyValuesForHarvestProjects: projectValues", projectList);
    let r = 0;
    var sourcreField = S6PropertyServiceBuilder.makePropoertyName(nameSpace, propId);

    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId,
      PROPERTIES.TYPES.SELECTOR,
      "Select Project",
      "Select the Harvest Project",
      NO,
      NO,
      source,
      EMPTY,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      HARVEST_FIELDS.TITLE,
      projectsMap,
      selectorDisplay,
      projectList);

    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".code",
      PROPERTIES.TYPES.SELECTED,
      "Harvest project code",
      "Code of project recorded in Harvest",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      HARVEST_FIELDS.CODE,
      projectsMap,
      selectorDisplay);
    res[r++] = S6PropertyServiceBuilder.propertyFactory(
      propId + ".name",
      PROPERTIES.TYPES.SELECTED,
      "Harvest project name",
      "Name of project recorded in Harvest",
      NO,
      NO,
      source,
      defValue,
      nameSpace,
      YES,
      sourcreField,
      APPLY.TEXT,
      HARVEST_FIELDS.NAME,
      projectsMap,
      selectorDisplay);

    S6Context.trace("_propertyValuesForDeals", res);
    return res;
  }

  _propertyValuesMSA(nameSpace, source, entity, instance, typeParameters, sheetValue) {
    var res = [];
    var propId = S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]);
    var value = "UNKNOWN";

    if (this.isForApplication()) {
      var domain = typeParameters[0];
      S6Context.debugFn("_propertyValuesMSA:", typeParameters);
      domain = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], domain);
      var id = S6PipeDrive.getOrganisationID(domain);
      S6Context.debugFn("_propertyValuesMSA:id", id);
      var pipeDriveRec = S6PipeDrive.getOrganisationDetailsForID(id);
      S6Context.debug(pipeDriveRec);

      if (pipeDriveRec[PIPEDRIVE_FIELDS.DATA][PIPEDRIVE_FIELDS.MSA_STATUS] == PIPEDRIVE_FIELDS.MSA_STATUS_TYPES.NONE) {
        value = "NONE"
      }
      else if (S6Utility.trim(pipeDriveRec[PIPEDRIVE_FIELDS.DATA][PIPEDRIVE_FIELDS.MSA_START_DATE]) != EMPTY) {
        value = S6Utility.trim(pipeDriveRec[PIPEDRIVE_FIELDS.DATA][PIPEDRIVE_FIELDS.MSA_START_DATE]);
        value = S6Utility.formatDateD_MMMMM_YYYY(new Date(value));
      }
    }
    else {
      value = EMPTY;
    }

    res[0] = S6PropertyServiceBuilder.propertyFactory(
      propId,
      PROPERTIES.TYPES.TEXT,
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.TITLE]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.HINT]),
      NO,
      NO,
      source,
      value,
      nameSpace,
      YES,
      EMPTY);

    return res;

  }

  _propertyValuesForOrganisation(nameSpace, source, entity, instance, typeParameters, sheetValue) {
    var res = [];
    var values = {
      type: EMPTY,
      orgNumber: EMPTY,
      orgLink: EMPTY,
      orgName: EMPTY,
      orgNumber: EMPTY,
      orgNumberType: EMPTY,
      orgNZBN: EMPTY,
      orgABN: EMPTY,
      orgTypeDescriptition: EMPTY,
      addrTypeCapitlisedToLower: EMPTY,
      orgAddress: EMPTY,
      orgAddressType: EMPTY,
      orgEmail: EMPTY,
      orgStatusDesc: EMPTY,
      otherTerms: EMPTY
    }
    var info = {
      text: EMPTY,
      hint: EMPTY
    };
    const LOOKUP = {
      "NZBN": {
        title: "NZBN",
        hint: "New Zealand Business Number",
      },
      "ABN": {
        title: "ABN",
        hint: "Austrlian Business Number",
      },
    };

    var propId = S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]);
    S6Context.debugFn("_propertyValuesForOrganisation", nameSpace);

    if (this.isForApplication()) {
      var domain = typeParameters[0];

      S6Context.debugFn("_propertyValuesForCompany:", typeParameters);
      if (instance) {
        domain = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], domain);
      }

      var id = S6PipeDrive.getOrganisationID(domain);
      S6Context.debugFn("_propertyValuesForCompany:id", id);

      var pipeDriveRec = S6PipeDrive.getOrganisationDetailsForID(id);

      S6Context.debugFn("_propertyValuesForCompany:domain", domain);

      values.otherTerms = S6Utility.replaceBrWithNewline(pipeDriveRec.data[PIPEDRIVE_FIELDS.OTHER_TERMS]);
      values.type = pipeDriveRec.data[PIPEDRIVE_FIELDS.ORGANISATION_NUMBER_TYPE];
      values.orgNumber = pipeDriveRec.data[PIPEDRIVE_FIELDS.ORGANISATION_NUMBER];
      values.orgLink = "pipedrive.org." + pipeDriveRec.data[PIPEDRIVE_FIELDS.ORG_NAME] + "|" + pipeDriveRec.data[PIPEDRIVE_FIELDS.ORG_LINK];


      if (values.type == PIPEDRIVE_FIELDS.ORGANISATION_NUMBER_TYPES.NZBN) {

        values.orgNumberType = "NZBN";

        var details = S6RegisteredOrganisationService.getNZBNDetails(values.orgNumber);

        values.orgAddressType = details[REG_ORG.ADDRESS][REG_ORG.ADDRESS_ATTRS.ADDRESS_TYPE];
        values.orgAddress = S6RegisteredOrganisationService.formatAddressForText(details);
        values.addrTypeCapitlisedToLower = EMPTY;
        if (values.orgAddressType) {
          values.addrTypeCapitlisedToLower = values.orgAddressType.substring(0, 1)
            + values.orgAddressType.toLowerCase().substring(1, values.orgAddressType.length)
        }
        values.orgName = details[REG_ORG.ENTITY_NAME];
        values.orgStatusDesc = details[REG_ORG.ENTITY_STATUS_DESC];
        values.orgTypeDescriptition = details[REG_ORG.ENTITY_TYPE_DESC];
        values.orgNZBN = details[REG_ORG.NZBN];
        values.orgEmail = details[REG_ORG.EMAIL_ADDRESS];

        info.text = `<b>Organisation Details for ${details[REG_ORG.ENTITY_NAME]}</b>.<br>See the <a href=https://www.nzbn.govt.nz/mynzbn/nzbndetails/${values.orgNumber}/>NZBN record</a> and the <a href=https://section6.pipedrive.com/organization/${id}>PipeDrive record</a> for more details.`;
      }
      else if (values.type == PIPEDRIVE_FIELDS.ORGANISATION_NUMBER_TYPES.ABN) {
        values.orgNumberType = "ABN";
        var details = S6RegisteredOrganisationService.getABNDetails(values.orgNumber);

        values.orgAddressType = details[REG_ORG.ADDRESS][REG_ORG.ADDRESS_ATTRS.ADDRESS_TYPE];
        values.orgAddress = S6RegisteredOrganisationService.formatAddressForText(details);
        values.orgStatusDesc = details[REG_ORG.ENTITY_STATUS_DESC];

        values.addrTypeCapitlisedToLower = values.orgAddressType;
        values.orgName = details[REG_ORG.ENTITY_NAME];

        values.orgTypeDescriptition = details[REG_ORG.ENTITY_TYPE_DESC];
        // for reasons I do not fully unederstand a link directly to "https://www.abr.business.gov.au/ABN" does not work. It cause a fatal error while parsing 
        // the CardService::build() output. The problem is normally cuase by the url not being whitelisted in the appscript.json. But it is whitelisted!
        // so to makeit [mostly] worok, I have added to use https://www.google.com/url?q= to get the link to be still useful.
        // The user will have to accept the redicted, but it's better than nothing.

        info.text = `<b>Organisation Details for ${details[REG_ORG.ENTITY_NAME]}</b><br>See the <a href=https://www.google.com/url?q=https://www.abr.business.gov.au/ABN/View?id=${values.orgNumber}>ABN record</a> and the <a href=https://section6.pipedrive.com/organization/${id}>PipeDrive record</a> for more details.<br>Note, the ABN regsitry records only the state and postcode for the organisations's address.`;
        // `<b>Organisation Details for ${details[REG_ORG.ENTITY_NAME]}</b><br>See the <a href=https://abr.business.gov.au/ABN/View?id=${values.orgNumber}/>NZBN record</a> and the <a href=https://section6.pipedrive.com/organization/${id}>PipeDrive record</a> for more details. Note, the ABN regsitry records only the state and postcode for the organisations's address.`;
      }
    }


    S6Context.debug(values);

    try {
      let r = 0;
      if (this.isForApplication()) {
        res[r++] = S6PropertyServiceBuilder.propertyFactory(
          propId + ".info",
          PROPERTIES.TYPES.INFO,
          info.text,
          info.hint,
          NO,
          NO,
          source,
          EMPTY,
          nameSpace,
          YES,
          EMPTY);
      }

      res[r++] = S6PropertyServiceBuilder.propertyFactory(
        propId + "." + [PROPERTIES.ORG.NAME],
        PROPERTIES.TYPES.TEXT,
        "Name",
        "Orgainsation Name",
        NO,
        NO,
        source,
        values.orgName,
        nameSpace,
        YES,
        EMPTY);

      res[r++] = S6PropertyServiceBuilder.propertyFactory(
        propId + "." + [PROPERTIES.ORG.STATUS_DESCRIPTION],
        PROPERTIES.TYPES.TEXT,
        "Status",
        "The organisation's registration status",
        NO,
        NO,
        source,
        values.orgStatusDesc,
        nameSpace,
        YES,
        EMPTY);

      res[r++] = S6PropertyServiceBuilder.propertyFactory(
        propId + "." + [PROPERTIES.ORG.TYPE_DESCTRIPTION],
        PROPERTIES.TYPES.TEXT,
        "Type Description",
        "The type description of organisations",
        NO,
        NO,
        source,
        values.orgTypeDescriptition,
        nameSpace,
        YES,
        EMPTY);

      res[r++] = S6PropertyServiceBuilder.propertyFactory(
        propId + "." + [PROPERTIES.ORG.NUMBER],
        PROPERTIES.TYPES.TEXT,
        "Organisation Number",
        "Number issued by the registring authority",
        NO,
        NO,
        source,
        values.orgNumber,
        nameSpace,
        YES,
        propId);
      //other
      res[r++] = S6PropertyServiceBuilder.propertyFactory(
        propId + "." + [PROPERTIES.ORG.OTHER_TERMS],
        PROPERTIES.TYPES.TEXT,
        "Other Terms",
        "Otyher terms for sales T&C's",
        NO,
        YES,
        source,
        values.otherTerms,
        nameSpace,
        YES,
        propId);

      if (this.isForApplication()) {
        res[r++] = S6PropertyServiceBuilder.propertyFactory(
          propId + "." + values.orgNumberType,
          PROPERTIES.TYPES.TEXT,
          LOOKUP[values.orgNumberType].title,
          LOOKUP[values.orgNumberType].hint,
          NO,
          NO,
          source,
          values.orgNumber,
          nameSpace,
          YES,
          propId);
      }
      else {
        res[r++] = S6PropertyServiceBuilder.propertyFactory(
          propId + ".NZBN",
          PROPERTIES.TYPES.TEXT,
          LOOKUP["NZBN"].title,
          LOOKUP["NZBN"].hint,
          NO,
          NO,
          source,
          values.orgNumber,
          nameSpace,
          YES,
          propId);
        res[r++] = S6PropertyServiceBuilder.propertyFactory(
          propId + ".ABN",
          PROPERTIES.TYPES.TEXT,
          LOOKUP["ABN"].title,
          LOOKUP["ABN"].hint,
          NO,
          NO,
          source,
          values.orgNumber,
          nameSpace,
          YES,
          propId);
      }

      res[r++] = S6PropertyServiceBuilder.propertyFactory(
        propId + "." + [PROPERTIES.ORG.ADDRESS],
        PROPERTIES.TYPES.TEXT,
        "Address",
        "Address recorded by registrey",
        YES,
        NO,
        source,
        values.orgAddress,
        nameSpace,
        YES,
        propId);

      res[r++] = S6PropertyServiceBuilder.propertyFactory(
        propId + "." + [PROPERTIES.ORG.ADDRESS_TYPE],
        PROPERTIES.TYPES.TEXT,
        "Address type",
        "Address type according to registrey",
        NO,
        YES,
        source,
        values.addrTypeCapitlisedToLower,
        nameSpace,
        YES,
        propId);

      // res[r++] = S6PropertyServiceBuilder.propertyFactory(
      //   propId + "." + [PROPERTIES.ORG.EMAIL_ADDRESS],
      //   //PROPERTIES.TYPES.INPUT_LIST,
      //   PROPERTIES.TYPES.TEXT,
      //   "Email address",
      //   "Email address",
      //   YES,
      //   NO,
      //   source,
      //   values.orgEmail,
      //   nameSpace,
      //   YES,
      //   propId);
      res[r++] = S6PropertyServiceBuilder.propertyFactory(
        propId + "." + [PROPERTIES.ORG.ORG_LINK],
        //PROPERTIES.TYPES.INPUT_LIST,
        PROPERTIES.TYPES.TEXT,
        "PipeDrive Organisation Link",
        "Organisation domain link to PipeDrive",
        YES,
        NO,
        source,
        values.orgLink,
        nameSpace,
        YES,
        propId,
        APPLY.LINK);

    }
    catch (err) {
      S6Context.error(err);
    }
    S6Context.debugFn("_propertyValuesForOrganisation", res);

    if (res.length == 0) {
      res[0] = this.propoertyFactoryHelp(sheetValue, nameSpace, source,
        "<b>Organisation Number :</b> There is no organisations number recorded for this entity. Many propoerties will be missing.<br><br>For New Zealand organisations, find the <a href=" + "https://www.nzbn.govt.nz/" + ">NZBN</a> and recorded it in PipeDrive's Business Number field (<a href=" + "https://section6.pipedrive.com/organization/" + id + ">PipeDrive for " + domain + "</a>), being sure to record the Business Number type as NZBN.");
      //<a href=nzbn.govt.nz>NZBN</a> 
      // <a href=https://section6.pipedrive.com/organization/${id}>${domain}</a>
      //
    }
    return res;
  }

  _propertyValueForFields(nameSpace, source, entity, instance, propId) {
    var res = [];
    var fields = [];
    if (this.isForApplication()) {
      fields = instance.data[INSTANCE.FIELDS];
      for (var i = 0; i < fields.length; i++) {
        var fieldName = fields[i][INSTANCE.FIELD.FIELD_NAME]
        var fieldName = fieldName.substring(1, fieldName.length - 1);
        res[i] = S6PropertyServiceBuilder.propertyFactory(
          fieldName,
          fields[i][INSTANCE.FIELD.TYPE],
          fields[i][INSTANCE.FIELD.TITLE],
          fields[i][INSTANCE.FIELD.HINT],
          NO,
          NO,
          source,
          fields[i][INSTANCE.FIELD.VALUE],
          nameSpace,
          YES,
          propId
        );
      }
    }
    else {
      fields = entity.config[ENTITY.FIELDS];
      for (var i = 0; i < fields.length; i++) {
        var fieldName = fields[i][ENTITY.FIELD_ATTR.FIELD_NAME]
        var fieldName = fieldName.substring(1, fieldName.length - 1);
        res[i] = S6PropertyServiceBuilder.propertyFactory(
          fieldName,
          fields[i][ENTITY.FIELD_ATTR.TYPE],
          fields[i][ENTITY.FIELD_ATTR.TITLE],
          fields[i][ENTITY.FIELD_ATTR.HINT],
          NO,
          NO,
          source,
          EMPTY,
          nameSpace,
          YES,
          propId
        );
      }
    }
    return res;
  }

  _propertyValueForToday(sheetValue, instnace, nameSpace, source, typeParameters) {
    var res = [];
    var date = new Date();
    var value = EMPTY;
    if (this.isForApplication()) {
      value = Utilities.formatDate(new Date(date), Session.getTimeZone(), typeParameters[0]);
    }
    res[0] = this._propoertyFromSheetValue(sheetValue, nameSpace, source, value);
    return res;
  }

  _propertyValueForYou(instance, nameSpace, source, propId) {
    var res = [];
    var values = {
      fullName: EMPTY,
      email: EMPTY
    }
    if (this.isForApplication()) {
      var user = S6AdminDir.currentUser();
      values.email = user[USER.EMAIL];
      values.fullName = user[USER.FULL_NAME];
    }
    res[0] = S6PropertyServiceBuilder.propertyFactory(
      propId + "." + [USER.FULL_NAME],
      PROPERTIES.TYPES.TEXT,
      "Your full name",
      "From your name recorded by Gmail",
      NO,
      NO,
      source,
      values.fullName,
      nameSpace,
      YES,
      propId,
      APPLY.TEXT);
    res[1] = S6PropertyServiceBuilder.propertyFactory(
      propId + "." + [USER.EMAIL],
      PROPERTIES.TYPES.TEXT,
      "Your email",
      "From email recorded by Gmail",
      NO,
      NO,
      source,
      values.email,
      nameSpace,
      YES,
      propId,
      APPLY.TEXT);
    return res;
  }

  // _propertyValueForInputList(sheetValue, instance, nameSpace, source, typeParameters = EMPTY, value = EMPTY) {
  //   var res = [];
  //   var type = DATA_TYPE_INPUT_LIST + "[" + typeParameters + "]";
  //   res[0] = S6PropertyEntity._propoertyFromSheetValue(sheetValue, nameSpace, source, value);
  //   res[0][PROPERTIES.ATTR.TYPE] = type;

  //   if (typeParameters.length == 1) {
  //     value = typeParameters[0];
  //   }
  //   res[0][PROPERTIES.ATTR.EDITABLE] = YES;
  //   res[0][PROPERTIES.ATTR.VALUE] = value;
  //   res[0][PROPERTIES.ATTR.ORGINAL_VALUE] = value;
  //   return res;
  // }

  _propertyValueEntityLogo(sheetValue, nameSpace, source, entity, instance, expected = true) {
    var res = [];
    if (this.isForApplication() && entity.config[ENTITY.LOGO_FILE_NAME] != EMPTY) {
      var path = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], instance.entity.config[ENTITY.LOGO_FILE_NAME]);
      var logo = S6Utility.getFileFromRootFolderIdAndFromPath(instance.entity.config[ENTITY.ROOT_DIRECTORY_ID], path);
      if (logo) {
        var id = logo.getId();
        var value = `https://drive.google.com/uc?export=view&id=${id}`;
        res[0] = this._propoertyFromSheetValue(sheetValue, nameSpace, source, value);
        res[0][PROPERTIES.ATTR.APPLY] = APPLY.IMAGE;
      }
      else {
        res[0] = this._propoertyFromSheetValue(sheetValue, nameSpace, source, EMPTY);
        res[0][PROPERTIES.ATTR.APPLY] = APPLY.IMAGE;
      }
    }
    else if (!this.isForApplication()) {
      res[0] = this._propoertyFromSheetValue(sheetValue, nameSpace, source, EMPTY);
      res[0][PROPERTIES.ATTR.APPLY] = APPLY.IMAGE;
    }

    if (this.isForApplication() && expected && res.length == 0) {
      var path = S6Utility.replaceFieldInText(instance.data[INSTANCE.FIELDS], instance.entity.config[ENTITY.LOGO_FILE_NAME]);
      res[0] = this.propoertyFactoryHelp(sheetValue, nameSpace, "<b>" + source, sheetValue[PROPERTIES.COLUMNS.TITLE] + " : </b>No entity logo/image found. Find an HD image and save it to <b>" + path + "</b>");
    }
    return res;
  }

  _propertyValueImageLink(sheetValue, nameSpace, instance, source) {
    var res = [];
    res[0] = this._propoertyFromSheetValue(sheetValue, nameSpace, source, S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.VALUE]),);
    res[0][PROPERTIES.ATTR.APPLY] = APPLY.IMAGE;
    if (!this.isForApplication()) {
      res[0][PROPERTIES.ATTR.VALUE] = EMPTY;
    }
    return res;

  }

  _propoertyFromSheetValue(sheetValue, nameSpace, source, value) {
    return S6PropertyServiceBuilder.propertyFactory(
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.TYPE]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.TITLE]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.HINT]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.EDITABLE]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.EMPTY_MEANS_EMPTY]),
      source,
      value,
      nameSpace);
  }

  propoertyFactoryHelp(sheetValue, nameSpace, source, helpText) {
    return S6PropertyServiceBuilder.propertyFactory(
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.PROP_ID]),
      PROPERTIES.TYPES.NOT_FOUND,
      helpText,
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.HINT]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.EDITABLE]),
      S6Utility.trim(sheetValue[PROPERTIES.COLUMNS.EMPTY_MEANS_EMPTY]),
      source,
      EMPTY,
      nameSpace);
  }


  static propertyFactory(propId, type, title, hint, editable, emptyMeansEmpty, source, value, nameSpace, visible = YES, fieldSource = EMPTY, apply = APPLY.TEXT, selector = EMPTY, selectorMap = {}, selectorDisplay = EMPTY, selectorList) {
    return {
      [PROPERTIES.ATTR.PROP_ID]: "{" + propId + "}",
      [PROPERTIES.ATTR.PROP_NAME]: S6PropertyServiceBuilder.makePropoertyName(nameSpace, propId),
      [PROPERTIES.ATTR.FIELD]: S6PropertyServiceBuilder.makePropoertyName(nameSpace, propId),
      [PROPERTIES.ATTR.TYPE]: type,
      [PROPERTIES.ATTR.TITLE]: title,
      [PROPERTIES.ATTR.HINT]: hint,
      [PROPERTIES.ATTR.EDITABLE]: editable,
      [PROPERTIES.ATTR.EMPTY_MEANS_EMPTY]: emptyMeansEmpty,
      [PROPERTIES.ATTR.SOURCE]: source,
      [PROPERTIES.ATTR.VALUE]: value,
      [PROPERTIES.ATTR.ORGINAL_VALUE]: value,
      [PROPERTIES.ATTR.FIELD_SOURCE]: fieldSource,
      [PROPERTIES.ATTR.VISIBLE]: visible,
      [PROPERTIES.ATTR.APPLY]: apply,
      [PROPERTIES.ATTR.SELECTOR]: selector,
      [PROPERTIES.ATTR.SELECTOR_MAP]: JSON.stringify(selectorMap),
      [PROPERTIES.ATTR.SELECTOR_LIST]: selectorList,
      [PROPERTIES.ATTR.SELECTOR_DISPLAY]: selectorDisplay,
    };

  }

  _getLocalSheetProps(instance, cache = true) {
    var values = [];
    var cacheName = `${instance.entity.entityNameSpace}:local-properties`;
    var json = S6Cache.userCacheGetJson(cacheName);
    if (json && cache) {
      values = json.values;
      S6Context.info("Cache hit:" + cacheName);
    }
    else {
      var spreadsheet = this._getPropLocal(instance);
      if (spreadsheet) {
        values = this._sheetValues(spreadsheet, PROPERTIES.SHEET_LOCAL, "A:G");
        S6Cache.userCachePutJson(cacheName, { values });
        S6Context.info("Cache miss:" + cacheName);
      }
      else {
        S6Cache.userCachePutJson(cacheName, { values });
        S6Context.info("Store empty cache:" + cacheName);
      }
    }
    return values;
  }

  _getLocalSheetValues(instance) {
    var values = [];
    var spreadsheet = this._getPropLocal(instance);
    if (spreadsheet) {
      values = this._sheetValues(spreadsheet, PROPERTIES.SHEET_VALUES, "A:B");
    }
    return values;
  }



  _getSheetProps(nameSpace, sheetName, range, cache = true) {
    var values = [];
    var cacheName = `${nameSpace}:${sheetName}:${range}`;
    var json = S6Cache.userCacheGetJson(cacheName);
    if (json && cache) {
      values = json.values;
      S6Context.info("Cache hit:" + cacheName);
    }
    else {
      var spreadsheet = null;
      S6Context.info("Cache miss:" + cacheName);
      if (sheetName == PROPERTIES.SHEET_GLOBAL) {
        spreadsheet = S6Utility.getMasterSpreadSheet();
      }
      else if (sheetName == PROPERTIES.SHEET_ENTITY_PROPOERTIES) {
        var master = S6Master.newMaster();
        spreadsheet = master.getSpreadsheetForNameSpace(nameSpace);
      }
      if (spreadsheet) {
        values = this._sheetValues(spreadsheet, sheetName, range);
      }
      else {
        S6Context.info("No entity propoerties for:" + nameSpace);
      }
      S6Cache.userCachePutJson(cacheName, { values });
    }
    return values;
  }

  _getSheetValues(spreadsheet, sheetName, range, cache = true) {
    var values = [];
    var cacheName = `${spreadsheet.getSheetId()}:${sheetName}:${range}`;
    var json = S6Cache.userCacheGetJson(cacheName);
    if (json && cache) {
      values = json.values;
      S6Context.info("Cache hit:" + cacheName);
    }
    else {
      values = this._sheetValues(spreadsheet, sheetName, range);
      S6Cache.userCachePutJson(cacheName, { values });
      S6Context.info("Cache miss:" + cacheName);
    }
    return values;
  }
  _sheetValues(spreadsheet, sheetName, range) {
    var res;
    S6Context.debugFn(this._sheetValues, spreadsheet.getName(), "[", sheetName, "][", range, "]");
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (sheet == null) {
      S6Context.warn(`Spreadsheet does not contain a sheet named [${sheetName}]`);
    }
    else {
      res = sheet.getRange(range).getValues();
    }
    return res;
  }

}
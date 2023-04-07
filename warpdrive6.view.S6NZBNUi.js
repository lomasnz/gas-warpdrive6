
const ICON_NZBN_URL = "https://drive.google.com/uc?export=view&id=1uo31ZjF2YYytGqVlbdodDnB1I2hRN4n8";

function buildNZBNSearechView(param) {
  var res = S6UIService.createCard("NZBN", "Find NZBN", ICON_NZBN_URL);

  var sec = S6UIService.createSection();

  var field = S6Entity.fieldFactory("{nzbn}", "Search for NZBN", DATA_TYPE_TEXT, "Search by Organisation Name or NZBN. Enter at least 2 characters and press ENTER. It will take 2-3 seconds to populate the dropdown list of organisations that match your search criteria.", EMPTY, YES, YES, NO, NO, YES);
  sec.addWidget(S6UIService.createNZBNSearch(field));

  sec.addWidget(S6UIService.createSpacer());
  var link = `https://www.nzbn.govt.nz/`;
  sec.addWidget(S6UIService.createOpenLabel("Alterntaively, find the organisation at NZBN", "Paste the 13 digit NZBN above", ICON_NZBN_URL, link));

  res.addSection(sec);
  param = new Param();
  param.addJSON(PARAM.FIELDS, [field]);
  res.setFixedFooter(S6UIService.createFooter(S6UIService.createCreateButton("CONFIRM", actionEventNZBNConfirm.name, param.toJSON()), S6UIService.createCancelButton("CANCEL")));

  return res.build();

}


function buildNZBNConfirmView(param) {
  var res;
  var fields = param.getJSON(ENTITY.FIELDS);
  var nzbnV = S6RegisteredOrganisationService.getNZBNFromString(fields[0].value);
  if (nzbnV == EMPTY) {
    res = S6UIService.createNotification("Your selection must include a 13 NZBN number.");
  }
  else {
    var found = S6RegisteredOrganisationService.getNZBNDetails(nzbnV);
    if (!found) {
      res = S6UIService.createNotification("NO NZBN record found. You must select a single NZBN record.");
    }
    else if (found) {
      console.log(found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS4] == null);

      var card = S6UIService.createCard("NZBN", "Confirm NZBN details", ICON_NZBN_URL);
      var sec = S6UIService.createSection();

      const br_careof = found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.CARE_OF] == EMPTY ? EMPTY : "<br>";
      const br_addr1 = found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS1] == EMPTY ? EMPTY : "<br>";
      const br_addr2 = found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS2] == EMPTY ? EMPTY : "<br>";
      const br_addr3 = found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS3] == EMPTY ? EMPTY : found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS4] == EMPTY ? EMPTY : "<br>";

      var label =
        `<b>Name:</b> ${found[REGISTERED_ORG.ENTITY_NAME]}<br>` +
        `<b>NZBN:</b> ${found[REGISTERED_ORG.NZBN]}<br>` +
        `<b>Type:</b> ${found[REGISTERED_ORG.ENTITY_STATUS_DESC]}, ${found[REGISTERED_ORG.ENTITY_TYPE_DESC]}<br><br>` +
        `<b>${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS_TYPE]} Address:</b><br>` +
        `${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.CARE_OF]}${br_careof}` +
        `${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS1]}${br_addr1}` +
        `${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS2]}${br_addr2}` +
        `${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS3]}${br_addr3}` +
        `${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS4]} ${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.POST_CODE]}` +
        `<br>${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.COUNTRY_CODE]}<br><br>` +
        `<b>Start/End Date:</b> ${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.START_DATE]} - ${found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.END_DATE]} `;

      sec.addWidget(S6UIService.createLabel(label));
      if (found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS_TYPE] != "REGISTERED") {
        S6Context.info("Address type:",found[REGISTERED_ORG.ADDRESS][REGISTERED_ORG.ADDRESS_ATTRS.ADDRESS_TYPE]);
        sec.addWidget(S6UIService.createSmallLabel("This organisation does not have a registered address, so the next available addres type is shown."));
      }
      sec.addWidget(S6UIService.createDivider());
      var link = `https://www.nzbn.govt.nz/mynzbn/nzbndetails/${found[REGISTERED_ORG.NZBN]}`;
      sec.addWidget(S6UIService.createOpenLabel("See this record at NZBN", EMPTY, ICON_NZBN_URL, link));


      card.addSection(sec);
      res = card.build();
    }
  }
  console.log("res", res);
  return res;

}
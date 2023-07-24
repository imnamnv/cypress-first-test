import { onDatepickerPage } from "../support/page_objects/datepickerPage";
import { onFormLayoutsPage } from "../support/page_objects/formLayoutsPage";
import { navigateTo } from "../support/page_objects/navigationPage";
import { onSmartTablePage } from "../support/page_objects/smartTablePage";

describe("Test with Page Objects", () => {
  beforeEach("Open application", () => {
    cy.openHomePage();
  });

  it("verify navigations across the pages", () => {
    navigateTo.formLayoutsPage();
    navigateTo.datepickerPage();
    navigateTo.smartTablePage();
    navigateTo.toasterPage();
    navigateTo.tooltipPage();
  });

  it.only("Should sumit Inline and Basic form and select tomorrow date in the calendar", () => {
    navigateTo.formLayoutsPage();
    onFormLayoutsPage.submitInlineFormWithNameAndEmail("Nam", "Nam@test.com");
    onFormLayoutsPage.submitBasicFormWithEmailAndPassword(
      "Nam@test.com",
      "password"
    );

    navigateTo.datepickerPage();
    onDatepickerPage.selectCommonDatepickerDateFromToday(1);
    onDatepickerPage.selectDatepickerWithRangeFromToday(7, 18);

    navigateTo.smartTablePage();
    onSmartTablePage.addNewRecordWithFirstAndLastName("Nam", "Nguyen");
    onSmartTablePage.updateAgeByFirstName("Nam", "26");
    onSmartTablePage.deleteRowByIndex(1);
  });
});

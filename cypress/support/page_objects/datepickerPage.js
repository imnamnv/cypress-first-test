function selectDayfromCurrent(day) {
  let date = new Date();
  date.setDate(date.getDate() + day);
  let futureDay = date.getDate();
  console.log("futureDay", futureDay);
  let futureMonth = date.toLocaleString("default", {
    month: "short",
  });

  const dateAssert = `${futureMonth} ${futureDay}, ${date.getFullYear()}`;

  cy.get("nb-calendar-navigation")
    .invoke("attr", "ng-reflect-date")
    .then((dateAttribute) => {
      if (!dateAttribute.includes(futureMonth)) {
        cy.get('[data-name="chevron-right"]').click();

        selectDayfromCurrent(day);
      } else {
        cy.get(
          ".day-cell" // jQuery, space means find the class inside a html tag
        )
          .not(".bounding-month")
          .contains(futureDay)
          .click();
      }
    });

  return dateAssert;
}

export class DatepickerPage {
  selectCommonDatepickerDateFromToday(dayFromToday) {
    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();

        const dateAssert = selectDayfromCurrent(dayFromToday);

        cy.wrap(input)
          .invoke("prop", "value") // prop is a function
          .should("contain", dateAssert);

        cy.wrap(input).should("have.value", dateAssert);
      });
  }

  selectDatepickerWithRangeFromToday(firstDay, secondDay) {
    cy.contains("nb-card", "Datepicker With Range")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();

        const dateAssertFirst = selectDayfromCurrent(firstDay);
        const dateAssertSecond = selectDayfromCurrent(secondDay);
        const finalDate = `${dateAssertFirst} - ${dateAssertSecond}`;

        cy.wrap(input)
          .invoke("prop", "value") // prop is a function
          .should("contain", finalDate);

        cy.wrap(input).should("have.value", finalDate);
      });
  }
}

export const onDatepickerPage = new DatepickerPage();

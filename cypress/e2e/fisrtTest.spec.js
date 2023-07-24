// help vs code use cy keyword ???
/// <reference types="cypress" />

// cy.constains : Only the first matched element will be returned. get base on text

//or context
describe("Our first test", () => {
  it("first test", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //by Tag Name
    cy.get("input");

    //by Id
    cy.get("#inputEmail1");

    //by Class Name
    cy.get(".input-full-width");

    //by Attribute name
    cy.get("[placeholder]");

    //by Attribute name and value
    cy.get('[placeholder="Email"]');

    //by Class value
    cy.get('[class="input-full-width size-medium shape-rectangle"]'); // need all value of class

    //by Tab name and Attribute with value
    cy.get('input[placeholder="Email"]');

    //by two different attributes
    cy.get('[placeholder="Email"][type="email"]');

    //by tab name, attribute with value, id and class
    cy.get('input[placeholder="Email"]#inputEmail.input-full-width');

    //THE MOST RECOMMENTED BY CYPRESS
    cy.get('[data-cy="imputEmail1"]');
  });

  it("second test", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.get("[data-cy=signInButton]");

    cy.contains("Sign in");

    cy.contains('[status="warning"]', "Sign in");

    cy.get("#inputEmail3")
      .parents("form")
      .find("button") //like within, find the child component from a parent (can multible component)
      .should("contain", "Sign in") //expect
      .parents("form")
      .find("nb-checkbox")
      .click();

    cy.contains("nb-card", "Horizontal form").find('[type="email"]'); // find nd-card has "Horizontal form" text
  });

  //then and wrap methods
  it("then and wrap methods", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //find the label in a form
    cy.contains("nb-card", "Using the Grid")
      .find('[for="inputEmail1"]')
      .should("contain", "Email");

    cy.contains("nb-card", "Using the Grid")
      .find('[for="inputPassword2"]')
      .should("contain", "Password");

    cy.contains("nb-card", "Basic form")
      .find('[for="exampleInputEmail1"]')
      .should("contain", "Email address");

    cy.contains("nb-card", "Basic form")
      .find('[for="exampleInputPassword1"]')
      .should("contain", "Password");

    cy.contains("nb-card", "Using the Grid") // cypress function is async
      .then((firstForm) => {
        const emailLableFirst = firstForm.find('[for="inputEmail1"]').text(); // first form is Jquery, so we can assign to a variable and can not use cypress function like should,...
        expect(emailLableFirst).to.equal("Email");

        cy.wrap(firstForm)
          .find('[for="inputEmail1"]') // change jQuery to Cypress
          .should("contain", "Email");
      });
  });

  // Invoke a function
  it("invoke command", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.get('[for="exampleInputEmail1"]') // cypress function is async
      .invoke("text") // text is a function
      .then((text) => {
        expect(text).to.equal("Email address");
      });

    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox") // cypress function is async
      .click()
      .find(".custom-checkbox")
      .invoke("attr", "class") // attr is a function
      .should("contain", "checked");
  });

  it("assert property", () => {
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
              'nb-calendar-day-picker [class="day-cell ng-star-inserted"]' // jQuery, space means find the class inside a html tag
            )
              .contains(futureDay)
              .click();
          }
        });

      return dateAssert;
    }

    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();

        const dateAssert = selectDayfromCurrent(300);

        cy.wrap(input)
          .invoke("prop", "value") // prop is a function
          .should("contain", dateAssert);
        cy.wrap(input).should("have.value", dateAssert);
      });
  });

  it("radio button", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radioButton) => {
        cy.wrap(radioButton)
          .first()
          .check({ force: true }) // default checkbox is hidden -> using force
          .should("be.checked"); // https://github.com/chaijs/chai : assertion library

        cy.wrap(radioButton)
          .eq(1) // select second checkbox
          .check({ force: true }) // default checkbox is hidden -> using force
          .should("be.checked"); // https://github.com/chaijs/chai : assertion library

        cy.wrap(radioButton)
          .first() // select second checkbox
          .should("not.be.checked"); // https://github.com/chaijs/chai : assertion library

        cy.wrap(radioButton)
          .eq(2) // select second checkbox
          .should("be.disabled"); // https://github.com/chaijs/chai : assertion library
      });
  });

  it("check boxes", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();

    cy.get('[type="checkbox"]').check({ force: true }); // go to check every check boxes, if the box is checked, it not trigger check()
    cy.get('[type="checkbox"]').eq(0).click({ force: true }); // can uncheck by using click(), when we want to check, should use check()
  });

  // select tag has select function. only work on select tag, we can select by value
  it("Lists and dropdowns", () => {
    cy.visit("/");

    // 1
    // cy.get("nav nb-select").click();
    // cy.get(".options-list").contains("Dark").click();
    // cy.get("nav nb-select").should("contain", "Dark");

    // cy.get("nb-layout-header nav").should(
    //   "have.css",
    //   "background-color",
    //   "rgb(34, 43, 69)"
    // );

    // 2
    cy.get("nav nb-select").then((dropdown) => {
      cy.wrap(dropdown).click();

      cy.get(".options-list nb-option").each((listItem, index) => {
        const itemText = listItem.text().trim();

        const colors = {
          Light: "rgb(255, 255, 255)",
          Dark: "rgb(34, 43, 69)",
          Cosmic: "rgb(50, 50, 89)",
          Corporate: "rgb(255, 255, 255)",
        };

        cy.wrap(listItem).click();
        cy.wrap(dropdown).should("contain", itemText);

        cy.get("nb-layout-header nav").should(
          "have.css",
          "background-color",
          colors[itemText]
        );

        if (index < 3) {
          cy.wrap(dropdown).click();
        }
      });
    });
  });

  it("Web Table", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    // 1
    cy.get("tbody")
      .contains("tr", "Larry")
      .then((tableRow) => {
        cy.wrap(tableRow).find(".nb-edit").click();
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type("25");
        cy.wrap(tableRow).find(".nb-checkmark").click();

        cy.wrap(tableRow).find("td").eq(6).should("contain", "25");
      });

    // 2
    cy.get("thead").find(".nb-plus").click();

    cy.get("thead")
      .find("tr")
      .eq(2)
      .then((tableRow) => {
        cy.wrap(tableRow).find('[placeholder="First Name"]').type("Nam");
        cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Nguyen");

        cy.wrap(tableRow).find(".nb-checkmark").click();
      });

    cy.get("tbody")
      .find("tr")
      .first()
      .then((tableRow) => {
        cy.wrap(tableRow).find("td").eq(2).should("contain", "Nam");
        cy.wrap(tableRow).find("td").eq(3).should("contain", "Nguyen");
      });

    // 3
    const ages = [20, 30, 40, 200];
    cy.wrap(ages).each((age) => {
      cy.get('thead [placeholder="Age"]').clear().type(age);
      cy.wait(300);

      cy.get("tbody")
        .find("tr")
        .each((tableRow) => {
          if (age === 200) {
            cy.wrap(tableRow).find("td").should("contain", "No data found");
          } else {
            cy.wrap(tableRow).find("td").eq(6).should("contain", age);
          }
        });
    });
  });

  it("test hover behavior", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Tooltip").click();

    cy.contains("nb-card", "Colored Tooltips").contains("Default").click();
    cy.get("nb-tooltip").should("contain", "This is a tooltip");
  });

  it.only("test alert box", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    // 1
    // cy.get("tbody tr").first().find(".nb-trash").click();
    // cy.on("window:confirm", (confirm) => {
    //   expect(confirm).to.equal("Are you sure you want to delete?");
    // });

    // 2
    const stub = cy.stub();
    cy.on("window:confirm", stub);
    cy.get("tbody tr")
      .first()
      .find(".nb-trash")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          "Are you sure you want to delete?"
        );
      });

    //dont want to confirm
    // 3
    // cy.get("tbody tr").first().find(".nb-trash").click();
    // cy.on("window:confirm", () => false);
  });
});

// it.only("second test", () => {
//     cy.visit("/");
//     cy.contains("Forms").click();
//     cy.contains("Form Layouts").click();

//   });

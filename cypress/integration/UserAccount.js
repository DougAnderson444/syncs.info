/// <reference types="Cypress" />

const { expect } = require("chai");
import { mockUsername, mockDid, mockSubdomain } from "../../src/js/__tests__/mocks/index.js";

let testSubdomain = "test-subdomain"

before(() => {
  //
  cy.visit(`http://${testSubdomain}.localhost:3000`); // change URL to match your dev URL
});

describe("The Home Page", () => {
  it("successfully loads a subdomain", () => {

    const password = Cypress.env('password')
    
    //cy.visit(`http://${mockSubdomain}localhost:3000`); // change URL to match your dev URL
    cy.get("p#save-bar").contains("Temporary page.");
    cy.get('#save-button').click()
    //cy.get('#username').should('be.disabled').and('match', testSubdomain)
    cy.get('#password > .mdc-text-field__input').type(`${password}`);
    cy.get('#password-confirm > .mdc-text-field__input').type(`${password}{enter}`);
    cy.get(':nth-child(3) > :nth-child(3)').click()
    cy.get('.mdc-text-field__input').type(`My ${testSubdomain} machine`)
    cy.get('.mdc-button').click()
  });

  
});

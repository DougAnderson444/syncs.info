/// <reference types="Cypress" />

const { expect } = require("chai");

describe('The Home Page', () => {
	it('successfully loads', () => {
	  cy.visit('http://localhost:3000') // change URL to match your dev URL
	})
  })

describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("navigates to /about", () => {
    cy.get("nav a").contains("about").click();
    cy.url().should("include", "/about");
  });

  it("navigates to /blog", () => {
    cy.get("nav a").contains("blog").click();
	cy.url().should("include", "/blog");
  });
});
  
describe("Save bar", () => {
	
	it("has the save bar widget", () => {
	  cy.get("p#save-bar").contains("Temporary page.");
	});

	// click on the button
	// prompt for a password
	// create identity 
	// publish to IPNS
	// show IPNS link
	// and show backup phrases/link device?
	// show some basic sync component, widget, sssssss?


  });
describe("Make subdomain", () => {
	beforeEach(() => {
	  cy.visit("http://localhost:3000");
	});
  
	it("has the subdomain widget", () => {
	  cy.contains("span", "Get your page:");
	  cy.get("input#create-domain");
	  cy.get("button");
	});

	it("subdomain widget reject invalid subdomain names", () => {
		cy.get("input#create-domain").type("@doug{enter}");
		cy.get("span#error-message").contains('Invalid name. Try again!')
	  });
	  
	it("subdomain input resets error msg on change", () => {
		cy.get("input#create-domain").type("doug");
		expect("span#error-message").not.to.include('Invalid name. Try again!')
	  });

  });

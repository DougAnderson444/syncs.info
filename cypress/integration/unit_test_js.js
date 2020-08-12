/// <reference types="cypress" />

import fizzbuzz from "../../fizzbuzz";
// math exports a default object with methods
import math from "../../math";

import { savePage } from "../../src/js/process.js";
import { mockUsername, mockDid } from "../../src/js/__tests__/mocks/index.js";
import { expect, assert } from "chai";

describe("Save to fauna", () => {
  it("should check username in the database", async () => {
    let res = await fetch(`/api/get-page?page=${encodeURI(mockUsername)}`);
    //expect(res).to.equal(true)
  });

  it("should save a new username to the database", async () => {
    let res = await savePage({
      name: mockUsername,
      ipns: mockDid.replace("did:ipid:", "/ipns/"),
    });
    expect(res).to.equal(true);
  });
});

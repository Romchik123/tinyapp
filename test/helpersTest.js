const { assert } = require("chai");

const { helperGetUserByEmail } = require("../helpers");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = helperGetUserByEmail("user@example.com", testUsers);
    console.log(user);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user.id, expectedUserID);
  });

  it("should return undefined if we pass in an email that is not in our users database", function () {
    const user = helperGetUserByEmail("doesntExist@example.com", testUsers);
    console.log(user);
    const expectedUserID = undefined;
    // Write your assert statement here
    assert.equal(user, expectedUserID);
  });
});

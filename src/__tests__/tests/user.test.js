/* eslint-disable  no-underscore-dangle */
import "babel-polyfill";
import chai from "chai";
import expect from "expect";
import { makeUser, app, removeAllUsers } from "../helpers/commons/base";

chai.should();

const data = {
  email: "admin@mmdp.com",
  password: "secure",
  username: "tom",
  postUrl: "/api/auth",
  getAllUrl: "/api/users/",
  emailRequired: "please input the email",
  invalidEmail: "mmdp@mail",
  validEmailRequired: "please input a valid email"
};

const baseUrl = "/api/users/";

describe("Users", () => {
  describe("Create users", () => {
    beforeEach(async () => {
      await removeAllUsers();
    });
    it("should create a user successfully", async () => {
      const user = await makeUser();
      const res = await app.post(baseUrl).send({
        user
      });
      res.status.should.equal(201);
      expect(res.body).toMatchObject({
        user: {
          confirmed: false
        }
      });
    });
    it("should create a user successfully", async () => {
      const user = await makeUser();
      await app.post(baseUrl).send({
        user
      });
      const res = await app.post(baseUrl).send({
        user
      });
      res.status.should.equal(400);
      expect(res.body).toMatchObject({
        errors: { email: "This email is already taken" }
      });
    });
  });
});

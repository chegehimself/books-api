/* eslint-disable  no-underscore-dangle */
import chai from "chai";
import expect from "expect";
import { makeUser, app, removeAllUsers } from "../helpers/commons/base";

chai.should();

const baseUrl = "/api/users/";
const authBaseUrl = "/api/auth/";

const apiSignUp = async () => {
  const user = await makeUser();
  return app.post(baseUrl).send({
    user
  });
};

const apiActivateUser = token =>
  app.post(`${authBaseUrl}/confirmation`).send({
    token
  });

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
    it("should login user successfully", async () => {
      const user = await makeUser();
      await app.post(baseUrl).send({
        user
      });
      /* eslint-disable no-shadow */
      const res = await app.post(authBaseUrl).send({
        credentials: user
      });
      res.status.should.equal(200);
      expect(res.body).toMatchObject({
        user: { confirmed: false }
      });
    });
    it("should fail to login user with wrong credentials", async () => {
      const user = await makeUser();
      const res = await app.post(authBaseUrl).send({
        credentials: user
      });
      res.status.should.equal(400);
      expect(res.body).toMatchObject({
        errors: { global: "Invalid credentials" }
      });
    });
    it("should activate user properly", async () => {
      const user = await apiSignUp();
      /* eslint-disable prefer-destructuring */
      const token = user.body.user.token;
      const res = await apiActivateUser(token);
      res.status.should.equal(200);
      expect(res.body).toMatchObject({
        user: { confirmed: true }
      });
    });
    it("should fail to activate user with bad token", async () => {
      const token = "an invalid token";
      const res = await apiActivateUser(token);
      res.status.should.equal(400);
      expect(res.body).toMatchObject({});
    });
    it("should render a template for unavailable routes", async () => {
      const res = await app.get(authBaseUrl).send({});
      res.status.should.equal(200);
    });
  });
});

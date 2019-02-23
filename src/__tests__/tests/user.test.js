/* eslint-disable  no-underscore-dangle */
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
      const token = user.body.user.token;
      const res = await apiActivateUser(token);
      res.status.should.equal(200);
      expect(res.body).toMatchObject({
        user: { confirmed: true }
      });
    });
  });
});

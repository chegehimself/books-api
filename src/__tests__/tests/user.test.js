/* eslint-disable  no-underscore-dangle */
import chai from "chai";
import expect from "expect";
import {
  makeUser,
  app,
  removeAllUsers,
  createUser
} from "../helpers/commons/base";
import { generateExpiredToken } from "../helpers/commons/jwt";

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

const apiRequestPasswordResetLink = email =>
  app.post(`${authBaseUrl}/reset_password_request`).send({
    email
  });

const apiResetPassword = data =>
  app.post(`${authBaseUrl}/reset_password`).send({
    data
  });

const apiValidateToken = token =>
  app.post(`${authBaseUrl}/validate_token`).send({
    token
  });

describe("Users", () => {
  describe("Create users", () => {
    before(() => {
      app.close();
    });
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
    it("should send password reset link to the user", async () => {
      const user = await makeUser();
      await app.post(baseUrl).send({
        user
      });
      const res = await apiRequestPasswordResetLink(user.email);
      res.status.should.equal(200);
    });
    it("should fail to send password reset link if the email dont exist", async () => {
      const res = await apiRequestPasswordResetLink("fake@emal.com");
      res.status.should.equal(400);
    });
    it("should fail if email key is not existing", async () => {
      const res = await apiRequestPasswordResetLink();
      res.status.should.equal(400);
    });
    it("should fail to reset password with invalid token", async () => {
      const data = { password: "newPasswordbc", token: "invalid" };
      const res = await apiResetPassword(data);
      res.status.should.equal(401);
    });
    it("should validate user before password reset", async () => {
      const user = await makeUser();
      await app.post(baseUrl).send({
        user
      });
      const res = await apiRequestPasswordResetLink(user.email);
      const res1 = await apiValidateToken(res.body.user.token);
      res1.status.should.equal(200);
    });
    it("should fail to validate user with invalid token", async () => {
      const res1 = await apiValidateToken("invalidToken");
      res1.status.should.equal(401);
    });
    it("should reset password as expected", async () => {
      const user = await makeUser();
      await app.post(baseUrl).send({
        user
      });
      const res = await apiRequestPasswordResetLink(user.email);
      const res1 = await apiResetPassword({
        password: "newPassword",
        token: res.body.user.token
      });
      res1.status.should.equal(200);
    });
    it("should fail to reset password with wrong password", async () => {
      const res = await apiResetPassword({
        password: "newPassword",
        token: "invalid"
      });
      res.status.should.equal(401);
    });
    it("should fail to reset password if the user does not exist", async () => {
      const user = createUser();
      const token = generateExpiredToken({ _id: user._id, email: user.email });
      const res = await apiResetPassword({
        password: "newPassword",
        token
      });
      res.status.should.equal(404);
    });
  });
});

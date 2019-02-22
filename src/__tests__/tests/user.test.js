/* eslint-disable  no-underscore-dangle */
import "babel-polyfill";
import response from "../../constants/responseMessage";
import { makeUser, app } from "../helpers/commons/base";

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

const baseUrl = "/";

describe("Users", () => {
  describe("Create users", () => {
    it("should create a user successfully", async () => {
      const user = await makeUser();
      const res = await app.post(baseUrl).send({
        user
      });
      console.log(res.body);
      res.status.should.equal(201);
      res.body.message.should.equal(response.accountCreated);
      res.body.status.should.equal(status.SUCCESS);
    });
  });
});

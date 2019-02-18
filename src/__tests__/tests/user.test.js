/* eslint-disable  no-underscore-dangle */
import response from "../../constants/responseMessage";

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

describe("Users", () => {
  describe("Create users", () => {
    it("should create a user successfully", async () => {
      const user = await makeUser();
      const res = await app.post(data.postUrl).send({
        user
      });
      res.status.should.equal(201);
      res.body.message.should.equal(response.accountCreated);
      res.body.status.should.equal(status.SUCCESS);
    });
  });
});
